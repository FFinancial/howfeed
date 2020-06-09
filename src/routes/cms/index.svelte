<script context="module">
    export async function preload(page, session)
    {
        if (!session.user) {
            return this.redirect(302, '/cms/login');
        }
        return { user: session.user };
    }
</script>

<div class="content">
    <h1>HowFeed Publisher</h1>
    <form method="POST" action="/cms/article">
        
        <textarea name="content"></textarea>
        <button type="submit">Submit</button>
    </form>
</div>
