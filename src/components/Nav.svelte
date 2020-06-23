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
        padding: 1rem 0 0 0;
        position: fixed;
        width: 100%;
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
    div.search {
        flex: 1 0 0;
        margin: auto 0;
        display: flex;
    }
    div.link a {
        text-decoration: none;
        font-size: 1.5rem;
    }
    img.wordmark {
        height: 3rem;
        max-width: 100%;
        object-fit: contain;
        margin-right: 3rem;
    }
    @media (min-width: 800px) {
        div.items {
            flex-direction: row;
            align-items: end;
        }
        div.link a {
            font-size: 2rem !important;
            margin-left: 4rem;
        }
    }
    div.search {
        width: 100%;
    }
    input.search {
        width: 100%;
        height: 1.5rem;
        font-size: 1rem;
        margin: 0 auto;
        text-align: center;
    }
</style>

<nav>
    <div class="items">
        <div><a href="/"><img class="wordmark" src="/logo.png" alt="HowFeed.biz"></a></div>
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
