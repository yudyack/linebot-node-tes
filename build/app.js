"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express = require("express");
var bot_sdk_1 = require("@line/bot-sdk");
var util_1 = require("./util");
var mapEvent_1 = require("./mapEvent");
// Create a new express application instance
var app = express();
console.log(util_1.dataAll);
console.log(util_1.config);
app.get('/', function (req, res) {
    res.send('Hello World!');
    console.log('asdaffdffssdafsdafadffdsdafsdd');
});
app.post('/webhook', bot_sdk_1.middleware(util_1.config), function (req, res) {
    var events = req.body.events; // webhook event objects
    var dest = req.body.destination; // user ID of the bot (optional)
    var user_id = events[0].source.userId;
    if (req.body.destination) {
        console.log("Destination User ID: " + req.body.destination);
    }
    // handle events separately
    Promise.all(req.body.events.map(mapEvent_1.handleEvent))
        .then(function () { return res.end(); })
        .catch(function (err) {
        console.error(err);
        res.status(500).end();
    });
});
app.listen(process.env.PORT, function () {
    console.log("Example app listening on port " + process.env.PORT + "!");
});
