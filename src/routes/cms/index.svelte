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

<div class="content">
    <h1>HowFeed Publisher Dashboard</h1>
    <p><a href="/cms/create">Publish a new article</a></p>
    <p><a href="/cms/update">Edit an existing article</a></p>
    <p><a href="/cms/delete">Delete an article</a></p>
</div>
