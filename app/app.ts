// lib/app.ts
import express = require('express');
import {
  // main APIs
  Client,
  middleware,

  // exceptions
  JSONParseError,
  SignatureValidationFailed,

  // types
  TemplateMessage,
  WebhookEvent,

  // webhook event objects
  MessageEvent,
  EventSource,
  VideoEventMessage,

  // message event objects
  Message,
  TemplateContent,
  EventBase,
  ReplyableEvent,
  TextEventMessage,
  ImageEventMessage,
  AudioEventMessage,
  LocationEventMessage,
  StickerEventMessage,
  MiddlewareConfig,
  ClientConfig,
  Config,
  TextMessage,


} from "@line/bot-sdk";
import request        = require('request');
import proxy          = require('express-http-proxy');
import bodyParser     = require('body-parser');
import path           = require('path');

import { config, dataAll, hostname, setHostname } from './util';
import { handleEvent, handle } from './mapEvent';

// Create a new express application instance
const app: express.Application = express();


function onlyLocalSimple(req: express.Request, res: express.Response, next: express.NextFunction) {
  let remote_address = req.header('remote_addr') || req.connection.remoteAddress;
  console.log(remote_address);
  if (remote_address == '::1') next();
  else res.send('no');
}

app.use(function sethost(req, res, next) {
  setHostname(req.hostname);
  next();
})

app.post('/fixedPush',bodyParser.json(), (req, res) => {
  let msg = req.body.msg;
  let pass = req.body.pass;

  if (pass != "1123")
    res.status(403).send();
  
  // not yet refactorized
  let client = new Client(<ClientConfig> config);
  let message: TextMessage = { 
    type: 'text',
    text: msg
  }
  client.pushMessage("C1303fc45804b7df2f740ed5343900684", [message])
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
  })
  
})

app.get('/', function (req, res) {
  // console.log(req.connection.remoteAddress)
  let remote_address = req.header('remote_addr') || req.connection.remoteAddress;
  console.log(req.hostname);
  console.log(path.join(__dirname,'/public'));
  // res.send('Hello World!');
  res.sendFile(path.join(__dirname, "../public/tes.html"))
});

app.use('/webhook1',proxy("https://servombak.free.beeceptor.com"));

app.post('/webhook-mock', [bodyParser.json(), onlyLocalSimple], (req: express.Request, res: express.Response) => {
  console.log(req.hostname)
  // handle events separately
  // console.log(req);
  // console.log(req.body);
  // res.send(req.body);
  Promise.all(req.body.events.map(handle))
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
  });
});

app.post('/webhook', middleware(<MiddlewareConfig> config), (req, res) => {
  
  let events: Array<WebhookEvent> = req.body.events // webhook event objects
  console.log(events);

  let dest = req.body.destination // user ID of th,e bot (optional)

  let user_id = events[0].source.userId;

  if (req.body.destination) {
    console.log("Destination User ID: " + req.body.destination);
  }

  // handle events separately
  Promise.all(req.body.events.map(handle))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
  });
})

app.use('/static', express.static(path.join(__dirname,'../static')));

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});