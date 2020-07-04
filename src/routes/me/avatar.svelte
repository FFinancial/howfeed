<script context="module">
    export async function preload(page, session)
    {
        if (!session.user || !session.user.author) {
            return this.redirect(302, '/cms');
        }
    }
</script>

<svelte:head>
    <title>Change Avatar | HOWFEED.BIZ</title>
</svelte:head>

<script>
    import { goto, stores } from '@sapper/app';
    const { session } = stores();

    let uploadForm;

    async function upload()
    {
        let fd = new FormData(uploadForm);
        const res = await fetch(`/me/avatar`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: fd
        });
        const json = await res.json();
        if (res.status === 200) {
            $session.user.avatar = json.filename;
        } else {
            alert(`Error ${res.status}: ${json.message}`);
        }
    }

    async function del()
    {
        const res = await fetch(`/me/avatar`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });
        const json = await res.json();
        if (res.status === 200) {
            $session.user.avatar = json.filename;
        } else {
            alert(`Error ${res.status}: ${json.message}`);
        }
    }
</script>

<div class="content">
    <a href="/cms">&lt; Back to Dashboard</a>
    <h1>Change Avatar</h1>
    <p>
        <img class="avatar" alt={$session.user.realname} src={`/u/${$session.user.avatar || 'default.jpg'}`}>
        ← This is you, you ugly piece of shit. God, no wonder you're an incel.
    </p>
    <form bind:this={uploadForm} on:submit|preventDefault={upload}>
        <p>
            Change your photo so you at least have a chance:
            <input type="file" name="upload">
            <button type="submit">Upload</button>
        </p>
    </form>
    <p>Or better yet, erase your wretched face from this site entirely: <button on:click={del}>Reset Avatar</button></p>
</div>
