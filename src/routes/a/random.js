import Article from '../../models/article.js';

export async function get(req, res, next)
{
	var articleCount = await Article.countDocuments();
	var random = Math.floor(Math.random() * articleCount);
	var randomArticle = await Article.findOne().skip(random).select('slug');
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	res.end(JSON.stringify(randomArticle));
}
