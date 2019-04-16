"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express = require("express");
var bot_sdk_1 = require("@line/bot-sdk");
require('dotenv').config({ path: "../" });
// Create a new express application instance
var app = express();
var config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
app.get('/', function (req, res) {
    res.send('Hello World!');
    console.log('asdaffdffssdafsdafadffdsdafsdd');
});
// app.post('/webhook', (req, res) => {
//     res.json({'test': 'ssdafdas'})
// })
app.post('/webhook', bot_sdk_1.middleware(config), function (req, res) {
    var obj = req.body.events; // webhook event objects
    var dest = req.body.destination; // user ID of the bot (optional)
    console.log(obj, dest);
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
