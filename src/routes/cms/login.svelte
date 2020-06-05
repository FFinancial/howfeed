<script>
    let username, password;
</script>

<style>
    input {
        display: block;
        padding: 1rem;
        font-size: 1.25rem;
        width: 70%;
        margin-bottom: 2rem;
    }
    button[type=submit] {
        font-size: 1.25rem;
        padding: 0.5rem;
    }
    div.content {
        max-width: 40rem;
    }
</style>

<svelte:head>
    <title>Login | HOWFEED.BIZ</title>
</svelte:head>

<div class="content">
    <h1>Login</h1>
    <form method="POST" action="/cms/login">
        <input required type="text" name="username" bind:value={username} placeholder="Username">
        <input required type="password" name="password" bind:value={password} placeholder="Password">
        <button type="submit">Submit</button>
    </form>
</div>
