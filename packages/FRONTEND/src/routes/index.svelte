<script lang="ts">
	import { onMount } from 'svelte';
	import marked from 'marked';
	import '../github-markdown.css';

	let data = [];
	let generated = '';
	onMount(async () => {
		const res = await fetch(
			'https://raw.githubusercontent.com/shitcorp/TODOBOT/main/docs/data/commands.json'
		);
		const j = await res.json();
		data = j.commands;
		const firstCommand = await fetch(
			`https://raw.githubusercontent.com/shitcorp/TODOBOT/main/docs/data/assign.md`
		);
		const text = await firstCommand.text();
		generated = marked(text);
	});
	const handleClick = async ({ target }) => {
		const res = await fetch(
			`https://raw.githubusercontent.com/shitcorp/TODOBOT/main/docs/data/${data[target.id]}.md`
		);
		const text = await res.text();
		generated = marked(text);
		console.log(text);
	};
</script>

<div class="container">
	<ul style="padding: 35px">
		{#each data as cmd, index}
			<li id={index.toString()} on:click={handleClick}>
				<button id={index.toString()} on:click={handleClick} class="btn">{cmd}</button>
			</li>
		{/each}
	</ul>

	<article class="markdown-body">
		{#if generated !== ''}
			{@html generated}
		{/if}
	</article>
</div>

<style>
	.btn {
		outline: none;
		background: none;
		padding: 4px;
	}
	.container {
		display: flex;
		flex-direction: row;
	}

	.markdown-body {
		box-sizing: border-box;
		min-width: 620px;
		max-width: 620px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
		.container {
			flex-direction: column;
		}
	}
</style>
