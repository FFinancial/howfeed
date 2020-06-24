<script context="module">
    export async function preload({ params })
    {
        let query = params.query;
        const res = await this.fetch(`/search.json?query=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (res.status === 200) {
            return { query, results: json };
        } else {
            this.error(res.status, res.message);
        }
    }
</script>

<script>
    export let query;
    export let results;
</script>

<style>
    h1 {
        margin: 0 auto;
        margin-top: 1rem;
        font-size: 2rem;
        font-size: 3rem;
        text-transform: uppercase;
        text-align: center;
        max-width: 80%;
    }
</style>

<svelte:head>
    <title>Search Results for: {query} | HOWFEED.BIZ</title>
</svelte:head>

<div class="background"></div>
<div class="floaty">
    <h1>Search Results for: {query}</h1>
    <div class="article-list">
    {#each results as {title, slug, image, created_at}}
        <a rel="prefetch" href={`/a/${slug}`}>
            <figure class="article-image">
                <img src={image ? `/a/${image}` : '/logo.png'} alt={title}>
            </figure>
            <div class="article-meta">
                <p class="article-title">{title}</p>
                <p class="article-date">{new Date(created_at).toLocaleDateString()}</p>
            </div>
        </a>
    {:else}
        <p>No results found :(</p>
    {/each}
    </div>
</div>
