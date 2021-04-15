import Memo from '../../models/memo.js';

export async function get(req, res, next)
{
	if (req.query.token === process.env.API_TOKEN) {
		try {
			const memos = await Memo.find();
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify(memos));
		} catch (err) {
			res.writeHead(500, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				Error: 'Failed to retrieve memos from database!'
			}));
		}
	} else {
		next();
	}
}

export async function post(req, res, next)
{
	if (req.body.token === process.env.API_TOKEN) {
		const msg = req.body.message;
		if (!msg) {
			res.writeHead(400, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				Error: 'You must provide a memo message'
			}));
		}
		try {
			const memo = await new Memo({
				message: msg,
				author: req.user && req.user._id
			});
			await memo.save();
			const memos = await Memo.find();
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify(memos));
		} catch (err) {
			res.writeHead(500, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				Error: 'Failed to store memo in database!'
			}));
		}
	} else {
		next();
	}
}

export async function del(req, res, next)
{
	if (req.body.token === process.env.API_TOKEN) {
		const { id } = req.params;
		const memo = await Memo.findOneAndDelete(id);

		if (memo) {
			const memos = await Memo.find();
				res.writeHead(200, {
					'Content-Type': 'application/json'
				});
				res.end(JSON.stringify(memos));
		} else {
			res.writeHead(404, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				message: `Not found`
			}));
		}
	} else {
		next();
	}
}
