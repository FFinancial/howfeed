<script context="module">
    export async function preload(page, session)
    {
        if (!session.user || !session.user.author) {
            return this.redirect(302, '/cms');
        }
        const res = await this.fetch('/c.json');
        const categories = await res.json();
        const origRes = page.query.edit && await this.fetch(`/a/${page.query.edit}.json?no_view=1`)
        const editArticle = origRes && await origRes.json();
        return { user: session.user, categories, editArticle };
    }
</script>

<script>
    import { stores, goto } from '@sapper/app';
    import { onMount } from 'svelte';
    import Editor from 'cl-editor/src/Editor.svelte';

    const { session } = stores();

    let editor, form, uploadForm;
    let loading = false, loadingAttach = false;
    let title = '', category = '', description = '';
    export let editArticle = undefined;
    export let categories;

    let actions = [
        {
            name: 'save',
            icon: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAAs0lEQVRIie2WPQ6DMAxGXzJwqIrerN3pORi7cqWwtjegQymyUlMZCIlU8UleIvt7cv4BKuAG9MCQIJ7ABfBEapTkU5xkVC087mMTk4ICskqrkWOdhGntpwJ9OvNuxtgtAMU1mt81F+iRC/S9BfdScVBtrHciAM6/Epds59UqPnW7KMUdp0nee0O8RtbzY9Xk/X9rdIAOUBlQn4ETPNCKAevzYJF8Mlp4f4ca9G/X1gijd/UCDStihJWAousAAAAASUVORK5CYII=" height="16">',
            title: 'Save',
            result: function save() {
                window.localStorage['title'] = title;
                window.localStorage['category'] = category;
                window.localStorage['description'] = description;
                window.localStorage['html'] = editor.getHtml(true);
                alert('Successfully saved draft to browser local storage');
            }
        },
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
        },
    ];

    onMount(function load() {
        title = editArticle ? editArticle.title : (window.localStorage['title'] || '');
        description = editArticle ? editArticle.description : (window.localStorage['description'] || '');
        category = editArticle ? editArticle.category.slug : (window.localStorage['category'] || '');
        editor.setHtml(editArticle ? editArticle.html : (window.localStorage['html'] || ''), false);
    });

    async function submit()
    {
        let html = editor.getHtml(true);
        let fd = new FormData(form);
        fd.append('html', html);
        loading = true;
        try {
            const res = await fetch(editArticle ? `/cms/article/${editArticle.slug}` : `/cms/article`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: fd
            });
            const json = await res.json();
            if (res.status === 200) {
                goto(`/a/${json.slug}`);
            } else {
                alert(`Error ${res.status}: ${json.message}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function addCategory()
    {
        let name = prompt('Enter a category name');
        if (name !== null) {
            const res = await fetch('/cms/category', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });
            const json = await res.json();
            if (res.status === 200) {
                categories = json;
                category = categories.filter(c => c.name === name)[0].slug;
            } else {
                alert(`Error ${res.status}: ${json.message}`);
            }
        }
    }

    async function upload()
    {
        let fd = new FormData(uploadForm);
        loadingAttach = true;
        try {
            const res = await fetch(`/cms/upload`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: fd
            });
            const json = await res.json();
            if (res.status === 200) {
                const ans = prompt('(Optional) Enter the width/height to resize this image to (e.g. "350x150" for exact dimensions, "350x" for just width, "x150" for just height)');
                if (ans) {
                    const dim = ans.split('x');
                    let validWidth = Number.isInteger(+dim[0]);
                    let validHeight = Number.isInteger(+dim[1]);
                    if (validWidth && validHeight) {
                        editor.setHtml(editor.getHtml(true) + `<img src="${json.url}" width="${dim[0]}" height="${dim[1]}">`, false);
                    } else if (validWidth) {
                        editor.setHtml(editor.getHtml(true) + `<img src="${json.url}" width="${dim[0]}">`, false);
                    } else if (validHeight) {
                        editor.setHtml(editor.getHtml(true) + `<img src="${json.url}" height="${dim[1]}">`, false);
                    } else {
                        editor.setHtml(editor.getHtml(true) + `<img src="${json.url}">`, false);
                    }
                } else {
                    editor.setHtml(editor.getHtml(true) + `<img src="${json.url}">`, false);
                }
            } else {
                alert(`Error ${res.status}: ${json.message}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            loadingAttach = false;
        }
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
    {#if editArticle}
        <h3>Editing "{editArticle.title}"</h3>
    {/if}
    <form enctype="multipart/form-data" method="POST" action="/cms/article" bind:this={form}>
        <p>Article Title: <input type="text" name="title" bind:value={title} required placeholder="How to Assassinate the Governor of California"></p>
        <p>Article Description (optional): <input type="text" name="description" bind:value={description} placeholder="Sick of big government? Here's a helpful guide on how to stick it to the man!"></p>
        <p>Article Author: <strong>{$session.user.realname}</strong></p>
        <p>Article Category:
        {#if categories.length}
            <select name="category" bind:value={category}>
            {#each categories as { name, slug }}
                <option value={slug}>{name}</option>
            {/each}
            </select>
        {/if}
        <button on:click|preventDefault={addCategory}>+</button></p>
        <p>Article Header Image:
            <input type="file" name="image" accept="image/*" required={!editArticle}>
            {#if editArticle}
                (leave empty if you don't want to replace it)
            {/if}
        </p>
    </form>
    <Editor bind:this={editor} {actions} />
    <form enctype="multipart/form-data" action="/cms/upload" method="POST" bind:this={uploadForm}>
        <p>Add Image to Article:
            <input type="file" name="upload" accept="image/*"> <button on:click|preventDefault={upload}>Upload</button>
            {#if loadingAttach}
                <progress>Uploading...</progress>
            {/if}
        </p>
    </form>
    <button on:click={submit}>Submit</button>
    {#if loading}
        <progress>Uploading...</progress>
    {/if}
</div>
