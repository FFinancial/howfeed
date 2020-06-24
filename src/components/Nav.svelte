<script>
    import { stores, goto } from '@sapper/app';
    const { session } = stores();

    let query = '';

    function search(e)
    {
        if (e.keyCode === 13) {
            goto(`/search/${encodeURIComponent(query)}`);
        }
    }
</script>

<style>
    nav {
        font-weight: bold;
        position: absolute;
        padding: 0.5rem;
        margin: 0 auto;
        width: 85%;
        z-index: 100;
        background-color: white;
        top: 1rem;
        left: 0;
        right: 0;
        box-shadow: 0 2px 0.5rem black;
    }
    div.items {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        text-transform: uppercase;
        align-items: center;
    }
    div.search {
        flex: 1 0 0;
        display: flex;
    }
    div.link a {
        text-decoration: none;
        font-size: 2rem;
    }
    div.wordmark {
        flex: 1 0 64px;
    }
    img.wordmark {
        height: 3rem;
        max-width: 100%;
        object-fit: contain;
    }
    @media (min-width: 800px) {
        div.items {
            flex-direction: row;
        }
        div.link a {
            font-size: 1.5rem !important;
            margin-left: 2rem;
        }
        div.search {
            margin-left: 1rem;
        }
    }
    @media (min-width: 1280px) {
        div.link a {
            font-size: 2rem !important;
            margin-left: 4rem;
        }
    }
    div.search {
        width: 100%;
        flex: 1 0 64px;
    }
    input.search {
        width: 100%;
        height: 2.75rem;
        font-size: 2rem;
        margin: 0 auto;
        border: 0.25rem solid black;
    }
    input.search:focus::placeholder {
        opacity: 0;
    }
    input.search::placeholder {
        opacity: 1;
        font-weight: bold;
        font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }
</style>

<nav>
    <div class="items">
        <div class="wordmark"><a href="/"><img class="wordmark" src="/logo.png" alt="HowFeed.biz"></a></div>
        <div class="search">
            <input class="search" on:keyup={search} bind:value={query} type="text" placeholder="Search">
        </div>
        {#if !$session.user}
            <div class="link"><a href="/contact">Contact Us</a></div>
        {:else}
            <div class="link"><a href="/cms">Dashboard</a></div>
            <div class="link"><a href="/cms/logout">Logout</a></div>
        {/if}
    </div>
</nav>
