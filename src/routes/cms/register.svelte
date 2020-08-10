<script>
    let showPasswdTooltip = false;
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
    .form-row {
        position: relative;
    }
    .tooltip {
        position: absolute;
        left: calc(70% + 50px);
        background: white;
        border: solid black 1px;
        top: 50%;
        transform: translateY(-50%);
        padding: 4px;
    }
    .tooltip::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 100%;
        margin-top: -8px;
        border-width: 8px;
        border-style: solid;
        border-color: transparent black transparent transparent;
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
        <div class="form-row">
            <input required type="password" name="password" placeholder="Password"
                   on:focus={() => { showPasswdTooltip = true }}
                   on:blur={() => { showPasswdTooltip = false }}>
            {#if showPasswdTooltip}
                <div class="tooltip" class:visible={showPasswdTooltip}>
                    We recommend using a strong password, like <code>cat123cat</code>
                </div>
            {/if}
        </div>
        <input required type="password" name="password_confirm" placeholder="Confirm Password">
        <button type="submit">Submit</button>
    </form>
</div>
