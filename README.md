# HowFeed.biz

A satirical blog with its own lightweight CMS, which all runs on [Sapper](https://sapper.svelte.dev).

## Setup

Requires Node.js and SQLite

Set up `.env.example` as `.env`

```sh
sqlite3 storage/howfeed.db < storage/init.sql
npm i
npm run dev
```
