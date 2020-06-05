<script>
    import Nav from '../components/Nav.svelte';
</script>

<style>
    main {
        max-width: 100vw;
        box-sizing: border-box;
    }
    footer {
        box-sizing: border-box;
        text-align: center;
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #fff;
        box-shadow: 0 2px 5px #000;
        padding: 1rem;
        z-index: 1;
    }
</style>

<Nav />

<main>
    <slot></slot>
    <footer>
        Wholly funded and published by FemboyFinancial, Ltd.
        Copyright &copy; {new Date().getFullYear()} FemboyFinancial, Ltd. All rights reserved.
    </footer>
</main>
