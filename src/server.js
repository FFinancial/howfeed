import sirv from 'sirv';
import express from 'express';
import session from 'express-session';
import compression from 'compression';
import bodyParser from 'body-parser';
import * as sapper from '@sapper/server';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy } from 'passport-local';
import sessionFileStore from 'session-file-store';
import User from './models/user.js';

require('dotenv').config();
const FileStore = sessionFileStore(session);

const { PORT, NODE_ENV, SESSION_SECRET, MONGODB_CONN } = process.env;
const dev = NODE_ENV === 'development';

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(MONGODB_CONN, function (err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

passport.use(new Strategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) done(err);

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        user.comparePassword(password, (err, match) => {
            if (err) done(err);
            if (!match) {
                return done(null, false, { message: 'Incorrect password.' });
            } else {
                return done(null, user);
            }
        });
    });
}));

express()
    .use(passport.initialize())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
        store: new FileStore({
            path: '.sessions'
        })
    }))

    .post('/cms/register',
        (req, res, next) => {
            if (!req.user) {
                next();
            } else {
                res.writeHead(401, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: `You are already logged in`
                }));
            }
        }, async (req, res) => {
            let { username, password, password_confirm } = req.body;
            if (!username || !password || !password_confirm) {
                res.writeHead(422, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: `You need to supply a username, password, and password_confirm.`
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
                const newUser = await new User({ username, password });
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
    )

    .post('/cms/login',
        passport.authenticate('local', {
            successRedirect: '/cms',
            failureRedirect: '/cms/login',
        }),
        (req, res) => {
            res.redirect('/');
            //console.log(req.user.username);
        }
    )

    .use(compression({ threshold: 0 }))
    .use(sirv('static', { dev }))
    .use(sapper.middleware({
        session: req => ({
            user: req.session.passport ? req.session.passport.user.username : null
        })
    }))

    .listen(PORT, err => {
        if (err) console.log('error', err);
        console.log(`Express server listening on port ${PORT}`);
    });
