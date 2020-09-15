<svelte:head>
    <title>Contact Us | HOWFEED.BIZ</title>
</svelte:head>

<script>
    let title = '', name = '', message = '';

    async function sendSuggestion()
    {
        try {
            const res = await fetch(`/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ title, name, message })
            });
            const json = await res.json();
            if (res.status === 200) {
                alert(json.message);
                title = name = message = '';
            } else {
                alert(`Error ${res.status}: ${json.message}`);
            }
        } catch (err) {
            console.error(err);
        }
    }
</script>

<style>
    div.people {
        display: flex;
        flex-wrap: wrap;
    }
    div.people > div {
        flex: 1 0 0;
        padding: 0.25rem 1rem;
    }
    iframe {
        max-width: 100%;
    }
    input[type=text], textarea {
        width: 350px;
    }
    textarea {
        height: 160px;
    }
    .center {
        text-align: center;
    }
</style>

<div class="content">
    <h1>Contact Us</h1>
	<!-- ad goes here -->
    <div class="people">
        <div>
            <h3>Myles C. Linden</h3>
            <p>Director of Financial Growth and Prosperity</p>
            <p>FemboyFinancial Holdings Co., Ltd. (USA LLC)</p>
            <address>
                1198 South 6th Street<br>
                Suite J<br>
                San Jose, CA 95112
            </address>
            <p><a href="tel:+19257658478">(925) 765-8478</a></p>
            <p><a href="mailto:mylesl@howfeed.biz">mylesl@howfeed.biz</a></p>
        </div>
        <div>
            <h3>Vincent M. Iannelli</h3>
            <p>Creative Operations Director</p>
            <p>FemboyFinancial Holdings Co., Ltd. (USA LLC)</p>
            <p><a href="tel:+19258134360">(925) 813-4360</a></p>
            <p><a href="mailto:vincentmiannelli@howfeed.biz">vincentmiannelli@howfeed.biz</a></p>
        </div>
        <div>
            <h3>James N. Shiffer</h3>
            <p>Webmaster</p>
            <p>FemboyFinancial Holdings Co., Ltd. (USA LLC)</p>
            <p><a href="mailto:webmaster@howfeed.biz">webmaster@howfeed.biz</a></p>
        </div>
    </div>
    <h1>Suggest Ideas to Us</h1>
    <p>Do you have a request for an article or an enhancement to the site? Send it directly to us here!</p>
    <form on:submit|preventDefault={sendSuggestion} action="/suggestions" method="POST">
        <p>Name: <input type="text" name="name" bind:value={name} placeholder="Anonymous"></p>
        <p>Title: <input type="text" name="title" bind:value={title}></p>
        <p><textarea name="message" bind:value={message}></textarea></p>
        <p><button type="submit">Send</button></p>
    </form>
	<!-- ad goes here -->
    <h1 class="center">Come Find Us!</h1>
    <div style="max-width:100%;margin:0 auto;width:700px;height:440px;">
        <iframe width="700" height="440" src="https://maps.google.com/maps?width=700&amp;height=440&amp;hl=en&amp;q=1198%20Sixth%20St%2C%20San%20Jose%2C%20CA+(Title)&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
    </div>
</div>
