import Article from '../../models/article.js';

export async function get(req, res, next) {
    // the `slug` parameter is available because
    // this file is called [slug].json.js
    const { slug } = req.params;
    const article = await Article.findOne({ slug }).populate({
        path: 'author',
        select: 'realname'
    }).populate({
        path: 'category'
    }).populate({
        path: 'comments.author_user',
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
    if (!req.user) {
        res.writeHead(401, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: `You are not logged in`
        }));
        return;
    }
    if (!req.user.author) {
        res.writeHead(401, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: `You are not designated as an author.`
        }));
        return;
    }

    const { slug } = req.params;
    const article = await Article.findOneAndDelete({ slug });

    if (article) {
        const articles = await Article.find()
                                    .sort({ created_at: 'desc' })
                                    .populate({ path: 'category' })
                                    .populate({ path: 'author', select: 'realname' });
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ category: 'all', articles }));
    } else {
        res.writeHead(404, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: `Not found`
        }));
    }
}
