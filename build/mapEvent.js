"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bot_sdk_1 = require("@line/bot-sdk");
var util_1 = require("./util");
exports.handle = chaining();
var client = new bot_sdk_1.Client(util_1.config);
var cache = {};
var replyText = function (token, texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    console.log("sending " + texts);
    return client.replyMessage(token, texts.map(function (text) { return ({ type: 'text', text: text }); }));
};
function handleTextQ(message, replyToken, source) { return Promise.resolve(); }
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
            switch (message.type) {
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
function handleText(message, replyToken, source) {
    var buttonsImageURL = "https://" + util_1.hostname + "/static/buttons/1040.jpg";
    // const buttonsImageURL = "https://i.imgur.com/3hrYrON.jpg"
    console.log(buttonsImageURL);
    switch (message.text) {
        case 'profile':
            if (source.userId) {
                return client.getProfile(source.userId)
                    .then(function (profile) { return replyText(replyToken, [
                    "Display name: " + profile.displayName,
                    "Status message: " + profile.statusMessage,
                ]); });
            }
            else {
                return replyText(replyToken, 'Bot can\'t use profile API without user ID');
            }
        case 'buttons':
            return client.replyMessage(replyToken, {
                type: 'template',
                altText: 'Buttons alt text',
                template: {
                    type: 'buttons',
                    thumbnailImageUrl: buttonsImageURL,
                    title: 'My button sample',
                    text: 'Hello, my button',
                    actions: [
                        { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                        { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                        { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                        { label: 'Say message', type: 'message', text: 'Rice=米' },
                    ],
                },
            });
        case 'confirm':
            return client.replyMessage(replyToken, {
                type: 'template',
                altText: 'Confirm alt text',
                template: {
                    type: 'confirm',
                    text: 'Do it?',
                    actions: [
                        { label: 'Yes', type: 'message', text: 'Yes!' },
                        { label: 'No', type: 'message', text: 'No!' },
                    ],
                },
            });
        case 'carousel':
            return client.replyMessage(replyToken, {
                type: 'template',
                altText: 'Carousel alt text',
                template: {
                    type: 'carousel',
                    columns: [
                        {
                            thumbnailImageUrl: buttonsImageURL,
                            title: 'hoge',
                            text: 'fuga',
                            actions: [
                                { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                                { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                            ],
                        },
                        {
                            thumbnailImageUrl: buttonsImageURL,
                            title: 'hoge',
                            text: 'fuga',
                            actions: [
                                { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                                { label: 'Say message', type: 'message', text: 'Rice=米' },
                            ],
                        },
                    ],
                },
            });
        case 'image carousel':
            return client.replyMessage(replyToken, {
                type: 'template',
                altText: 'Image carousel alt text',
                template: {
                    type: 'image_carousel',
                    columns: [
                        {
                            imageUrl: buttonsImageURL,
                            action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
                        },
                        {
                            imageUrl: buttonsImageURL,
                            action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                        },
                        {
                            imageUrl: buttonsImageURL,
                            action: { label: 'Say message', type: 'message', text: 'Rice=米' },
                        },
                        {
                            imageUrl: buttonsImageURL,
                            action: {
                                label: 'datetime',
                                type: 'datetimepicker',
                                data: 'DATETIME',
                                mode: 'datetime',
                            },
                        },
                    ]
                },
            });
        case 'datetime':
            return client.replyMessage(replyToken, {
                type: 'template',
                altText: 'Datetime pickers alt text',
                template: {
                    type: 'buttons',
                    text: 'Select date / time !',
                    actions: [
                        { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
                        { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
                        { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
                    ],
                },
            });
        case 'imagemap':
            return client.replyMessage(replyToken, {
                type: 'imagemap',
                baseUrl: __dirname + "/static/rich",
                altText: 'Imagemap alt text',
                baseSize: { width: 1040, height: 1040 },
                actions: [
                    { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
                    { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
                    { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
                    { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
                ],
                video: {
                    originalContentUrl: __dirname + "/static/imagemap/video.mp4",
                    previewImageUrl: __dirname + "/static/imagemap/preview.jpg",
                    area: {
                        x: 280,
                        y: 385,
                        width: 480,
                        height: 270,
                    },
                    externalLink: {
                        linkUri: 'https://line.me',
                        label: 'LINE'
                    }
                },
            });
        case 'bye':
            switch (source.type) {
                case 'user':
                    return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
                case 'group':
                    return replyText(replyToken, 'Leaving group')
                        .then(function () { return client.leaveGroup(source.groupId); });
                case 'room':
                    return replyText(replyToken, 'Leaving room')
                        .then(function () { return client.leaveRoom(source.roomId); });
            }
        default:
            // console.log(`Echo message to ${replyToken}: ${message.text}`);
            // return replyText(replyToken, message.text);
            return null;
    }
}
function first(pc) {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            console.log('pc 1');
            arr = [1];
            pc.test = arr;
            // pc['signal'] = {stop:true};
            // pc.put(2, second);
            return [2 /*return*/, pc];
        });
    });
}
function second(pc) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!/.*/.test(pc.dto.type))
                return [2 /*return*/, pc];
            console.log('pc 2');
            pc.test.push(2);
            return [2 /*return*/, pc];
        });
    });
}
function getUser(pc) {
    return __awaiter(this, void 0, void 0, function () {
        var dbclient, userId, users, result, userDoc, result_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('pc 3');
                    return [4 /*yield*/, util_1.client()];
                case 1:
                    dbclient = _a.sent();
                    userId = pc.dto.source.userId;
                    users = dbclient.db("sampledb").collection("user");
                    console.log("finding users");
                    return [4 /*yield*/, users.find(userId).toArray().catch(function () { throw "fail when finding user"; })];
                case 2:
                    result = _a.sent();
                    if (!(result.length == 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client.getProfile(userId).catch(function () { throw "error get data"; })];
                case 3:
                    userDoc = _a.sent();
                    return [4 /*yield*/, users.insert(userDoc).catch(function () { throw "error insert"; })];
                case 4:
                    result_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    console.log('user found', result);
                    _a.label = 6;
                case 6:
                    dbclient.close();
                    return [2 /*return*/, pc];
            }
        });
    });
}
function calc(pc) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // if(!/.*/.test(pc.dto.type))
            return [2 /*return*/, pc];
        });
    });
}
function mintaId(pc) {
    return __awaiter(this, void 0, void 0, function () {
        var text, replyToken;
        return __generator(this, function (_a) {
            text = pc.getMsgText() || "";
            if ((/^minta id$/).test(text)) {
                replyToken = pc.dto.replyToken;
                pc.addReplyMessage(pc.dto.source.userId);
            }
            return [2 /*return*/, pc];
        });
    });
}
function testing(pc) {
    return __awaiter(this, void 0, void 0, function () {
        var matches, number_1, replyToken_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    matches = pc.getMatches(/^tes \d+/);
                    if (!(matches.length > 0)) return [3 /*break*/, 2];
                    number_1 = parseInt(matches[0].split(" ")[1]) || 1;
                    console.log("number: " + number_1);
                    replyToken_1 = pc.dto.replyToken;
                    return [4 /*yield*/, new Promise(function (resolve) {
                            setTimeout(function () {
                                replyText(replyToken_1, "replied for " + number_1)
                                    .catch(function (err) {
                                    console.warn(err, "message not sent");
                                });
                                resolve();
                            }, number_1);
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, pc];
            }
        });
    });
}
var processes = [
    // first,
    // second,
    // getUser,
    // calc,
    // mintaId,
    testing
];
var counter = 0;
function chaining() {
    counter += 1;
    return function run(dto) {
        return __awaiter(this, void 0, void 0, function () {
            var hrstart, pc, _i, processes_1, process_1, hrend, simple_text_messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hrstart = process.hrtime();
                        console.log("counter: " + counter);
                        pc = new Pc(dto);
                        if (!pc.dto) return [3 /*break*/, 5];
                        _i = 0, processes_1 = processes;
                        _a.label = 1;
                    case 1:
                        if (!(_i < processes_1.length)) return [3 /*break*/, 4];
                        process_1 = processes_1[_i];
                        pc.prepare(process_1);
                        return [4 /*yield*/, process_1(pc)
                                .catch(function (err) {
                                console.warn(err);
                                var newstop = new Pc(dto);
                                newstop.signal.stop = true;
                                return newstop;
                            })];
                    case 2:
                        pc = _a.sent();
                        if (pc.signal.stop)
                            return [3 /*break*/, 4];
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        hrend = process.hrtime(hrstart);
                        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
                        simple_text_messages = pc.replyMessages.slice(0, 4);
                        // console.log(simple_text_messages);
                        if (simple_text_messages.length > 0) {
                            replyText(pc.dto.replyToken, simple_text_messages)
                                .catch(function (i) {
                                console.warn("fail reply msg: " + pc.replyMessages);
                                // console.log(i);
                                return i;
                            });
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
}
exports.chaining = chaining;
;
var Pc = /** @class */ (function () {
    function Pc(dto) {
        this.signal = { stop: false };
        this.processHistory = [];
        this.idx = 0;
        this.replyMessages = [];
        this.dto = dto;
    }
    Pc.prototype.prepare = function (pc) {
        this.processes = processes;
        this.now = {
            idx: ++this.idx,
            name: pc.name
        };
        this.processHistory.push(pc);
        this.time = process.hrtime();
    };
    Pc.prototype.put = function (index, callback) {
        processes.splice(index, 0, callback);
    };
    Pc.prototype.putNext = function (callback) {
        this.put(this.idx, callback);
    };
    Pc.prototype.addReplyMessage = function (message) {
        this.replyMessages.push(message);
    };
    Pc.prototype.getMsgText = function () {
        console.log(this.dto.message.text);
        var dto = this.dto;
        var message = dto.message;
        var text = message.text;
        // let text = this.dto.messsage.text || "";
        return text ? text : null;
    };
    Pc.prototype.getMsg = function () {
        return this.dto.message;
    };
    Pc.prototype.getMatches = function (re) {
        var text = this.getMsgText() || "";
        return text.match(re) || [];
    };
    return Pc;
}());
// export function switchHandle(load: any) {
//   let message = load.message;
//   switch (true) {
//     case /.*/.test(message):
//       first(load);
//       break;
//     case /.*/.test(message):
//       second(load);
//       break;
//   }
// }
//# sourceMappingURL=mapEvent.js.map