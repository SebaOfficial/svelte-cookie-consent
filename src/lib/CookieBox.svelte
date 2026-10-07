<svelte:options
	customElement={{
		tag: 'cookie-box',
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
		position = 'right',
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
	{position}
	{customizeBtn}
	{rejectAllBtn}
	{acceptAllBtn}
>
	<div class="box" class:right={position === 'right'} class:left={position === 'left'}>
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
	.box {
		z-index: 9999;
		position: fixed;
		bottom: 1vw;
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 500px;
		background-color: var(--bg-color);
		color: var(--fg-color);
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);

		&.right {
			right: 1vw;
			margin-left: 1vw;
		}

		&.left {
			left: 1vw;
			margin-right: 1vw;
		}

		h3 {
			font-size: larger;
			font-weight: 500;
			margin-top: 0;
		}

		.actions {
			display: flex;
			justify-content: flex-end;
			gap: 15px;

			@media (max-width: 600px) {
				flex-direction: column;
				align-items: center;

				button {
					width: 100%;
				}
			}
		}
	}

	button {
		cursor: pointer;
		padding: 10px;
		border: 2px solid var(--fg-color);
		color: var(--bg-color);
		transition: all 0.7s;
		border-radius: 5px;
		font-size: medium;
		width: calc(100% / 3);

		&#customize {
			background-color: inherit;
			color: inherit;
			border: none;
			font-size: 1.1em;
		}

		&:hover {
			color: inherit;
			background-color: rgba(128, 128, 128, 0.2);
		}
	}
</style>
