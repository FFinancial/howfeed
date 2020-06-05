<script>
	export let segment;
</script>

<style>
    nav {
        font-weight: bold;
        padding: 1rem 0 0 0;
        position: fixed;
        width: 100vw;
        z-index: 100;
        background-color: #fff;
        top: 0;
    }
    div.items {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        text-transform: uppercase;
        padding: 0 1.5rem 0.25rem;
        align-items: start;
    }
    div.filler {
        flex: 1 0 0;
    }
    div.items div {
        display: block;
    }
    div.link a {
        text-decoration: none;
        font-size: 2rem;
    }
    img.wordmark {
        height: 3rem;
    }
    @media (min-width: 640px) {
        div.items {
            flex-direction: row;
            align-items: end;
        }
    }
</style>

<nav>
    <div class="items">
        <div><a href="/"><img class="wordmark" src="/logo.png" alt="HowFeed.biz"></a></div>
        <div class="filler"></div>
        <div class="link"><a href="mailto:the_katze@naver.com">Contact Us</a></div>
    </div>
</nav>
