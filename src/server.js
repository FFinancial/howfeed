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
import { RateLimiterMemory } from 'rate-limiter-flexible';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import crypto from 'crypto';
import Article from './models/article.js';
import Category from './models/category.js';
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

const loginAttemptRateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 3600,
    blockDuration: 60
});

const registerRateLimiter = new RateLimiterMemory({
    points: 1,
    duration: 60,
    blockDuration: 60
});

const rateLimiterMiddleware = rl => async function (req, res, next) {
    try {
        await rl.consume(req.ip);
        next();
    } catch (err) {
        res.writeHead(429, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: 'Too Many Requests'
        }));
    }
};

const isAuthor = function(req, res, next) {
    if (req.user) {
        if (req.user.author) {
            next();
        } else {
            res.writeHead(401, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                message: `You are not designated as an author.`
            }));
        }
    } else {
        res.writeHead(401, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            message: `You are not logged in`
        }));
    }
};


express()
    .use(helmet())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(fileUpload({
        limits: { fileSize: 16000000 }
    }))
    .use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            maxAge: 31536000
        },
        store: new FileStore({
            path: '.sessions'
        })
    }))
    .use(passport.initialize())
    .use(passport.session())

    .post('/cms/register',
        function(req, res, next) {
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
            let { username, password, password_confirm, realname } = req.body;
            if (!username || !password || !password_confirm || !realname) {
                res.writeHead(422, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: `You need to supply a username, real name, password, and password confirmation.`
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
            if (!/^[a-z0-9.]+$/i.test(username)) {
                res.writeHead(422, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: `The username can only contain letters, numbers, and periods.`
                }));
                return false;
            }
            try {
                await registerRateLimiter.consume();
            } catch (err) {
                res.writeHead(429, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: `Too Many Requests`
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
                const newUser = await new User({ username, realname, password });
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
        rateLimiterMiddleware(loginAttemptRateLimiter),
        passport.authenticate('local', { failWithError: true }),
        function(req, res, next) {
            // handle success
            return res.redirect('/cms');
        },
        function(err, req, res, next) {
            // handle error
            res.writeHead(err.status || 500, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                message: err.message
            }));
        }
    )

    .get('/cms/logout', (req, res, next) => {
        req.logout();
        req.session.destroy(function (err) {
            if (err) next(err);
            return res.redirect('/');
        });
    })

    .post('/cms/article',
        isAuthor,
        async function(req, res, next) {
            try {
                const { html, title, category } = req.body;
                const { image } = req.files;
                if (!title || !image || !html || !category) {
                    res.writeHead(422, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: `You must supply an article title, header image file, category, and content.`
                    }));
                    return false;
                }
                if (!/^image\//.test(image.mimetype)) {
                    res.writeHead(422, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: `Invalid MIME type for the header image file.`
                    }));
                    return false;
                }
                if (image.truncated) {
                    res.writeHead(422, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: `Received truncated image file. Try again with a smaller file.`
                    }));
                    return false;
                }
                const cat = await Category.findOne({ slug: category });
                if (!cat) {
                    res.writeHead(404, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: `That category does not exist.`
                    }));
                    return false;
                }
                const ext = image.name.match(/(\.[^.]+)$/)[0];
                const filename = crypto.randomBytes(20).toString('hex') + ext;
                await image.mv('./static/a/' + filename);
                const article = await new Article({ html, title, image: filename, category: cat, author: req.user._id });
                await article.save();
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    slug: article.slug
                }));
            } catch (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: `Failed to add article: ${err}`
                }));
            }
        }
    )

    .post('/cms/upload',
        isAuthor,
        async function(req, res, next) {
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
                const url = `/a/${filename}`;
                await upload.mv('./static' + url);
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ url }));
            } catch (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: `Failed to upload image: ${err}`
                }));
            }
        }
    )

    .post('/cms/category',
        isAuthor,
        async function(req, res, next) {
            try {
                const { name } = req.body;
                if (!name) {
                    res.writeHead(422, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                        message: `You must supply a category name.`
                    }));
                    return;
                }
                const cat = await new Category({ name });
                await cat.save();
                const categories = await Category.find();
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(categories));
            } catch (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    message: `Failed to add category: ${err}`
                }));
            }
        }
    )

    .get('/me', function(req, res, next) {
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
    })

    .use(compression({ threshold: 0 }))
    .use(sirv('./static', { dev }))
    .use(sapper.middleware({
        session: req => ({
            user: req.session.passport ? req.session.passport.user : null
        })
    }))

    .listen(PORT, err => {
        if (err) console.log('error', err);
        console.log(`Express server listening on port ${PORT}`);
    });
