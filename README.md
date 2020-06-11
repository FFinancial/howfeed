![HowFeed.biz](./static/logo.png)

A satirical blog with its own lightweight CMS, which all runs on [Sapper](https://sapper.svelte.dev).

## Setup

Requires Node.js and MongoDB

Create a MongoDB database for howfeed:

```sh
$ mongo
> use howfeed;
```

Set up `.env.example` as `.env`

Then install dependencies and start a local server:

```sh
$ npm i
$ npm run dev
```

## Usage

Anyone can sign up for an account, but to designate a certain account as an author so they can publish articles, you will need to set the `author` field to `true` in Mongo:

```sh
$ mongo
> use howfeed;
> db.users.updateOne({username: 'myuser1'}, {$set:{author: true}})
```

Then the user should logout and log back in.
