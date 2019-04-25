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


} from "@line/bot-sdk";
import request        = require('request');
import proxy          = require('express-http-proxy');
import bodyParser     = require('body-parser');

import { config, dataAll } from './util';
import { handleEvent } from './mapEvent';

// Create a new express application instance
const app: express.Application = express();


function onlyLocalSimple(req: express.Request, res: express.Response, next: express.NextFunction) {
  let remote_address = req.header('remote_addr') || req.connection.remoteAddress;
  console.log(remote_address);
  if (remote_address == '::1') next();
  else res.send('no');
}

app.get('/', function (req, res) {
  // console.log(req.connection.remoteAddress)
  let remote_address = req.header('remote_addr') || req.connection.remoteAddress;
  console.log(remote_address);
  // res.send('Hello World!');
  res.sendFile("./tes.html")
});

app.use('/webhook1',proxy("https://servombak.free.beeceptor.com"));

app.post('/webhook-mock', [bodyParser.json(), onlyLocalSimple], (req: express.Request, res: express.Response) => {
  console.log(req.hostname)
  // handle events separately
  // console.log(req);
  // console.log(req.body);
  // res.send(req.body);
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
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
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
  });
})

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});