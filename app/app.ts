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

require('dotenv').config({path:"../"});

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

app.post('/webhook', middleware(config), (req, res) => {
    let obj = req.body.events // webhook event objects
    let dest = req.body.destination // user ID of the bot (optional)
    console.log(obj, dest);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});