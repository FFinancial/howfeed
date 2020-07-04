<script context="module">
    export async function preload()
    {
        const res = await this.fetch(`/c/all.json`);
        const { articles } = await res.json();
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
    @media (min-width: 800px) {
        h1.welcome {
            font-size: 8rem !important;
            display: block !important;
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
    h1.welcome {
        margin: 1rem 0;
        font-size: 3.75rem;
        font-size: 3rem;
        text-transform: uppercase;
        display: none;
    }
    h2.desc {
        margin-bottom: 1rem;
        font-size: 1.5rem;
        text-transform: uppercase;
    }
</style>

<svelte:head>
    <title>HOWFEED.BIZ</title>
</svelte:head>

<div class="background"></div>
<div class="floaty">
    <h1 class="welcome">Welcome</h1>
    <div class="article-list">
    {#each articles as {title, slug, image, created_at}}
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
        <p>No articles have been published yet :(</p>
        <p>Cheque back soon!</p>
    {/each}
    </div>
</div>
