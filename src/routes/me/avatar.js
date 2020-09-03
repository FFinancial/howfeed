import fs from 'fs';
import User from '../../models/user.js';

export async function del(req, res)
{
	if (!req.user) {
		res.writeHead(401, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `You must be logged in to set an avatar.`
		}));
		return false;
	}
	const user = await User.findById(req.user._id);
	const filename = 'default.jpg';
	if (user.avatar !== filename) {
		fs.unlinkSync(`./static/u/${user.avatar}`);
	}
	req.user.avatar = user.avatar = filename;
	await user.save();
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	res.end(JSON.stringify({ filename }));
}
