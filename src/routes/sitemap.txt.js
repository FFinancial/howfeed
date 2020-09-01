import Article from '../models/article.js';
import Category from '../models/category.js';

/**
 * generates a simple .txt sitemap with all articles and categories.
 */
export async function get(req, res)
{
    // include static, publicly visible pages here
    let routes = [
        'https://howfeed.biz/',
        'https://howfeed.biz/contact',
        'https://howfeed.biz/search',
    ];

    const articles = await Article.find();
    const categories = await Category.find();
    for (let article of articles) {
        routes.push(`https://howfeed.biz/a/${article.slug}`);
    }
    for (let category of categories) {
        routes.push(`https://howfeed.biz/c/${category.slug}`);
    }

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end(routes.join('\n'));
}
