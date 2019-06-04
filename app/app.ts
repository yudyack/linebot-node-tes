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

  MiddlewareConfig,
  ClientConfig,
  Config,
  TextMessage,


} from "@line/bot-sdk";
import request        = require('request');
import proxy          = require('express-http-proxy');
import bodyParser     = require('body-parser');
import path           = require('path');

import { config, dataAll, hostname, setHostname, loadEnv } from './utilConfig';
import { handle, chaining } from './mapEvent';
import { userInfo } from 'os';
import { closeDbClient } from './repository';
// Create a new express application instance
const app: express.Application = express();


let proxing: boolean = false;

let webhook : string = "/webhook";
let fakeWebhook: string = "/webhook1";
if (proxing) {
  let _t = webhook;
  webhook = fakeWebhook;
  fakeWebhook = _t;
}



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
  // console.log(req.hostname);
  // console.log(path.join(__dirname,'/public'));
  // res.send('Hello World!');
  res.sendFile(path.join(__dirname, "../public/tes.html"))
});

app.use(fakeWebhook,proxy("https://servombak.free.beeceptor.com"));

app.post('/webhook-mock', [bodyParser.json(), onlyLocalSimple], (req: express.Request, res: express.Response) => {
  console.log(req.hostname)
  console.log(req.body.events);
  // handle events separately
  let events = req.body.events;
  Promise.all(req.body.events.map(handle))
    .then((i) => {
      console.info("all handled");
    })
  res.status(200).end()
});

app.post(webhook, middleware(<MiddlewareConfig> config), (req, res) => {
  
  let events: Array<WebhookEvent> = req.body.events // webhook event objects
  console.log(events);
  let dest = req.body.destination // user ID of th,e bot (optional)
  let user_id = events[0].source.userId;
  if (req.body.destination) {
    console.log("Destination User ID: " + req.body.destination);
  }

  // handle events separately
  Promise.all(req.body.events.map(chaining()))
    .then((i) => {
      console.info("all handled");
    })
  res.status(200).end()
})
app.get(webhook, (req, res) => res.end(`I'm listening. Please access with POST.`));

app.use('/static', express.static(path.join(__dirname,'../static')));

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});

process.on("exit", exitHandler);
process.on('uncaughtException', exceptionHandler);
process.on('SIGINT', exceptionHandler);
process.on('SIGUSR1', exceptionHandler);
process.on('SIGUSR2', exceptionHandler);

function exitHandler(code: number) {
    console.log("adsf")
    closeDbClient();
}

function exceptionHandler() {
    // console.log("asdf")
    // closeDbClient();
    // exitHandler(0);
    process.exit();
}
