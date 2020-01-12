
require('dotenv').config()

// import * as Twit from "twit";
import Twit = require("twit");
import util = require("util");
import { GeoData, GeoParams } from "./types/geoResult";
import { Tweet } from "./types/tweet";
import { GetTwitterDbClient } from "./utilConfig";
import * as mongo from "mongodb";
import rpn = require("request-promise-native");
import cheerio = require("cheerio")

// let config: Config
let config: Twit.Options = {
  consumer_key: process.env.twitter_consumer_key || "",
  consumer_secret: process.env.twitter_consumer_secret || "",
  access_token: process.env.twitter_access_token || "",
  access_token_secret: process.env.twitter_access_token_secret || "",
};

let T = new Twit(config)

let params: GeoParams  = {
  query: "Indonesia",
  granularity: "country"
}
// T.setAuth(T.getAuth());
console.log(T.getAuth());


async function getLongTwitter(twit_text: string, isTruncated: boolean): Promise<string>{
  let result = "";
  if (!isTruncated) return twit_text;
  let match = twit_text.match(/[\s\S]*… (?<link>[\s\S]*?)$/)
  let link = match ? 
    match.groups ?
      match.groups.link ?
        match.groups.link
        : ""
      : ""
    : "";

  let res = await rpn.get(link).catch(()=>{
    console.log(`gagal mengambil twit asli ${link}`)
    return twit_text
  });
  let query = cheerio.load(res, { decodeEntities: false })
  let query_result = query(".tweet-text")
    .contents()
    .get(0);
  let longTweet = query_result.nodeValue;
  return longTweet;
}

async function run() {
  instance_count += 1;
  let connection_string;
  if (!(connection_string = process.env.CONNECTIONDB)) throw "empty connectionDB";

  let client = await GetTwitterDbClient().catch(()=>{throw "fail connect"});
  if (!client) throw "no client";
  console.log("connected");

  let tweets: mongo.Collection<any>;
  if (!(tweets = client.db("twitter").collection("tweet_text"))) throw "fail load tweet collection";
  
  let indonesiaBox = "95.2930261576, -10.3599874813, 141.03385176, 5.47982086834";
  let data: Tweet[] = [];
  counter = await tweets.countDocuments().catch(()=> {throw "fail count collection"});
  added = 0;

  let twstream = T.stream("statuses/filter", <any> {
    // Name: "tweet",
    // track: "",
    locations: indonesiaBox
    // words: words 
  })
    .on("tweet", async (tweet: Tweet) => {
      if(tweet.place && (<Tweet> tweet).place.country_code == "ID") {
        // data.push(tweet);
        if(tweet.text.includes("anakindonesia")) {
          // console.log(tweet);
        }
        //TODO: check truncated if true go to link and get de full sstring
        try {
          let tweetText = tweet.text || "";
          tweetText = await getLongTwitter(tweet.text, tweet.truncated);
          console.log(tweetText);
          await tweets.insertOne({
            id_str: tweet.id_str,
            text: tweetText
          });
          added += 1; 
          console.log(`${tweet.id_str} added, total: ${counter + added}
          twit:${tweetText}
          `);

          if (added % 10 == 0) {
            console.log("refresh counter");
            counter = await tweets.countDocuments()
              .then((res) => {
                added = 0;
                return res;
              })
              .catch(()=> {throw "fail count collection"});
          }
        } catch {
          console.log(`${tweet.id_str} is duplicate or error`);
        }

        if(stopFlag) {
          twstream.stop();
          return
        }
      }
    })

}

let promise: Promise<void>;
let instance_count = 0;
export const start = () => {
  stopFlag = false;
  if (promise) {
    promise = promise.then(() => {
      instance_count -= 1;
      stopFlag = false;
      return run();
    })
    stopFlag = true;
  } else {
    promise = run();
  }

  console.log(`instance_count = ${instance_count}`);

}

export const stop = () => {
  stopFlag = true;
}

let counter = 0;
let added = 0;
export const getCount = () => {
  return counter + added;
}

let stopFlag = false;


export let twitCommand = {};

class TwitterStreaming {


}