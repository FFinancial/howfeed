<script context="module">
    export async function preload(page, session)
    {
        if (!session.user) {
            return this.redirect(302, '/cms/login');
        }
        return { user: session.user };
    }
</script>

<svelte:head>
    <title>Dashboard | HOWFEED.BIZ</title>
</svelte:head>

<script>
    import FakeTweet from '../../components/FakeTweet.svelte';

    export let user;
</script>

<div class="content">
    {#if user.author}
        <h1>HowFeed Publisher Dashboard</h1>
        <p><a href="/cms/create">Publish a new article</a></p>
        <p><a href="/cms/edit">Edit an existing article</a></p>
        <p><a href="/cms/delete">Delete an article</a></p>
        <h1>Account Settings</h1>
        <p><a href="/me/avatar">Change your avatar</a></p>
    {:else}
        <p>Welcome to your account. Contact the webmaster if your account needs publisher privileges.</p>
    {/if}
</div>
