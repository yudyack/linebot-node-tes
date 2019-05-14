"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var express = require("express");
var bot_sdk_1 = require("@line/bot-sdk");
var proxy = require("express-http-proxy");
var bodyParser = require("body-parser");
var path = require("path");
var util_1 = require("./util");
var mapEvent_1 = require("./mapEvent");
var user_1 = require("./user");
// Create a new express application instance
var app = express();
function onlyLocalSimple(req, res, next) {
    var remote_address = req.header('remote_addr') || req.connection.remoteAddress;
    console.log(remote_address);
    if (remote_address == '::1')
        next();
    else
        res.send('no');
}
app.use(function sethost(req, res, next) {
    util_1.setHostname(req.hostname);
    next();
});
app.post('/fixedPush', bodyParser.json(), function (req, res) {
    var msg = req.body.msg;
    var pass = req.body.pass;
    if (pass != "1123")
        res.status(403).send();
    // not yet refactorized
    var client = new bot_sdk_1.Client(util_1.config);
    var message = {
        type: 'text',
        text: msg
    };
    client.pushMessage("C1303fc45804b7df2f740ed5343900684", [message])
        .then(function () { return res.end(); })
        .catch(function (err) {
        console.error(err);
        res.status(500).end();
    });
});
app.get('/', function (req, res) {
    // console.log(req.connection.remoteAddress)
    var remote_address = req.header('remote_addr') || req.connection.remoteAddress;
    // console.log(req.hostname);
    // console.log(path.join(__dirname,'/public'));
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, "../public/tes.html"));
});
app.use('/webhook1', proxy("https://servombak.free.beeceptor.com"));
app.post('/webhook-mock', [bodyParser.json(), onlyLocalSimple], function (req, res) {
    user_1.plus(1);
    // let user = _users;
    // user += 1000;
    console.log("uesrs: " + user_1._users);
    console.log(req.hostname);
    // handle events separately
    var events = req.body.events;
    Promise.all(req.body.events.map(mapEvent_1.handle))
        .then(function (i) {
        console.info("all handled");
    });
    res.status(200).end();
});
app.post('/webhook', bot_sdk_1.middleware(util_1.config), function (req, res) {
    var events = req.body.events; // webhook event objects
    console.log(events);
    var dest = req.body.destination; // user ID of th,e bot (optional)
    var user_id = events[0].source.userId;
    if (req.body.destination) {
        console.log("Destination User ID: " + req.body.destination);
    }
    // handle events separately
    Promise.all(req.body.events.map(mapEvent_1.chaining()))
        .then(function (i) {
        console.info("all handled");
    });
    res.status(200).end();
});
app.use('/static', express.static(path.join(__dirname, '../static')));
app.listen(process.env.PORT, function () {
    console.log("Example app listening on port " + process.env.PORT + "!");
});
//# sourceMappingURL=app.js.map