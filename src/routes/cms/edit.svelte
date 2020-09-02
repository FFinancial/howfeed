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
    <title>Edit Article | HOWFEED.BIZ</title>
</svelte:head>

<script>
    import { goto } from '@sapper/app';
    export let articles = [];
</script>

<div class="content">
    <a href="/cms">&lt; Back to Dashboard</a>
    <h1>Edit an Article</h1>
    <p>Choose an article to edit:</p>
    <ul>
    {#each articles as article}
        <li>
            <a href={`/cms/create?edit=${encodeURIComponent(article.slug)}`}>
                <strong>{article.title}</strong> by <strong>{article.author.realname}</strong>
                ({article.views} views)
            </a>
        </li>
    {:else}
        <li>There are no published articles.</li>
    {/each}
    </ul>
</div>
