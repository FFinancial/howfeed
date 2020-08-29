<script context="module">
    export async function preload({ user }, page)
    {
        const res = await this.fetch(`/me`);
        user = await res.json();
    }
</script>

<script>
    import Footer from '../components/Footer.svelte';
    import Nav from '../components/Nav.svelte';
</script>

<style>
    div.main {
        max-width: 100%;
        box-sizing: border-box;
    }
</style>

<Nav />

<div class="main">
    <slot></slot>
    <Footer />
</div>
