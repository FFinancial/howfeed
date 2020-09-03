export function get(req, res, next)
{
	if (req.user) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify(req.user));
	} else {
		res.writeHead(401, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `You are not logged in`
		}));
	}
}
