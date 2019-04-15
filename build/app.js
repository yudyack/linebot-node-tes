"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express = require("express");
var bot_sdk_1 = require("@line/bot-sdk");
// Create a new express application instance
var app = express();
var config = {
    channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
    channelSecret: 'YOUR_CHANNEL_SECRET'
};
app.get('/', function (req, res) {
    res.send('Hello World!');
    console.log('dssdafadffdsdd');
});
app.post('/webhook', function (req, res) {
    res.json({});
});
app.post('/webhook', bot_sdk_1.middleware(config), function (req, res) {
    req.body.events; // webhook event objects
    req.body.destination; // user ID of the bot (optional)
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
