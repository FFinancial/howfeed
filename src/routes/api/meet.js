import NodeCache from 'node-cache';
const cache = new NodeCache();

export async function get(req, res, next)
{
	if (req.query.token === process.env.API_TOKEN) {
		const time = cache.get('lastMeetingTime');
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			LastMeetingTime: time ? time.toJSON() : undefined
		}));
	} else {
		next();
	}
}

export async function post(req, res, next)
{
	if (req.body.token === process.env.API_TOKEN) {
		const time = new Date();
		const success = cache.set('lastMeetingTime', time, 3600);
		if (success) {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				LastMeetingTime: time.toJSON()
			}));
		} else {
			res.writeHead(500, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				Error: 'Failed to store meeting time in cache!'
			}));
		}
	} else {
		next();
	}
}
