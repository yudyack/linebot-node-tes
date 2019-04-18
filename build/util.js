"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
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
