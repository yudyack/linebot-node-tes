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


import { config, dataAll } from './util';
import { handleEvent } from './mapEvent';

// Create a new express application instance
const app: express.Application = express();

console.log(dataAll);
console.log(config)
app.get('/', function (req, res) {
  res.send('Hello World!');
  console.log('darimana?', req);
});


app.post('/webhook', middleware(<MiddlewareConfig> config), (req, res) => {
  let events: Array<WebhookEvent> = req.body.events // webhook event objects
  console.log("request\n", req);
  let dest = req.body.destination // user ID of the bot (optional)

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