require('dotenv').config();
import nodemailer from 'nodemailer';

const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_SERVER, SMTP_PORT, SMTP_RECIPIENTS } = process.env;
const mailer = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: 587,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
    },
});

export async function post(req, res)
{
	let { name, title, message } = req.body;
	if (!message) {
		res.writeHead(422, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: 'No message supplied'
		}));
		return false;
	}
	name = name || 'Anonymous';
	title = title || 'Suggestion';
	try {
		await mailer.sendMail({
			from: `"HowFeed Suggestions" <${SMTP_USERNAME}>`,
			to: SMTP_RECIPIENTS,
			subject: title,
			text: `Suggested by ${name}:

			${message}`
		});
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: 'Your suggestion was delivered.'
		}));
	} catch (err) {
		res.writeHead(500, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: err.message
		}));
	}
}
