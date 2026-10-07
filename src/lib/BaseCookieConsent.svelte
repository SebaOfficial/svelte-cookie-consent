<script lang="ts">
	import CookieCore from './core.js';
	import { onMount, tick } from 'svelte';
	import type { BaseProps } from './types.js';
	import EditCookies from './EditCookies.svelte';
	import CustomizeCookies from './CustomizeCookies.svelte';

	const {
		cookie,
		heading,
		description,
		customize,
		choices = $bindable(),
		consentVersion,
		instanceId,
		editable,
		fingerprinting = true,
		bgColor,
		fgColor,
		position = 'right',
		acceptAllLabel,
		rejectAllLabel,
		customizeBtn,
		rejectAllBtn,
		acceptAllBtn,
		children,
	}: BaseProps & {
		customizeBtn: HTMLButtonElement | undefined;
		rejectAllBtn: HTMLButtonElement | undefined;
		acceptAllBtn: HTMLButtonElement | undefined;
		children?: import('svelte').Snippet;
		instanceId: string;
	} = $props();

	let showConsent = $state(false);
	let showCustomize = $state(false);
	let dialog: HTMLDivElement | undefined = $state();
	let previouslyFocused: HTMLElement | null = null;

	let escapeAction: 'close' | 'box' = $state('box');
	const core = $derived(new CookieCore(cookie, choices, fingerprinting, consentVersion));

	const saveChoices = () => {
		core.save();
		escapeAction = 'close';
	};

	const acceptAll = () => {
		core.acceptAll();
		showConsent = false;
		escapeAction = 'close';
		previouslyFocused?.focus();
		previouslyFocused = null;
	};

	const rejectAll = () => {
		core.rejectAll();
		showConsent = false;
		escapeAction = 'close';
		previouslyFocused?.focus();
		previouslyFocused = null;
	};

	const showCustomizeBtn = () => {
		previouslyFocused ??=
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		showCustomize = true;
		document.documentElement.classList.add('blury-background-for-cookie-consent');
	};

	const closeCustomize = () => {
		document.documentElement.classList.remove('blury-background-for-cookie-consent');
		showCustomize = false;
		showConsent = escapeAction === 'box';
		previouslyFocused?.focus();
		previouslyFocused = null;
	};

	const confirmCustomize = (e: Event) => {
		e.preventDefault();
		saveChoices();
		closeCustomize();
		showConsent = false;
	};

	const customizeAcceptAll = (e: Event) => {
		e.preventDefault();
		core.acceptAll();
		closeCustomize();
		showConsent = false;
	};

	const customizeRejectAll = (e: Event) => {
		e.preventDefault();
		core.rejectAll();
		closeCustomize();
		showConsent = false;
	};

	const editCookies = () => {
		previouslyFocused =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		showConsent = true;
		showCustomizeBtn();
	};

	const onDialogKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && showCustomize) {
			closeCustomize();
			return;
		}

		if (event.key !== 'Tab' || !dialog) return;
		const focusable = Array.from(
			dialog.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
			),
		);
		if (!focusable.length) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	$effect(() => {
		if (!showConsent) return;
		void tick().then(() => {
			dialog
				?.querySelector<HTMLElement>(
					'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
				)
				?.focus();
		});
	});

	onMount(() => {
		let selectedCookies = core.getSaved();
		// If the cookie isn't present show the box
		if (!selectedCookies) return void (showConsent = true);

		core.loadSelections(selectedCookies);

		escapeAction = 'close';
	});

	$effect(() => {
		const onCustomize = showCustomizeBtn;
		const onReject = rejectAll;
		const onAccept = acceptAll;

		customizeBtn?.addEventListener('click', onCustomize);
		rejectAllBtn?.addEventListener('click', onReject);
		acceptAllBtn?.addEventListener('click', onAccept);

		return () => {
			customizeBtn?.removeEventListener('click', onCustomize);
			rejectAllBtn?.removeEventListener('click', onReject);
			acceptAllBtn?.removeEventListener('click', onAccept);
		};
	});
</script>

{#if showConsent}
	<div
		role="dialog"
		tabindex="-1"
		aria-modal="true"
		aria-labelledby={`${instanceId}-title`}
		aria-describedby={`${instanceId}-description`}
		bind:this={dialog}
		onkeydown={onDialogKeydown}
		style="--bg-color: {bgColor}; --fg-color: {fgColor}"
	>
		{#if !showCustomize}
			{@render children?.()}
		{:else if customize}
			<CustomizeCookies
				{heading}
				{description}
				{instanceId}
				{customize}
				{choices}
				{acceptAllLabel}
				{rejectAllLabel}
				close={closeCustomize}
				save={confirmCustomize}
				acceptAll={customizeAcceptAll}
				rejectAll={customizeRejectAll}
			/>
		{/if}
	</div>
{:else if editable}
	<EditCookies onclick={editCookies} {position} />
{/if}

<style lang="scss">
	:global(.blury-background-for-cookie-consent) {
		pointer-events: none;
		overflow: hidden;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: inherit;
			backdrop-filter: blur(2px);
			filter: blur(2px);
			z-index: 0;
			pointer-events: none;
		}
	}
</style>
