<script>
    export let message;
    export let author;
    export let handle;
    export let avatar;
    export let media;
    export let likes = 100;
    export let replies = 100;
    export let verified;
    export let date = new Date();
    export let link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const fmtDateTime = d => `${d.toLocaleTimeString().replace(/:\d+ /g, ' ')} - ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    const fmtCount = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const fmtMessage = msg => msg
        .replace(/#(\w+)/g, `<a href=${link} class="PrettyLink hashtag customisable" dir="ltr" rel="tag"><span class="PrettyLink-prefix">#</span><span class="PrettyLink-value">$1</span></a>`)
        .replace(/@([a-zA-Z0-9_]{1,15})/g, `<a href=${link} class="PrettyLink profile customisable h-card" dir="ltr"><span class="PrettyLink-prefix">@</span><span class="PrettyLink-value">$1</span></a>`);
</script>

<div class="SandboxRoot env-bp-350">
    <div class="EmbeddedTweet EmbeddedTweet--cta js-clickToOpenTarget" id="twitter-widget-0" lang="en">

    <div class="EmbeddedTweet-tweetContainer">
  <div class="EmbeddedTweet-tweet">
<blockquote class="Tweet h-entry js-tweetIdInfo subject expanded" cite={link}>
    <div class="Tweet-header">
      <a class="TweetAuthor-avatar  Identity-avatar u-linkBlend" href={link}><img class="Avatar" data-src-2x={avatar} alt="" data-src-1x={avatar} src={avatar}></a>
<div class="TweetAuthor js-inViewportScribingTarget">
  <a class="TweetAuthor-link Identity u-linkBlend" href={link}>
    <div class="TweetAuthor-nameScreenNameContainer">
      <span class="TweetAuthor-decoratedName">
        <span class="TweetAuthor-name Identity-name customisable-highlight" title={author}>{author}</span>
{#if verified}
        <span class="TweetAuthor-verifiedBadge"><div class="Icon Icon--verified" title="Verified Account" role="img"></div>
<b class="u-hiddenVisually">✔</b></span>
{/if}
      </span>
      <span class="TweetAuthor-screenName Identity-screenName" title={`@${handle}`} dir="ltr">@{handle}</span>
    </div>
  </a>
</div>
        <div class="Tweet-brand">
          <a href={link}><span class="FollowButton-bird"><div class="Icon Icon--twitter" title="View on Twitter" role="presentation"></div>
</span></a>
        </div>
    </div>
    <div class="Tweet-body e-entry-content">

      <div class="Tweet-target js-inViewportScribingTarget"></div>
      <p class="Tweet-text e-entry-title" dir="ltr" lang="en">{@html fmtMessage(message)}</p>

          <div class="Tweet-card">
{#if media}
<article class="MediaCard customisable-border" dir="ltr">
  <div class="MediaCard-media">
    <div class="MediaCard-widthConstraint js-cspForcedStyle" style="max-width: 960px">
      <div class="MediaCard-mediaContainer js-cspForcedStyle MediaCard--roundedTop MediaCard--roundedBottom" style="padding-bottom: 56.3542%">
        <a href={link} class="MediaCard-mediaAsset NaturalImage">
          <img class="NaturalImage-image" title="View image on Twitter" alt="View image on Twitter" src={media} width="960" height="541">
        </a>
      </div>
    </div>
  </div>
</article>
{/if}
</div>
      <div class="TweetInfo">
        <div class="TweetInfo-like">
<a class="TweetInfo-heart" title="Like" href={link}>
  <div><div class="Icon Icon--heart" title="Like" role="img"></div>
</div>
  <span class="TweetInfo-heartStat">{fmtCount(likes)}</span>
</a>
</div>
        <div class="TweetInfo-timeGeo">
<a class="u-linkBlend u-url customisable-highlight long-permalink" href={link}>
<time class="dt-updated" datetime={date.toJSON()} pubdate="" title={`Time posted: ${date.toUTCString()}`}>{fmtDateTime(date)}</time></a></div>
        <div class="tweet-InformationCircle"><a href={link} class="Icon Icon--informationCircleWhite js-inViewportScribingTarget" title="Twitter Ads info and privacy"><span class="u-hiddenVisually">Twitter Ads info and privacy</span></a>
</div>
      </div>
    </div>
  </blockquote>
</div>
  <a class="CallToAction" title="View the conversation on Twitter" href={link}>
    <div class="CallToAction-icon"><div class="Icon Icon--replyCTA" title="View conversation on Twitter" role="img"></div>
</div>
    <div class="CallToAction-text">{fmtCount(replies)} people are talking about this</div>
    <div class="CallToAction-chevron"><div class="Icon Icon--chevronRightCTA" title="View on Twitter" role="img"></div>
</div>
  </a>
</div>
  </div>
</div>
