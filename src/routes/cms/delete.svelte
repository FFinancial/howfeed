<script context="module">
    export async function preload(page, session)
    {
        if (!session.user || !session.user.author) {
            return this.redirect(302, '/cms');
        }
        const res = await this.fetch(`/c/all.json`);
        const json = await res.json();
        if (res.status === 200) {
            return { articles: json.articles, user: session.user };
        } else {
            this.error(res.status, json.message);
        }
    }
</script>

<svelte:head>
    <title>Delete Article | HOWFEED.BIZ</title>
</svelte:head>

<script>
    import { goto } from '@sapper/app';
    export let articles = [];

    async function del(article)
    {
        if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
            await fetch(`/a/${article.slug}.json`, {
                method: 'DELETE'
            });
            const res = await fetch(`/c/all.json`);
            articles = await res.json();
        }
    }
</script>

<div class="content">
    <a href="/cms">&lt; Back to Dashboard</a>
    <h1>Delete an Article</h1>
    <ul>
    {#each articles as article}
        <li>
            <strong>{article.title}</strong> by <strong>{article.author.realname}</strong>
            ({article.views} views)
            <button on:click={() => { del(article) }}>Delete</button>
        </li>
    {:else}
        <li>There are no published articles.</li>
    {/each}
    </ul>
</div>
