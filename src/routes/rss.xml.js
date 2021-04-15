import RSS from 'rss';
import Article from '../models/article.js';

export async function get(req, res)
{
	let year = new Date().getFullYear();
	let feed = new RSS({
		title: 'HowFeed.biz Articles',
		feed_url: 'http://howfeed.biz/rss.xml',
		site_url: 'http://howfeed.biz/',
		image_url: 'http://howfeed.biz/logo.png',
		language: 'en',
		webMaster: 'webmaster@howfeed.biz',
		copyright: `${year} FemboyFinancial Holdings Co., Ltd. (USA LLC)`
	});
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

	res.writeHead(200, {
		'Content-Type': 'application/rss+xml'
	});
	res.end(feed.xml());
}
