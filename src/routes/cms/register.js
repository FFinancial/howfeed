import User from '../../models/user.js';

export async function post(req, res)
{
	if (req.user) {
		res.writeHead(401, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `You are already logged in`
		}));
		return false;
	}
	let { username, password, password_confirm, realname } = req.body;
	if (!username || !password || !password_confirm || !realname) {
		res.writeHead(422, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `You need to supply a username, real name, password, and password confirmation.`
		}));
		return false;
	}
	if (password.length < 8) {
		res.writeHead(422, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `The password must be at least 8 characters long.`
		}));
		return false;
	}
	if (password !== password_confirm) {
		res.writeHead(422, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `The password does not match the confirmation.`
		}));
		return false;
	}
	if (!/^[a-z0-9.]+$/i.test(username)) {
		res.writeHead(422, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `The username can only contain letters, numbers, and periods.`
		}));
		return false;
	}
	/*
	try {
		await registerRateLimiter.consume();
	} catch (err) {
		res.writeHead(429, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `Too Many Requests`
		}));
		return false;
	}
	*/
	try {
		const user = await User.findOne({ username: req.body.username });
		if (user) {
			res.writeHead(401, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				message: `This username is taken.`
			}));
			return false;
		}
		// password gets automatically hashed
		const newUser = await new User({ username, realname, password });
		await newUser.save();

		req.login(newUser, err => {
			if (err) throw err;
			return res.redirect('/cms');
		});
	} catch (err) {
		console.error(err);
		res.writeHead(500, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `Internal server error`
		}));
		return false;
	}
}
