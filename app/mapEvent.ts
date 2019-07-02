import {
  Client,
  ClientConfig,
  AudioMessage,
} from "@line/bot-sdk";
import { configLine, hostname, client as $dbclient, textToSpeechClient, getIndVoices, fullHostname, rootPath } from "./utilConfig";
import { promises, writeFile, write } from "fs";
import { User as RepoUser } from "./repository";

export const handle = chaining();

const clientLine = new Client(<ClientConfig>configLine);
const cache = {};
import { Pc, processes } from "./pc";
import { addpc, getLastIndexCachePc, getCachedPcsLength } from "./cacheChat";
import { SynthesizeSpeechRequest } from "@google-cloud/text-to-speech";
var AudioContext = require('web-audio-api').AudioContext
const Fdkaac = require("node-fdkaac").Fdkaac;
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { inspect, promisify } from 'util';
import { Hash, createHash } from "crypto";
import * as fs from "fs";
import { decode } from "punycode";
import { resolve } from "path";
import { sessionManager } from "./stateBuild";


const replyText = (token: string, texts: string | any[]) => {
    // token expire in 30s
    texts = Array.isArray(texts) ? texts : [texts];
    console.log(`sending ${texts}`);
    return clientLine.replyMessage(
      token,
      texts.map((text) => ({ type: 'text', text }))
    );
};

async function testHook(pc: Pc): Promise<Pc> {
  if (pc.replyableEvent && pc.replyableEvent.replyToken.match(/^(.)\1*$/)) {
    console.log("Test hook recieved: " + JSON.stringify(pc.getMsgText()));
    pc.stop();
  }
  return pc;
}

async function first(pc: Pc): Promise<Pc>{
  console.log('pc 1');
  let arr = [1];
  pc.test = arr;
  // pc['signal'] = {stop:true};
  // pc.put(2, second);
  return pc;
}

async function second(pc: Pc): Promise<Pc> {
  if (!/.*/.test(pc.webhookEvent.type)) return pc;
  console.log('pc 2');
  pc.test.push(2);
  return pc;
}

async function getUser(pc: Pc): Promise<Pc> {
  console.log('pc 3');
  let userId = pc.webhookEventAll.source.userId;
  let groupSource = pc.webhookEventAll.groupSource;
  console.log(pc.webhookEvent);
  console.log(`grou user: ${groupSource}, userid: ${userId}`);
  if (groupSource && userId) {
    let groupId = groupSource.groupId;
    let user = await RepoUser.get(userId, groupId).catch(() => null);
    console.log(user);
  } else {
    console.warn("can't get user");
  }
  return pc;
}

async function calc(pc: Pc): Promise<Pc> {
  // if(!/.*/.test(pc.dto.type))
  return pc;
}

async function mintaId(pc: Pc): Promise<Pc> {
  let text = pc.getMsgText() || "";
  if ((/^minta id$/).test(text) && pc.replyableEvent) {

    let replyToken = pc.replyableEvent.replyToken;
    pc.addReplyMessage(pc.dto.source.userId);
  }

  return pc;
}

async function testing(pc: Pc): Promise<Pc> {
  let matchesText = pc.getMatchesTextLowerCase(/^tes \d+/);
  if (matchesText.length > 0) {
    let number = parseInt(matchesText[0].split(" ")[1]) || 1;
    console.log(`number: ${number}`);
    if (pc.replyableEvent){
      let replyToken = pc.replyableEvent.replyToken;
      await new Promise((resolve) => {
        setTimeout(function() {
          replyText(replyToken, `replied for ${number}`)
            .catch((err) => {
              console.warn(err, "message not sent");
            });
            resolve();
          }, number);
        }
      );
    } else {
      console.warn("not an replyable event");
    }
  }
  return pc;
}

async function spamLast(pc: Pc): Promise<Pc> {
  let matchesText = pc.getMatchesTextLowerCase(/^last *\d* *\d*$/);
  if (matchesText.length > 0) {
    let number = parseInt(matchesText[0].split(" ")[1]) || 1;
    let times = parseInt(matchesText[0].split(" ")[2]) || 1;
    let lastPc: Pc | undefined;
    let length = getCachedPcsLength(pc);
    while (!lastPc && length && length > number) {
      lastPc = getLastIndexCachePc(pc, number);
      number +=1;
      if (lastPc) {
        let text = lastPc.getMsgText() || "";
        let match = text.toLowerCase().match(/^last/) || [];
        if(match.length > 0) lastPc = undefined;
      }
    }
    if(lastPc) {
      let text = lastPc.getMsgText();
      if (!text) return pc;
      for (const {} of Array(times).keys()) {
        pc.addReplyMessage(text)
      }
    }
  }
  return pc;
}

async function textToSpeech(pc:Pc) {
  let matchesText = pc.getMatchesText(/^v( .*)+/g);
  if (matchesText.length > 0) {
    let wordstr = matchesText[0].substring(2);
    const chosenVoidIndex = 2;
    console.log(wordstr);

    let hash = createHash('md5');
    let filename = `${chosenVoidIndex}_${hash.update(wordstr).digest('hex')}`;
      
    let duration: number;
    let file: Buffer | null;

    try {
      file = fs.readFileSync(`./audio/${filename}.m4a`);
    } catch (e) {
      file = null
    }

    if (file) {
      console.log("file exists")
      // get duration
      const audioContext = new AudioContext;

      let decoded: any = await new Promise((resolve, reject) => {
        audioContext.decodeAudioData(file, (audio: any) => {
          resolve(audio);
        })
      })
      duration = decoded.duration;

    } else {
      console.log("file doesn't exist")
      let voices = await getIndVoices;
      console.log(voices);
      let chosenVoice = voices[chosenVoidIndex];
      let data : SynthesizeSpeechRequest = {
        input: {
          text: wordstr
        },
        voice: {
          languageCode: chosenVoice.languageCodes[0],
          name: chosenVoice.name,

        },
        audioConfig: {
          audioEncoding: "LINEAR16",
        }
      }

      const response =  await textToSpeechClient.synthesizeSpeech(data);
      const [res_data] = response;
      console.log(response)
      const buffer  = res_data.audioContent;

      // get duration
      const audioContext = new AudioContext;
      let decoded: any = await new Promise((resolve, reject) => {
        audioContext.decodeAudioData(buffer, (audio: any) => {
          resolve(audio);
        })
      })
      duration = decoded.duration;
      // encode and save
      const audioPath = `${rootPath}/audio/${filename}.m4a`;
      console.log(audioPath);
      const encoder = new Fdkaac({
        output: audioPath,
        bitrate: 192
      }).setBuffer(buffer);
      await encoder.encode()
        .then(()=>{
          console.log('encoded');
      })
    }

    // rplying
    console.log("pre duration", duration);
    duration = Math.floor(duration);
    if (duration < 30) {
      duration += 2;
    } else {
      duration = 30;
    }
    console.log("finale duration", duration);
    let replyableEvent = pc.replyableEvent;
    if (replyableEvent) {
      let token = replyableEvent.replyToken;
      const audioMessage: AudioMessage = {
        type: "audio",
        originalContentUrl: `${fullHostname}/getAudio/${filename}`,
        duration: duration
      }
      clientLine.replyMessage(token, audioMessage)
      .catch((err) => {
        console.log(`error sending audio reply: ${wordstr}`)
        // console.log(err.message);
      })
    }
  }
  return pc;
}

// state machine should be per topic
async function goSession(pc:Pc) {
  if (!pc.userId) {
    console.log("user don't show user id, cant get into session")
  } else{
    sessionManager.getSessions(pc.chatId, pc.userId);
  }
  // if (pc.has_state == true) {
  //   pc.stop()
  // }
  return pc;
}


// ------------------
let counter = 0;
export function chaining() : Function {
  return async function run(dto: any) {
    counter+=1;
    let hrstart = process.hrtime();
    console.log("counter: " + counter);
    let pc: Pc = new Pc(dto);
    if (pc.dto) {
      for (const process of processes) {
        pc.prepare(process);
        pc = await process(pc)
          .catch((err)=> {
            console.warn(err);
            let newstop = new Pc(dto);
            newstop.signal.stop = true;
            return newstop;
          });
        if (pc.signal.stop) break;
      }
      // TODO:
      // validating message to sent
      
      let simple_text_messages = pc.replyMessages.slice(0,4);
      // console.log(simple_text_messages);
      
      if (simple_text_messages.length > 0 && pc.isReplyable(pc.dto)) {
        replyText(pc.dto.replyToken, simple_text_messages)
        .catch(i => {
          console.warn("fail reply msg: " + pc.replyMessages);
          // console.log(i);
          return i;
        });
      }
    }
    
    addpc(pc);
    let hrend = process.hrtime(hrstart);
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return ;
  }
}

processes.push(
  testHook,
  first,
  second,
  // getUser,
  testing,
  goSession,
  spamLast,
  mintaId,
  textToSpeech,
);

console.log(processes);

