<svelte:options
	customElement={{
		tag: 'cookie-banner',
	}}
/>

<script lang="ts">
	import type { BaseProps } from './types.js';
	import BaseCookieConsent from './BaseCookieConsent.svelte';

	let customizeBtn: HTMLButtonElement | undefined = $state();
	let rejectAllBtn: HTMLButtonElement | undefined = $state();
	let acceptAllBtn: HTMLButtonElement | undefined = $state();
	const instanceId = `cookie-consent-${Math.random().toString(36).slice(2)}`;

	const {
		cookie,
		heading,
		description,
		acceptAllLabel,
		rejectAllLabel,
		customize,
		choices = $bindable(),
		consentVersion,
		editable = true,
		fingerprinting = false,
		bgColor = '#000000',
		fgColor = '#ffffff',
	}: BaseProps = $props();

	const contentText = (content: BaseProps['heading']) =>
		typeof content === 'string' ? content : 'text' in content ? content.text : null;
</script>

<BaseCookieConsent
	{cookie}
	{heading}
	{description}
	{consentVersion}
	{instanceId}
	{acceptAllLabel}
	{rejectAllLabel}
	{customize}
	{choices}
	{editable}
	{fingerprinting}
	{bgColor}
	{fgColor}
	{customizeBtn}
	{rejectAllBtn}
	{acceptAllBtn}
>
	<div class="banner">
		<div>
			<h3 id={`${instanceId}-title`} style={typeof heading == 'object' ? heading.style : undefined}>
				{#if typeof heading === 'object' && 'html' in heading}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html heading.html}
				{:else}
					{contentText(heading)}
				{/if}
			</h3>
			<p
				id={`${instanceId}-description`}
				style={typeof description == 'object' ? description.style : undefined}
			>
				{#if typeof description === 'object' && 'html' in description}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html description.html}
				{:else}
					{contentText(description)}
				{/if}
			</p>
		</div>

		<div class="actions">
			{#if customize}
				<button type="button" id="customize" style={customize.style} bind:this={customizeBtn}>
					{customize.label}
				</button>
			{/if}
			{#if rejectAllLabel}
				<button
					type="button"
					id="reject"
					style={typeof rejectAllLabel === 'object' ? rejectAllLabel.style : undefined}
					bind:this={rejectAllBtn}
				>
					{#if typeof rejectAllLabel === 'object' && 'html' in rejectAllLabel}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html rejectAllLabel.html}
					{:else}
						{typeof rejectAllLabel === 'string' ? rejectAllLabel : rejectAllLabel.text}
					{/if}
				</button>
			{/if}
			{#if acceptAllLabel}
				<button
					type="button"
					id="accept"
					style={typeof acceptAllLabel === 'object' ? acceptAllLabel.style : undefined}
					bind:this={acceptAllBtn}
				>
					{#if typeof acceptAllLabel === 'object' && 'html' in acceptAllLabel}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html acceptAllLabel.html}
					{:else}
						{typeof acceptAllLabel === 'string' ? acceptAllLabel : acceptAllLabel.text}
					{/if}
				</button>
			{/if}
		</div>
	</div>
</BaseCookieConsent>

<style lang="scss">
	$mobile-size: 600px;

	.banner {
		z-index: 9999;
		position: fixed;
		bottom: 1vw;
		left: 1vw;
		right: 1vw;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
		display: flex;
		flex-direction: row;
		width: 95vw;
		background-color: var(--bg-color);
		color: var(--fg-color);
		padding: 12px 16px;
		margin: auto;

		@media (max-width: $mobile-size) {
			flex-direction: column;
			align-items: center;
		}

		h3 {
			font-size: 1em;
			font-weight: 400;
			margin-top: 0;
			margin-bottom: 5px;
		}

		p {
			margin: 0;
			font-size: 0.9em;
		}

		.actions {
			width: calc(100% / 3);
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: 15px;

			button {
				cursor: pointer;
				padding: 5px;
				border: 2px solid var(--fg-color);
				color: var(--bg-color);
				transition: all 0.7s;
				font-size: 0.9em;
				width: calc(100% / 3);
				height: 50%;

				&#customize {
					background-color: inherit;
					color: inherit;
					border: none;
					font-size: 1em;
				}

				&:hover {
					color: inherit;
					background-color: rgba(128, 128, 128, 0.2);
				}
			}

			@media (max-width: $mobile-size) {
				flex-direction: column;
				align-items: center;
				width: 100%;
				margin-top: 15px;

				button {
					width: 100%;
				}
			}
		}
	}
</style>
