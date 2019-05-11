"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var mongo = __importStar(require("mongodb"));
loadEnv();
function loadData() {
    var raw = fs.readFileSync(process.env.HOME_DIR + 'data.json');
    var dataAll = JSON.parse(raw.toString());
    return dataAll;
}
exports.loadData = loadData;
function loadEnv() {
    process.env.HOME_DIR = path.resolve(__dirname, '../') + "/";
    require('dotenv').config({ path: process.env.HOME_DIR + ".env" });
}
exports.loadEnv = loadEnv;
exports.config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
exports.dataAll = loadData();
exports.hostname = '';
function setHostname(host) {
    exports.hostname = host;
}
exports.setHostname = setHostname;
// export function db(callback: MongoCallback<MongoClient>){
//     const url = process.env.CONNECTDB;
//     if (typeof url === 'string') {
//         return mongo.connect(url, callback)
//     } else {
//         throw "error in loading env connect db in util.ts";
//     }
// }
exports.client = function () {
    return mongo.connect(process.env.CONNECTIONDB ?
        process.env.CONNECTIONDB : "")
        .catch(function (err) {
        console.log(process.env.CONNECTIONDB);
        console.log('error database connection');
        throw err;
    });
};
