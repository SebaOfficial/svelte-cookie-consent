<script lang="ts">
	import { onMount } from 'svelte';
	import type { BaseProps } from './types.js';

	type Props = {
		heading: BaseProps['heading'];
		description: BaseProps['description'];
		customize: Exclude<BaseProps['customize'], false>;
		choices: BaseProps['choices'];
		acceptAllLabel: BaseProps['acceptAllLabel'];
		rejectAllLabel: BaseProps['rejectAllLabel'];
		close: () => void;
		save: (e: Event) => void;
		acceptAll: (e: Event) => void;
		rejectAll: (e: Event) => void;
		instanceId: string;
	};

	const {
		heading,
		description,
		customize,
		choices,
		acceptAllLabel,
		rejectAllLabel,
		close,
		save,
		acceptAll,
		rejectAll,
		instanceId,
	}: Props = $props();

	let container: HTMLDivElement | undefined = $state();

	let onclick = $state((_e: MouseEvent) => {});

	const onkeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			close();
		}
	};

	onMount(() => {
		// Prevents misclicks and/or double cliks on the "Customize" button
		setTimeout(() => {
			onclick = (e: MouseEvent) => {
				if (!container?.contains(e.target as Node)) {
					close();
				}
			};
		}, 100);
	});

	const handleLinkClick = () => {
		close();
	};

	$effect(() => {
		const links = Array.from(container?.querySelectorAll('a') || []);
		links.forEach((link) => {
			link.addEventListener('click', handleLinkClick);
		});

		return () => {
			links.forEach((link) => {
				link.removeEventListener('click', handleLinkClick);
			});
		};
	});
</script>

<div
	class="customize"
	role="dialog"
	aria-modal="true"
	aria-labelledby={`${instanceId}-customize-title`}
	aria-describedby={`${instanceId}-customize-description`}
	bind:this={container}
>
	<div>
		<h3 id={`${instanceId}-customize-title`}>
			{#if typeof heading === 'object' && 'html' in heading}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html heading.html}
			{:else}
				{typeof heading === 'string' ? heading : heading.text}
			{/if}
		</h3>
		<button
			type="button"
			onclick={close}
			class="close"
			aria-label={customize.ariaLabel ?? 'Close cookie preferences'}>&#x2715;</button
		>
		<p id={`${instanceId}-customize-description`}>
			{#if typeof description === 'object' && 'html' in description}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html description.html}
			{:else}
				{typeof description === 'string' ? description : description.text}
			{/if}
		</p>
	</div>

	<form onsubmit={save}>
		<h4>{customize.chooseLabel}</h4>
		{#each Object.entries(choices) as [key, choice] (key)}
			<div class="choice">
				<input
					type="checkbox"
					id={`${instanceId}-choice-${key}`}
					bind:checked={choice.value}
					disabled={choice.mandatory}
				/>
				<label for={`${instanceId}-choice-${key}`}>
					<strong>
						{#if typeof choice.label === 'object' && 'html' in choice.label}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html choice.label.html}
						{:else}
							{typeof choice.label === 'string' ? choice.label : choice.label.text}
						{/if}
					</strong>
					-
					{#if typeof choice.description === 'object' && 'html' in choice.description}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html choice.description.html}
					{:else}
						{typeof choice.description === 'string' ? choice.description : choice.description.text}
					{/if}
				</label>
			</div>
		{/each}

		<div class="button-group">
			{#if customize.showAcceptRejectAllButtons}
				{#if rejectAllLabel}
					<button type="button" onclick={rejectAll} class="reject">
						{#if typeof rejectAllLabel === 'object' && 'html' in rejectAllLabel}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html rejectAllLabel.html}
						{:else}
							{typeof rejectAllLabel === 'string' ? rejectAllLabel : rejectAllLabel.text}
						{/if}
					</button>
				{/if}
				{#if acceptAllLabel}
					<button type="button" onclick={acceptAll} class="accept">
						{#if typeof acceptAllLabel === 'object' && 'html' in acceptAllLabel}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html acceptAllLabel.html}
						{:else}
							{typeof acceptAllLabel === 'string' ? acceptAllLabel : acceptAllLabel.text}
						{/if}
					</button>
				{/if}
			{/if}
			<button type="submit" class="confirm">{customize.confirmLabel}</button>
		</div>
	</form>
</div>

<svelte:window {onkeydown} {onclick} />

<style lang="scss">
	.customize {
		z-index: 9999;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(1000px, 80vw);
		background-color: var(--bg-color);
		color: var(--fg-color);
		padding: 30px;
		pointer-events: auto;
		backdrop-filter: 'blur(5px)';
		border-radius: 10px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

		> div {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
			position: relative;

			h3 {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 10px;
			}

			button {
				position: absolute;
				right: 10px;
				top: -10px;
				font-size: large;
				font-weight: bolder;
				cursor: pointer;
				background-color: inherit;
				color: inherit;
				border: none;
			}

			p {
				font-size: 14px;
				line-height: 1.5;
				margin-bottom: 16px;
			}
		}

		form {
			h4 {
				font-size: 16px;
				margin: 16px 0 10px;
			}

			.choice {
				display: flex;
				align-items: flex-start;
				gap: 0.5rem;

				input[type='checkbox'] {
					transform: scale(1.1);
				}

				label {
					display: inline-block;
					font-size: 14px;
					margin-bottom: 10px;
					line-height: 1.4;

					strong {
						font-weight: 600;
					}
				}
			}

			button {
				cursor: pointer;
				font-weight: 600;
				padding: 10px;
				border: 2px solid white;
				transition: all 0.7s;
				border-radius: 5px;
				font-size: medium;

				&:hover {
					color: inherit;
					background-color: rgba(128, 128, 128, 0.2);
				}
			}

			.button-group {
				display: flex;
				gap: 10px;
				margin-top: 16px;

				button {
					flex: 1;

					&.confirm {
						flex: 2;
					}
				}
			}
		}
	}
</style>
