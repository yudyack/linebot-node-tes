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
// const { formatToTimeZone } = require('date-fns-timezone')
loadEnv();
function loadEnv() {
    process.env.HOME_DIR = path.resolve(__dirname, '../') + "/";
    require('dotenv').config({ path: process.env.HOME_DIR + ".env" });
}
exports.loadEnv = loadEnv;
exports.config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
exports.client = function () {
    console.log(process.env.CONNECTIONDB);
    return mongo.connect(process.env.CONNECTIONDB ?
        process.env.CONNECTIONDB : "", { useNewUrlParser: true })
        .catch(function (err) {
        console.log('error database connection');
        throw err;
    });
};
var repository_1 = require("./repository");
// export const overrideLog = _overrideLog();
console.log("util terpanggil");
function loadData() {
    var raw = fs.readFileSync(process.env.HOME_DIR + 'data.json');
    var dataAll = JSON.parse(raw.toString());
    return dataAll;
}
exports.loadData = loadData;
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
process.on("exit", exitHandler);
process.on('uncaughtException', exceptionHandler);
process.on('SIGINT', exceptionHandler);
process.on('SIGUSR1', exceptionHandler);
process.on('SIGUSR2', exceptionHandler);
function exitHandler(code) {
    console.log("adsf");
    repository_1.closeDbClient();
}
function exceptionHandler() {
    // console.log("asdf")
    // closeDbClient();
    // exitHandler(0);
    process.exit();
}
//# sourceMappingURL=util.js.map