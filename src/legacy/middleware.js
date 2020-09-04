/**
 * (default behavior) detect if user is on IE <= 10
 */
var isMSIE = function (req) {
	var ua = req.get('User-Agent');
	return ua && ua.indexOf('MSIE ') > 0;
};

/**
 * middleware that invokes one of two callbacks depending on if
 * the client is on a legacy browser
 */
export default (cb, determiner = isMSIE) => function (req, res, next) {
	if (determiner(req)) {
		cb(req, res, next);
	} else {
		next();
	}
};
