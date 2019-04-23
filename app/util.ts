
import path = require('path');
import fs = require('fs');
import { Config } from '@line/bot-sdk';

loadEnv();

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