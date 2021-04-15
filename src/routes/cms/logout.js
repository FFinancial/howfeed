export async function get(req, res)
{
	req.logout();
	req.session.destroy(function (err) {
		if (err) next(err);
		return res.redirect('/');
	});
}
