<script lang="ts">
	import CookieCore from './core.js';
	import { onMount } from 'svelte';
	import type { BaseProps } from './types.js';
	import EditCookies from './EditCookies.svelte';
	import CustomizeCookies from './CustomizeCookies.svelte';

	const {
		cookie,
		heading,
		description,
		customize,
		choices = $bindable(),
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
	} = $props();

	let showConsent = $state(false);
	let showCustomize = $state(false);

	let escapeAction: 'close' | 'box' = $state('box');
	const core = new CookieCore(cookie, choices, fingerprinting);

	const saveChoices = () => {
		core.save();
		escapeAction = 'close';
	};

	const acceptAll = () => {
		core.acceptAll();
		showConsent = false;
		escapeAction = 'close';
	};

	const rejectAll = () => {
		core.rejectAll();
		showConsent = false;
		escapeAction = 'close';
	};

	const showCustomizeBtn = () => {
		showCustomize = true;
		document.documentElement.classList.add('blury-background-for-cookie-consent');
	};

	const closeCustomize = () => {
		document.documentElement.classList.remove('blury-background-for-cookie-consent');
		showCustomize = false;
		showConsent = escapeAction === 'box';
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
		showConsent = true;
		showCustomizeBtn();
	};

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
		aria-labelledby="cookie-consent-title"
		aria-describedby="cookie-consent-description"
		style="--bg-color: {bgColor}; --fg-color: {fgColor}"
	>
		{#if !showCustomize}
			{@render children?.()}
		{:else if customize}
			<CustomizeCookies
				{heading}
				{description}
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
