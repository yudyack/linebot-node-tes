
require('dotenv').config()

// import * as Twit from "twit";
import Twit = require("twit");
import util = require("util");
import { GeoData, GeoParams } from "./types/geoResult";
import { Tweet } from "./types/tweet";
import { GetTwitterDbClient } from "./utilConfig";
import * as mongo from "mongodb";

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

async function run() {
  let connection_string;
  if (!(connection_string = process.env.CONNECTIONDB)) throw "empty connectionDB";

  let client = await GetTwitterDbClient().catch(()=>{throw "fail connect"});
  if (!client) throw "no client";
  console.log("connected");

  let tweets: mongo.Collection<any>;
  if (!(tweets = client.db("twitter").collection("tweet"))) throw "fail load tweet collection";
  
  let indonesiaBox = "95.2930261576, -10.3599874813, 141.03385176, 5.47982086834";
  let data: Tweet[] = [];
  counter = await tweets.countDocuments().catch(()=> {throw "fail count collection"});
  let added = 0;

  let twstream = T.stream("statuses/filter", <any> {
    // Name: "tweet",
    // track: "",
    locations: indonesiaBox
    // words: words 
  })
    .on("tweet", async (tweet: Tweet) =>{

      if(tweet.place && (<Tweet> tweet).place.country_code == "ID") {
        data.push(tweet);
        added += 1; 
        await tweets.insertOne(tweet);
        console.log(`${tweet.id} added, total: ${counter + added}`);

        if(tweet.text.includes("anakindonesia")) {
          console.log(tweet);
        }

        if(stopFlag) {
          twstream.stop();
          return
        }
      }
    })

}


export const start = () => {
  stopFlag = false;
  run()
}

export const stop = () => {
  stopFlag = true;
}

let counter = 0;
export const getCount = () => {
  return counter;
}

let stopFlag = false;


export let twitCommand = {};

class TwitterStreaming {


}