import express from 'express';
import Article from '../models/article.js';

const app = express.Router();

app.get('/', async function (req, res) {
	let page = Number.isInteger(req.query.page) && req.query.page > 0 ? req.query.page : 1;
	let offset = (page - 1) * 4;
	let articles = await Article.find().sort('-created_at').limit(4).skip(offset);
	res.render('index', { articles, offset });
});

app.use(function (req, res) {
	// if you actually send HTTP 404, IE will render its own 404 page,
	// so don't do that.
	res.render('404');
});

export default app;
