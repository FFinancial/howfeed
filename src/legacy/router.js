import express from 'express';
const app = express.Router();

app.get('*', function (req, res) {
	res.render('index');
});
	
export default app;
