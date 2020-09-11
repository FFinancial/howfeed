import RSS from 'rss';
import Article from '../models/article.js';

export async function get(req, res)
{
    let feed = new RSS();
    let articles = await Article.find().populate({
        path: 'author',
        select: 'realname avatar'
    }).populate({
        path: 'category'
    });

    for (let article of articles) {
        feed.item({
            title: article.title,
            description: article.html,
            url: `http://howfeed.biz/a/${article.slug}`,
            categories: [ article.category.name ],
            author: article.author.realname,
            date: article.created_at,
            enclosure: {
                url: `http://howfeed.biz/a/${article.image}`
            }
        });
    }

    res.writeHead(200);
    res.end(feed.xml());
}
