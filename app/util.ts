
import path = require('path');
import fs = require('fs');
import { Config } from '@line/bot-sdk';
import { MongoCallback, MongoClient } from 'mongodb';
import * as mongo from 'mongodb';


loadEnv();
overrideLog();
console.log("util terpanggil");

export function loadData(): object {
    const raw = fs.readFileSync(process.env.HOME_DIR+'data.json');
    const dataAll = JSON.parse(raw.toString());

    return dataAll;
}

export function loadEnv(): void {
    process.env.HOME_DIR = path.resolve(__dirname, '../') + "/";
    require('dotenv').config({path:process.env.HOME_DIR+".env"});
}

export const config: Config = {
    channelAccessToken: <string> process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: <string> process.env.CHANNEL_SECRET
}

export const dataAll = loadData();

export var hostname: String = '';

export function setHostname(host:String) {
    hostname = host;
}

// export function db(callback: MongoCallback<MongoClient>){
//     const url = process.env.CONNECTDB;
//     if (typeof url === 'string') {
//         return mongo.connect(url, callback)
//     } else {
//         throw "error in loading env connect db in util.ts";
//     }
// }

export const client = () : Promise<MongoClient> => {
  return mongo.connect(process.env.CONNECTIONDB?
      process.env.CONNECTIONDB : "")
  .catch((err)=>{
    console.log(process.env.CONNECTIONDB)
    console.log('error database connection');
    throw err;
})}

function overrideLog() {

}