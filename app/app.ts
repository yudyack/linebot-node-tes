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

// Create a new express application instance
const app: express.Application = express();

const config = {
    channelAccessToken: 'bEImkADlymSLkToM46kzAuMWy+51h3PpV0OdOiNZBOme3FVGo92p5Iwcg2lROLBGcofN+07dX28Ot4i3Urzj27JQ+qk7WVhc6y9eLnMX1BkVXvhElz0oTRz5SdkxCqqGEXQjCcUJOA/0/YXVHeNLKQdB04t89/1O/w1cDnyilFU=',
    channelSecret: '673d42703b9fd20209e1913b12dae6f6'
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