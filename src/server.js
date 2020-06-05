import sirv from 'sirv';
import express from 'express';
import session from 'express-session';
import compression from 'compression';
import * as sapper from '@sapper/server';
import sqlite3 from 'sqlite3';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

require('dotenv').config();

const { PORT, NODE_ENV, SESSION_SECRET } = process.env;
const dev = NODE_ENV === 'development';

const db = new sqlite3.Database('./storage/howfeed.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

passport.use(new Strategy((username, password, done) => {
    const sql = `SELECT password FROM users WHERE username  = ?`;
    db.get(sql, [username], async (err, row) => {
        if (err) {
            return done(err);
        }
        if (!row) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const validPass = await bcrypt.compare(password, row.password);
        if (!validPass) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, row);
    });
}));

express()
	.use(
        session({
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
        }),
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
    )
    .post('/cms/login', passport.authenticate('local', {
        successRedirect: '/cms',
        failureRedirect: '/cms/login',
        failureFlash: true,
    }))
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
