<script context="module">
    export async function preload({ params, query }) {
        if (params.slug === 'all') {
            this.redirect(302, '/');
        }
        const res = await this.fetch(`c/${params.slug}.json`);
        const data = await res.json();

        if (res.status === 200) {
            return {
                articles: data.articles,
                category: data.category
            };
        } else {
            this.error(res.status, data.message);
        }
    }
</script>

<svelte:head>
    <title>{category.name} Articles | HOWFEED.BIZ</title>
    <meta name="description" content={`Read our articles about ${category.name} on HowFeed.biz.`}>
    <script type="application/ld+json">{`
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "HowFeed.biz",
        "item": "https://howfeed.biz"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "${article.category.name}",
        "item": "https://howfeed.biz/c/${article.category.slug}"
      }]
    }
    `}</script>
</svelte:head>

<style>
    h1 {
        margin: 0 auto;
        margin-top: 1rem;
        font-size: 2rem;
        font-size: 3rem;
        text-transform: uppercase;
        text-align: center;
    }
    @media (min-width: 800px) {
        h1 {
            font-size: 4rem;
        }
    }
    @media (min-width: 1280px) {
        h1 {
            font-size: 8rem;
        }
    }
</style>

<script>
    export let articles;
    export let category;
</script>

<div class="background"></div>
<div class="floaty">
    <h1>{category.name}</h1>
    <div class="article-list">
        <!-- ad goes here -->
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
        <p>No articles are in this category :(</p>
        <p>Check back soon!</p>
    {/each}
        <!-- ad goes here -->
    </div>
</div>
