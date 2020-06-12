<script context="module">
    export async function preload(page, session)
    {
        if (!session.user || !session.user.author) {
            return this.redirect(302, '/cms');
        }
        return { user: session.user };
    }
</script>

<script>
    import { stores, goto } from '@sapper/app';
    import Editor from 'cl-editor/src/Editor.svelte';

    const { session } = stores();

    let editor;
    let title = '', image = '';

    let actions = [
        'viewHtml', 'undo', 'redo', 'b', 'i', 'u', 'strike', 'sup', 'sub', 'h1', 'h2', 'p', 'blockquote',
        'ol', 'ul', 'hr', 'left', 'right', 'center', 'justify', 'a', 'image', 'forecolor', 'backcolor', 'removeFormat',
        {
            name: 'fakeTweet',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">' +
                  '<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.' +
                  '951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797' +
                  ' 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566' +
                  '-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444' +
                  ' 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 ' +
                  '14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>',
            title: 'Fake Tweet',
            result: () => {
                editor.exec('insertText', '<FakeTweet message="SAD!" author="Donald J. Trump"' +
                    ' verified likes=1488 replies=6969 handle="realDonaldTrump"' +
                    ' avatar="https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg" />');
            }
        }
    ];

    async function submit()
    {
        let html = editor.getHtml(true);
        const res = await fetch(`/cms/article`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ html, image, title })
        });
        const json = await res.json();
        goto(`/a/${json.slug}`);
    }
</script>

<style>
    input[type=text] {
        width: 70%;
    }
</style>

<svelte:head>
    <title>Publish Article | HOWFEED.BIZ</title>
</svelte:head>

<div class="content">
    <a href="/cms">&lt; Back to Dashboard</a>
    <h1>HowFeed Publisher</h1>
    <form method="POST" action="/cms/article">
        <p>Article Title: <input type="text" name="title" bind:value={title} required placeholder="How to Assassinate the Governor of California"></p>
        <p>Article Author: <strong>{$session.user.realname}</strong></p>
        <p>Article Header Image URL: <input type="text" name="image" bind:value={image} required placeholder="http:// ..."></p>
    </form>
    <Editor bind:this={editor} {actions} />
    <button on:click={submit}>Submit</button>
</div>
