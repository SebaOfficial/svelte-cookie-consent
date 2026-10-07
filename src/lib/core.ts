import cookies from 'js-cookie';
import { v4 as uuid } from 'uuid';
import type { CookieConfig, Choices, FingerprintingConfig } from './types.js';

export default class CookieCore {
	constructor(
		private cookie: CookieConfig,
		private choices: Choices,
		private fingerprinting: boolean | FingerprintingConfig,
		private consentVersion?: string,
	) {}

	public save() {
		const data: { [k: string]: boolean | string } = Object.fromEntries(
			Object.entries(this.choices).map(([key, choice]) => [key, Boolean(choice.value)]),
		);
		if (this.consentVersion) data.__version = this.consentVersion;

		if (this.fingerprinting && (data.tracking || data.analytics)) {
			const existing = this.parseConsentCookie(cookies.get(this.cookie.name));
			const fp =
				existing?.fingerprint ??
				(this.fingerprinting === true ? uuid() : (this.fingerprinting.uuid ?? uuid()));

			if (this.fingerprinting !== true && this.fingerprinting.cookie) {
				const { name, ...config } = this.fingerprinting.cookie;
				cookies.set(name, fp, config);
			} else {
				data.fingerprint = fp;
			}
		} else if (this.fingerprinting !== true && this.fingerprinting.cookie) {
			const { name, path, domain } = this.fingerprinting.cookie;
			cookies.remove(name, { path, domain });
		}

		const { name, ...config } = this.cookie;
		cookies.set(name, JSON.stringify(data), config);

		Object.entries(this.choices).forEach(([key, choice]) => {
			void (data[key] ? choice.onAccepted?.() : choice.onRejected?.());
		});
	}

	public acceptAll() {
		Object.values(this.choices).forEach((choice) => {
			choice.value = true;
		});
		this.save();
	}

	public rejectAll() {
		Object.values(this.choices).forEach((choice) => {
			choice.value = Boolean(choice.mandatory);
		});
		this.save();
	}

	public getSaved(): Record<string, boolean | string> | undefined {
		const data = cookies.get(this.cookie.name);
		const parsed = this.parseConsentCookie(data);
		return parsed && (!this.consentVersion || parsed.__version === this.consentVersion)
			? parsed
			: undefined;
	}

	public loadSelections(selectedCookies: Record<string, boolean | string>) {
		Object.entries(selectedCookies).forEach(([key, value]) => {
			if (key !== 'fingerprint') {
				const choice = this.choices[key];
				if (choice) {
					choice.value = Boolean(value);
					void (value ? choice.onAccepted?.() : choice.onRejected?.());
				}
			}
		});
	}

	private parseConsentCookie(
		value: string | undefined,
	): Record<string, boolean | string> | undefined {
		if (!value) return undefined;

		try {
			const parsed: unknown = JSON.parse(value);
			return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
				? (parsed as Record<string, boolean | string>)
				: undefined;
		} catch {
			return undefined;
		}
	}
}
