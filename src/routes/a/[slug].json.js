import Article from '../../models/article.js';

export async function get(req, res, next) {
    // the `slug` parameter is available because
    // this file is called [slug].json.js
    const { slug } = req.params;
    const article = await Article.findOne({ slug }).populate({
        path: 'author',
        select: 'realname'
    });

    if (article) {
        article.set({ views: article.views + 1 });
        article.save();
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(article));
    } else {
        res.writeHead(404, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: `Not found`
        }));
    }
}

export async function del(req, res, next) {
    const { slug } = req.params;
    const article = await Article.findOneAndDelete({ slug });

    if (article) {
        res.writeHead(204);
        res.end();
    } else {
        res.writeHead(404, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: `Not found`
        }));
    }
}
