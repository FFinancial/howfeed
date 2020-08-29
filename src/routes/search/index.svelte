<script context="module">
    export async function preload({ query })
    {
        if (query && query.query) {
            let q = query.query;
            const res = await this.fetch(`/search.json?query=${encodeURIComponent(q)}`);
            const json = await res.json();
            if (res.status === 200) {
                return { query: q, results: json };
            } else {
                this.error(res.status, res.message);
            }
        } else {
            return { query: null, results: [] };
        }
    }
</script>

<script>
    export let query;
    export let results;
</script>

<style>
    h1 {
        margin: 1rem auto;
        font-size: 2rem;
        font-size: 3rem;
        text-transform: uppercase;
        text-align: center;
        max-width: 80%;
    }
</style>

<svelte:head>
    <title>{query ? `Search Results for: ${query}` : 'Search Results'} | HOWFEED.BIZ</title>
</svelte:head>

{#if query}
<div class="background"></div>
<div class="floaty">
    <h1>Search Results for: {query}</h1>
    <div class="article-list">
    {#each results as {title, slug, image, created_at}}
        <a rel="prefetch" href={`/a/${slug}`}>
            <div class="article-image">
                <img src={image ? `/a/${image}` : '/logo.png'} alt={title}>
            </div>
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
{:else}
<div class="content">
    <h1>Search Results</h1>
    <p>You haven't entered any search terms.</p>
    <form action="/search" method="GET">
        <input type="text" placeholder="Search Articles" name="query">
        <button type="submit">Search</button>
    </form>
</div>
{/if}
