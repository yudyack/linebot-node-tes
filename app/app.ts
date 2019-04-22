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
  } from "@line/bot-sdk";


import { loadData, loadEnv } from './util';

loadEnv();
const dataAll = loadData();
console.log(dataAll);

// Create a new express application instance
const app: express.Application = express();

const config = {
    channelAccessToken: <string> process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: <string> process.env.CHANNEL_SECRET
}


app.get('/', function (req, res) {
  res.send('Hello World!');
  console.log('asdaffdffssdafsdafadffdsdafsdd');
});

// app.post('/webhook', (req, res) => {
//     res.json({'test': 'ssdafdas'})
// })

interface LineSource {
  userId: String;
  groupId: String;
  'type': String;
}

interface LineMessage {
  'type': String;
  id: String;
  text: String;
}

interface LineEvents {
  'type': String;
  replyToken: String;
  source: LineSource;
  timestamp: String;
  message: LineMessage;
}

function handleEvents() {

}

app.post('/webhook', middleware(config), (req, res) => {

  
  let obj: Array<LineEvents> = req.body.events // webhook event objects
  let dest = req.body.destination // user ID of the bot (optional)
  console.log(dest);
  console.log(obj);
  let user_id = obj[0].source.userId;


})

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});