<script context="module">
    export async function preload({ params, query }) {
        // the `slug` parameter is available because
        // this file is called [slug].svelte
        const articleRes = await this.fetch(`a/${params.slug}.json`);
        const article = await articleRes.json();

        const commentsRes = await this.fetch(`a/${params.slug}/comments`);
        const comments = await commentsRes.json();

        if (articleRes.status === 200 && commentsRes.status === 200) {
            return { article, comments };
        } else if (articleRes.status !== 200) {
            this.error(articleRes.status, article.message);
        } else {
            this.error(commentsRes.status, comments.message);
        }
    }
</script>

<script>
    import { stores } from '@sapper/app';
    const { session } = stores();
    export let article;
    export let comments;

    let author = '', content = '';

    async function postComment()
    {
        const res = await fetch(`/a/${article.slug}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ author, content })
        });
        const json = await res.json();
        if (json.message) {
            alert(json.message);
        } else {
            const res = await fetch(`/a/${article.slug}/comments`);
            comments = await res.json();
            author = content = '';
        }
    }
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
    :global(.article-content) {
        font-size: 18px;
        font-family: 'EB Garamond';
    }

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

    .content :global(img) {
        max-width: 100%;
        height: auto;
    }

    div.article-image {
        height: 12rem;
        width: auto;
        margin: -2rem;
        margin-bottom: 1rem;
        background: #81b0cd;
    }

    div.article-image img {
        box-shadow: -5px 5px 1rem black;
        height: 100%;
    }

    div.article-meta {
        margin: 0 0 2rem 0;
        padding: 0;
    }

    div.article-meta blockquote {
        border-left: 2px solid gray;
        padding-left: 0.5rem;
        margin: 0;
    }

    div.article-meta h1 {
        margin-bottom: 0;
    }

    form input, form textarea {
        width: 100%;
    }

    span.comment-username {
        font-weight: bold;
    }

    span.comment-verified {
        font-style: italic;
    }

    div.comment {
        background-color: rgb(150, 200, 234);
        border: 1px solid #508FC3;
        padding: 1rem;
        margin-bottom: 0.5rem;
    }

    p.comment-meta {
        margin: 0;
    }

    div.article-content {
        margin-bottom: 2rem;
    }

    div.comment-content {
        word-break: break-word;
    }

    @media (min-width: 800px) {
        .content {
            width: 75vw;
        }
        form input, form textarea {
            width: 25%;
        }
        div.article-image {
            height: 24rem;
        }
    }
</style>

<svelte:head>
    <title>{article.title} | HOWFEED.BIZ</title>
</svelte:head>

<div class="content">
    <div class="article-image">
        <img alt={article.title} src={`/a/${article.image}`}>
    </div>
    <div class="article-meta">
        <h1 class="article-title">{article.title}</h1>
        <blockquote>
            <p>Author: <img class="avatar" alt={article.author.realname} src={`/u/${article.author.avatar || 'default.jpg'}`}> <strong>{article.author.realname}</strong></p>
            <p>Category: <strong><a href={`/c/${article.category.slug}`}>{article.category.name}</a></strong></p>
            <p>Published: <strong>{new Date(article.created_at).toLocaleString()}</strong></p>
            <p>Views: <strong>{article.views}</strong></p>
        </blockquote>
    </div>
    <div class="article-content">
        {@html article.html}
    </div>
    <hr>
    <h3>Comments</h3>
    <div class="comments">
    {#each comments as comment}
        <div class="comment">
            {#if comment.author_user}
                <img class="avatar" alt={comment.author_user.realname} src={`/u/${comment.author_user.avatar || 'default.jpg'}`}>
            {/if}
            <p class="comment-meta">
            {#if comment.author_user}
                <span class="comment-username">{comment.author_user.realname}</span> <span class="comment-verified">(verified)</span> - {new Date(comment.created_at).toLocaleString()}
            {:else}
                <span class="comment-username">{comment.author}</span> - {new Date(comment.created_at).toLocaleString()}
            {/if}
            </p>
            <div class="comment-content">{comment.content}</div>
        </div>
    {:else}
        <p>No comments.</p>
    {/each}
    </div>
    <h3>Add a Comment</h3>
    <form method="POST" action={`/a/${article.slug}/comments`}>
        <p>Name:
        {#if $session.user}
            <input type="text" disabled value={$session.user.realname}>
        {:else}
            <input type="text" bind:value={author} name="author" maxlength="100" placeholder="Anonymous">
        {/if}
        </p>
        <p><textarea name="content" bind:value={content} maxlength="5000"></textarea></p>
        <p><button type="submit" on:click|preventDefault={postComment}>Submit</button></p>
    </form>
</div>
