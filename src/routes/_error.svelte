<script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<style>
	h1, p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
    }

	@media (min-width: 800px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Error {status} | HOWFEED.BIZ</title>
</svelte:head>

<div class="content">
    <h1>Error {status}</h1>
    <p>{error.message}</p>
    {#if dev && error.stack}
        <pre>{error.stack}</pre>
    {/if}
</div>
