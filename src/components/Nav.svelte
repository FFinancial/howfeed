<script>
    import { stores } from '@sapper/app';
    const { session } = stores();
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
        box-shadow: 0 -2px 5px #000;
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
        font-size: 1.5rem;
    }
    img.wordmark {
        height: 3rem;
        max-width: 100%;
        object-fit: contain;
    }
    @media (min-width: 800px) {
        div.items {
            flex-direction: row;
            align-items: end;
        }
        div.link a {
            font-size: 2rem !important;
        }
    }
</style>

<nav>
    <div class="items">
        <div><a href="/"><img class="wordmark" src="/logo.png" alt="HowFeed.biz"></a></div>
        <div class="filler"></div>
        {#if !$session.user}
            <div class="link"><a href="mailto:the_katze@naver.com">Contact Us</a></div>
        {:else}
            <div class="link"><a href="/cms/logout">Logout</a></div>
        {/if}
    </div>
</nav>
