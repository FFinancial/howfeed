<script>
    import { goto } from '@sapper/app';

    let query = '';
</script>

<style>
    input {
        width: 440px;
    }
</style>

<div class="content">
    <h1>Search Results</h1>
    <p>You haven't entered any search terms.</p>
    <input type="text" placeholder="Search Articles" bind:value={query}>
    <button type="submit" on:click={() => { goto(`/search/${encodeURIComponent(query)}`); }}>Search</button>
</div>
