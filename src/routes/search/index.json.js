import Article from '../../models/article.js';

export async function get(req, res)
{
    const { query } = req.query;
    if (!query) {
        res.writeHead(422, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: `No search query provided`
        }));
        return;
    }
    const results = await Article.fuzzySearch(query);
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(results));
}
