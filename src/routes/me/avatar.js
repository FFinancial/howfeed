import crypto from 'crypto';
import fs from 'fs';
import User from '../../models/user.js';

export async function post(req, res, next)
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
	try {
		const { upload } = req.files;
		if (!upload) {
			res.writeHead(422, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				message: `You must supply a file.`
			}));
			return false;
		}
		if (!/^image\//.test(upload.mimetype)) {
			res.writeHead(422, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				message: `Invalid MIME type for the uploaded image.`
			}));
			return false;
		}
		if (upload.truncated) {
			res.writeHead(422, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				message: `Received truncated image file. Try again with a smaller file.`
			}));
			return false;
		}
		const ext = upload.name.match(/(\.[^.]+)$/)[0];
		const filename = crypto.randomBytes(20).toString('hex') + ext;
		const url = `/u/${filename}`;
		await upload.mv('./static' + url);
		const user = await User.findById(req.user._id);
		req.user.avatar = user.avatar = filename;
		await user.save();
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({ filename }));
	} catch (err) {
		res.writeHead(500, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `Failed to upload image: ${err}`
		}));
	}
}

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
