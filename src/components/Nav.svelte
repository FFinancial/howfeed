<script>
	export let segment;
</script>

<style>
    nav {
        border-bottom: 1px solid rgba(255,62,0,0.1);
        font-weight: 800;
        padding: 1rem 0 0 0;
        position: fixed;
        width: 100vw;
        z-index: 100;
        background-color: #fff;
    }
    div.items {
        margin: 0;
        padding: 0;
        display: flex;
        text-transform: uppercase;
        padding: 0 1.5rem;
    }
    div.filler {
        flex: 1 0 0;
    }
    div.items div::after {
        content: '';
        display: block;
        clear: both;
    }
    div.items div {
        display: block;
    }
    div.link a {
        text-decoration: none;
        padding: 0.5rem 0;
        display: block;
        font-size: 24px;
    }
    img.wordmark {
        height: 2.5rem;
    }
</style>

<nav>
    <div class="items">
        <div><a href="/"><img class="wordmark" src="/logo.png" alt="HowFeed.biz"></a></div>
        <div class="filler"></div>
        <div class="link"><a href="blog">Contact Us</a></div>
    </div>
</nav>
