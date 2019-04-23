"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bot_sdk_1 = require("@line/bot-sdk");
var util_1 = require("./util");
var client = new bot_sdk_1.Client(util_1.config);
var replyText = function (token, texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(token, texts.map(function (text) { return ({ type: 'text', text: text }); }));
};
function handleText(message, replyToken, source) { return Promise.resolve(); }
function handleImage(message, replyToken) { return Promise.resolve(); }
function handleVideo(message, replyToken) { return Promise.resolve(); }
function handleAudio(message, replyToken) { return Promise.resolve(); }
function handleLocation(message, replyToken) { return Promise.resolve(); }
function handleSticker(message, replyToken) { return Promise.resolve(); }
function handleEvent(event) {
    if ((event).replyToken && (event).replyToken.match(/^(.)\1*$/)) {
        return console.log("Test hook recieved: " + JSON.stringify(event.message));
    }
    switch (event.type) {
        case 'message':
            var message = event.message;
            switch (message) {
                case 'text':
                    return handleText(message, event.replyToken, event.source);
                case 'image':
                    return handleImage(message, event.replyToken);
                case 'video':
                    return handleVideo(message, event.replyToken);
                case 'audio':
                    return handleAudio(message, event.replyToken);
                case 'location':
                    return handleLocation(message, event.replyToken);
                case 'sticker':
                    return handleSticker(message, event.replyToken);
                default:
                    throw new Error("Unknown message: " + JSON.stringify(message));
            }
        case 'follow':
            return replyText(event.replyToken, 'Got followed event');
        case 'unfollow':
            return console.log("Unfollowed this bot: " + JSON.stringify(event));
        case 'join':
            return replyText(event.replyToken, "Joined " + event.source.type);
        case 'leave':
            return console.log("Left: " + JSON.stringify(event));
        case 'postback':
            var data = event.postback.data;
            if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
                data += "(" + JSON.stringify(event.postback.params) + ")";
            }
            return replyText(event.replyToken, "Got postback: " + data);
        case 'beacon':
            return replyText(event.replyToken, "Got beacon: " + event.beacon.hwid);
        default:
            throw new Error("Unknown event: " + JSON.stringify(event));
    }
}
exports.handleEvent = handleEvent;
