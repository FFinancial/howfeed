const articles = [
];

articles.forEach(article => {
    article.slug = article.title.toLowerCase().replace(/\W+/g, '-');
    article.html = article.html.replace(/^\t{3}/gm, '');
});

export default articles;
