import path = require('path');
import fs = require('fs');
import { Config } from '@line/bot-sdk';
import { MongoCallback, MongoClient } from 'mongodb';
import * as mongo from 'mongodb';
import textToSpeech = require('@google-cloud/text-to-speech');
// const { formatToTimeZone } = require('date-fns-timezone')

loadEnv();
export function loadEnv(): void {
  process.env.HOME_DIR = path.resolve(__dirname, '../') + "/";
  require('dotenv').config({path:process.env.HOME_DIR+".env"});
}

export const config: Config = {
  channelAccessToken: <string> process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: <string> process.env.CHANNEL_SECRET
}

export const client = () : Promise<MongoClient> => {
  console.log(process.env.CONNECTIONDB)
  return mongo.connect(process.env.CONNECTIONDB?
    process.env.CONNECTIONDB : "", { useNewUrlParser: true })
  .catch((err)=>{
    console.log('error database connection');
    throw err;
  })
}

import { closeDbClient } from './repository';



// export const overrideLog = _overrideLog();
console.log("util terpanggil");

export function loadData(): object {
  const raw = fs.readFileSync(process.env.HOME_DIR+'data.json');
  const dataAll = JSON.parse(raw.toString());

  return dataAll;
}


export const dataAll = loadData();

export var hostname: String = '';
export let fullHostname: String;

export function setHostname(host:String) {
  hostname = host;
  fullHostname = `https://${hostname}`;
}

export function * range ( start: number, end: number, step = 1 ) {
  let state = start;
  while ( state < end ) {
    yield state;
    state += step;
  }
  return;
}

export const textToSpeechClient = new textToSpeech.default.TextToSpeechClient();
let idVoices: voiceResponse[] = [];
export const getIndVoices : Promise<voiceResponse[]> = new Promise((resolve, reject) => {
  if (idVoices.length > 0) {
    resolve(idVoices);
  } else {
    textToSpeechClient.listVoices({
      languageCode: "id-ID"
    })
    .then((data: any) => {
      idVoices = data[0]["voices"];
      resolve(idVoices);
    })
    .catch((err)=> {
      throw err
      // reject(err);
    })
  }
})


export interface voiceResponse {
  languageCodes:          string[];
  name:                   string;
  ssmlGender:             string;
  naturalSampleRateHertz: number;
}

// export function db(callback: MongoCallback<MongoClient>){
//     const url = process.env.CONNECTDB;
//     if (typeof url === 'string') {
//         return mongo.connect(url, callback)
//     } else {
//         throw "error in loading env connect db in util.ts";
//     }
// }



// function _overrideLog() {
    // ["log", "warn", "error"].forEach(function(method) {
    //     var oldMethod: any = (<any>console)[method].bind(console);
    //     (<any>console)[method] = function() {
    //         oldMethod.apply(
    //             console,
    //             [formatToTimeZone(new Date, "D.M.YYYY HH:mm:ss.SSS", {timeZone: 'Asia/Jakarta'}) + " : " + Array.from(arguments).join(', ')]
    //             // Array.from(arguments).map(i => formatToTimeZone(new Date, "D.M.YYYY HH:mm:ss.SSS", {timeZone: 'Asia/Jakarta'}) + " : " + i)
    //         );
    //     };
    // });
// }
// const { listTimeZones } = require('timezone-support')
// console.log(listTimeZones());
