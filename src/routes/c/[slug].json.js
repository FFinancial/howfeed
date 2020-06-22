import Article from '../../models/article.js';
import Category from '../../models/category.js';

export async function get(req, res)
{
    let { slug } = req.params;
    let articles;
    if (slug === 'all') {
        articles = await Article.find().sort({ created_at: 'desc' });
    } else {
        let cat = await Category.findOne({ slug });
        if (!cat) {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                message: `That category does not exist.`
            }));
            return;
        } else {
            articles = await Article.find({ category: cat.id }).sort({ created_at: 'desc' });
        }
    }
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(articles));
}
