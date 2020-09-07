import express from 'express';
import Article from '../models/article.js';

const app = express.Router();

app.get('/', async function (req, res) {
	let intPage = +req.query.page;
	let page = Number.isInteger(intPage) && intPage > 0 ? intPage : 1;
	let offset = (page - 1) * 4;
	let articles = await Article.find().sort('-created_at').limit(4).skip(offset);
	let hasNextPage = (await Article.countDocuments()) > offset + 4;
	res.render('index', { articles, offset, hasNextPage, page });
});

app.use(function (req, res) {
	// if you actually send HTTP 404, IE will render its own 404 page,
	// so don't do that.
	res.render('404');
});

export default app;
