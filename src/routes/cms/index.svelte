<script context="module">
    export async function preload(page, session)
    {
        if (!session.user) {
            return this.redirect(302, '/cms/login');
        }
        return { user: session.user };
    }
</script>

<script>
    import { onMount } from 'svelte';
    import Editor from 'cl-editor/src/Editor.svelte';

    let editor;

    function preview()
    {
        alert(editor.getHtml(true));
    }
</script>

<svelte:head>
    <title>Publish | HOWFEED.BIZ</title>
</svelte:head>

<div class="content">
    <h1>HowFeed Publisher</h1>
    <form method="POST" action="/cms/article">
        <Editor bind:this={editor} />
        <button on:click|preventDefault={preview}>Preview</button>
        <button type="submit">Submit</button>
    </form>
</div>
