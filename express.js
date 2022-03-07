// Continuation of the main server page
// This is one whole part of the main page, dynamicall allows for more expansion in the future using routes

const express = require('express');
const app = express();

const tweetRoutes = require('./api/routes/tweets'); // Designating the main route

app.use('/tweets', tweetRoutes); // Determining that any '/' request in "tweets.js" will automatically reference "/tweets"

module.exports = app;