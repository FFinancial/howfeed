<script context="module">
    export async function preload({ params, query }) {
        // the `slug` parameter is available because
        // this file is called [slug].svelte
        const res = await this.fetch(`a/${params.slug}.json`);
        const data = await res.json();

        if (res.status === 200) {
            return { article: data };
        } else {
            this.error(res.status, data.message);
        }
    }
</script>

<script>
    export let article;
</script>

<style>
    /*
        By default, CSS is locally scoped to the component,
        and any unused styles are dead-code-eliminated.
        In this page, Svelte can't know which elements are
        going to appear inside the {{{article.html}}} block,
        so we have to use the :global(...) modifier to target
        all elements inside .content
    */
    .content :global(h2) {
        font-size: 1.4em;
        font-weight: 500;
    }

    .content :global(pre) {
        background-color: #f9f9f9;
        box-shadow: inset 1px 1px 5px rgba(0,0,0,0.05);
        padding: 0.5em;
        border-radius: 2px;
        overflow-x: auto;
    }

    .content :global(pre) :global(code) {
        background-color: transparent;
        padding: 0;
    }

    .content :global(ul) {
        line-height: 1.5;
    }

    .content :global(li) {
        margin: 0 0 0.5em 0;
    }

    @media (min-width: 800px) {
        .content {
            width: 75vw;
        }
    }

    figure.article-image {
        width: auto;
        margin: 0;
    }

    div.article-meta {
        margin: 0 0 4rem 0;
        padding: 0;
    }

    div.article-meta h1 {
        margin-bottom: 0;
    }
</style>

<svelte:head>
    <title>{article.title} | HOWFEED.BIZ</title>
</svelte:head>

<div class="content">
    <figure class="article-image">
        <img alt={article.title} src={article.image}>
    </figure>
    <div class="article-meta">
        <h1 class="article-title">{article.title}</h1>
        <p>Author: <strong>{article.author.realname}</strong></p>
        <p>Published: <strong>{new Date(article.created_at).toLocaleString()}</strong></p>
        <p>Views: <strong>{article.views}</strong></p>
    </div>
    {@html article.html}
</div>
