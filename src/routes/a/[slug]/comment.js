import Article from '../../../models/article.js';

export async function post(req, res) {
    const { slug } = req.params;
    const article = await Article.findOne({ slug }).populate({
        path: 'comments.author_user',
        select: 'realname'
    });

    if (article) {
        let { author, content } = req.body;
        author = author || 'Anonymous';
        if (!content) {
            res.writeHead(422, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                message: `You must supply a comment.`
            }));
            return;
        }
        if (author.length > 100) {
            res.writeHead(422, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                message: `Your username cannot be longer than 100 characters.`
            }));
            return;
        }
        if (content.length > 5000) {
            res.writeHead(422, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                message: `Shorten your god damn comment you pedant`
            }));
            return;
        }
        if (req.user) {
            article.comments.push({ author_user: req.user._id, content });
        } else {
            article.comments.push({ author, content });
        }
        article.save();
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(article.comments));
    } else {
        res.writeHead(404, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: `Not found`
        }));
    }
}
