<script context="module">
    export async function preload()
    {
        const res = await this.fetch(`/c/all.json`);
        const { articles } = await res.json();
        return { articles };
    }
</script>

<script>
    export let articles;
</script>

<style>
    h1, h2 {
        text-align: center;
    }
    h1, h2, p {
        margin: 0 auto;
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
    @media (min-width: 800px) {
        h1.welcome {
            font-size: 8rem;
            display: block;
        }
        h2.desc {
            font-size: 2rem;
        }
    }
    @media (min-width: 1280px) {
        h1.welcome {
            font-size: 10rem;
        }
        h2.desc {
            font-size: 3.5rem;
        }
    }
</style>

<svelte:head>
    <title>HOWFEED.BIZ</title>
    <meta name="description" content="HOWFEED.BIZ: Helping you to navigate a modern world.">
</svelte:head>

<div class="background"></div>
<div class="floaty">
    <h1 class="welcome">Welcome</h1>
    <div class="article-list">
		<div id="585399492">
			<script type="text/javascript">
				try {
					window._mNHandle.queue.push(function (){
						window._mNDetails.loadTag("585399492", "300x250", "585399492");
					});
				}
				catch (error) {}
			</script>
		</div>
    {#each articles as {title, slug, image, created_at}}
        <a href={`/a/${slug}`}>
            <div class="article-image">
                <img src={image ? `/a/${image}` : '/logo.png'} alt={title}>
            </div>
            <div class="article-meta">
                <p class="article-title">{title}</p>
                <p class="article-date">{new Date(created_at).toLocaleDateString()}</p>
            </div>
        </a>
    {:else}
        <p>No articles have been published yet :(</p>
        <p>Cheque back soon!</p>
    {/each}
		<div id="585399492">
			<script type="text/javascript">
				try {
					window._mNHandle.queue.push(function (){
						window._mNDetails.loadTag("585399492", "300x250", "585399492");
					});
				}
				catch (error) {}
			</script>
		</div>
    </div>
</div>
