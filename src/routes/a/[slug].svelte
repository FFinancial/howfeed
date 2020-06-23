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
    import { stores } from '@sapper/app';
    const { session } = stores();
    export let article;

    let author = '', content = '';

    async function postComment()
    {
        const res = await fetch(`/a/${article.slug}/comment`, {
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
        } else if (Array.isArray(json)) {
            article.comments = json;
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
        form input, form textarea {
            width: 25% !important;
        }
    }

    figure.article-image {
        width: auto;
        margin: 0;
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
        <blockquote>
            <p>Author: <strong>{article.author.realname}</strong></p>
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
    {#each article.comments as comment}
        <div class="comment">
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
    <form method="POST" action={`/a/${article.slug}/comment`}>
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
