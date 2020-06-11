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
        <input required type="text" name="username" placeholder="Username">
        <input required type="password" name="password" placeholder="Password">
        <button type="submit">Submit</button>
    </form>
    <p>Need an account first? <a href="/cms/register">Register</a></p>
</div>
