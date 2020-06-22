<script context="module">
    export async function preload()
    {
        const res = await this.fetch(`/c/all.json`);
        const articles = await res.json();
        return { articles };
    }
</script>

<script>
    import FakeTweet from '../components/FakeTweet.svelte';
    export let articles;
</script>

<style>
    h1, h2 {
        text-align: center;
    }
    h1, h2, p {
        margin: 0 auto;
    }
    h1 {
        font-size: 3rem;
        text-transform: uppercase;
    }
    figure {
        margin: 0;
    }
    img {
        object-fit: contain;
        max-width: 100%;
        margin: 1rem;
    }
    @media (min-width: 800px) {
        div.homepage {
            padding-top: 5rem !important;
        }
        h1.welcome {
            font-size: 8rem !important;
        }
        h2.desc {
            font-size: 2rem !important;
        }
    }
    @media (min-width: 1280px) {
        h1.welcome {
            font-size: 10rem !important;
        }
        h2.desc {
            font-size: 3.5rem !important;
        }
    }
    div.background {
        background: url('/cityscape.jpg') no-repeat center;
        background-size: cover;
        position: fixed;
        height: 24rem;
        width: 100%;
        z-index: 0;
        filter: blur(5px);
    }
    div.homepage {
        padding-top: 8rem;
        padding-bottom: 4rem;
        position: absolute;
        z-index: 1;
        margin: 0 auto;
        width: 100%;
    }
    h1.welcome, h2.desc {
        color: whitesmoke;
    }
    h1.welcome {
        margin-top: 1rem;
        font-size: 3.75rem;
    }
    h2 {
        text-transform: uppercase;
    }
    h2.desc {
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
    div.article-list {
        box-shadow: 0 0 5px #000;
    }
    div.article-meta {
        font-weight: bold;
    }
</style>

<svelte:head>
    <title>HOWFEED.BIZ</title>
</svelte:head>

<div class="background"></div>
<div class="homepage">
    <h1 class="welcome">Welcome</h1>
    <h2 class="desc">Find an Article</h2>
    <div class="article-list">
    {#each articles as {title, slug, image, created_at}}
        <a rel="prefetch" href={`/a/${slug}`}>
            <figure class="article-image">
                <img src={image || '/logo.png'} alt={title}>
            </figure>
            <div class="article-meta">
                <p class="article-title">{title}</p>
                <p class="article-date">{new Date(created_at).toLocaleDateString()}</p>
            </div>
        </a>
    {:else}
        <p>No articles have been published yet :(</p>
        <p>Come back soon!</p>
    {/each}
    </div>
</div>
