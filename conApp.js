System.register("util", ["path", "fs"], function (exports_1, context_1) {
    "use strict";
    var path, fs;
    var __moduleName = context_1 && context_1.id;
    function loadData() {
        var raw = fs.readFileSync(process.env.HOME_DIR + 'data.json');
        var dataAll = JSON.parse(raw.toString());
        return dataAll;
    }
    exports_1("loadData", loadData);
    function loadEnv() {
        process.env.HOME_DIR = path.resolve(__dirname, '../') + "/";
        require('dotenv').config({ path: process.env.HOME_DIR + ".env" });
    }
    exports_1("loadEnv", loadEnv);
    return {
        setters: [
            function (path_1) {
                path = path_1;
            },
            function (fs_1) {
                fs = fs_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("app", ["express", "@line/bot-sdk", "util"], function (exports_2, context_2) {
    "use strict";
    var express, bot_sdk_1, util_1, dataAll, app, config;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (express_1) {
                express = express_1;
            },
            function (bot_sdk_1_1) {
                bot_sdk_1 = bot_sdk_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            }
        ],
        execute: function () {
            util_1.loadEnv();
            dataAll = util_1.loadData();
            console.log(dataAll);
            // Create a new express application instance
            app = express();
            config = {
                channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
                channelSecret: process.env.CHANNEL_SECRET
            };
            app.get('/', function (req, res) {
                res.send('Hello World!');
                console.log('asdaffdffssdafsdafadffdsdafsdd');
            });
            // app.post('/webhook', (req, res) => {
            //     res.json({'test': 'ssdafdas'})
            // })
            app.post('/webhook', bot_sdk_1.middleware(config), function (req, res) {
                var obj = req.body.events; // webhook event objects
                var dest = req.body.destination; // user ID of the bot (optional)
                console.log(obj, dest);
                var user_id = obj.source.userId;
            });
            app.listen(3000, function () {
                console.log('Example app listening on port 3000!');
            });
        }
    };
});
