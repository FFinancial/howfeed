<style>
    h1, figure, p {
        text-align: center;
        margin: 0 auto;
    }

    h1 {
        font-size: 2.8em;
        text-transform: uppercase;
        font-weight: 700;
        margin: 0 0 0.5em 0;
    }

    figure {
        margin: 0 0 1em 0;
    }

    img {
        width: 100%;
        max-width: 400px;
        margin: 0 0 1em 0;
    }

    p {
        margin: 1em auto;
    }

    @media (min-width: 480px) {
        h1 {
            font-size: 4em;
        }
    }

    div.background {
        background: url('/cityscape.jpg') no-repeat center;
        background-size: cover;
        position: fixed;
        height: 16rem;
        width: 100vw;
        z-index: 0;
        filter: blur(5px);
    }
    div.content {
        margin-top: 5rem;
        z-index: 1;
    }
</style>

<svelte:head>
    <title>HOWFEED.BIZ</title>
</svelte:head>

<div class="background"></div>
<div class="content">
    <h1 class="uppercase">Welcome</h1>
    <figure>
        <figcaption>Have fun with Sapper!</figcaption>
    </figure>
</div>
