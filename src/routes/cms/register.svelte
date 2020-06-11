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
    <title>Register | HOWFEED.BIZ</title>
</svelte:head>

<div class="content">
    <h1>Register</h1>
    <form method="POST" action="/cms/register">
        <input required type="text" name="realname" placeholder="Real Name">
        <input required type="text" name="username" placeholder="Username">
        <input required type="password" name="password" placeholder="Password">
        <input required type="password" name="password_confirm" placeholder="Confirm Password">
        <button type="submit">Submit</button>
    </form>
</div>
