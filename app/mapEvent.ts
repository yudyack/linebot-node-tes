import {
  Client,
  ClientConfig,
  AudioMessage,
} from "@line/bot-sdk";
import { config, hostname, client as $dbclient, range, textToSpeechClient, getIndVoices, fullHostname } from "./utilConfig";
import { promises, writeFile, write } from "fs";
import { User as RepoUser } from "./repository";

export const handle = chaining();

const clientLine = new Client(<ClientConfig>config);
const cache = {};
import { Pc, processes } from "./pc";
import { addpc, getLastIndexCachePc, getCachedPcsLength } from "./cacheChat";
import { SynthesizeSpeechRequest } from "@google-cloud/text-to-speech";
var AudioContext = require('web-audio-api').AudioContext
const Fdkaac = require("node-fdkaac").Fdkaac;
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { inspect, promisify } from 'util';
import { addListener } from "cluster";


const replyText = (token: string, texts: string | any[]) => {
    // token expire in 30s
    texts = Array.isArray(texts) ? texts : [texts];
    console.log(`sending ${texts}`);
    return clientLine.replyMessage(
      token,
      texts.map((text) => ({ type: 'text', text }))
    );
};

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
      for (const i of Array(times).keys()) {
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
    console.log(wordstr);

    let voices = await getIndVoices;
    let chosenVoice = voices[0];
    console.log(chosenVoice);

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


    // const [res_data] = await textToSpeechClient.synthesizeSpeech(data)
    // const buffer = res_data.audioContent;
    // await writeFile("./static/audio/test.wav", buffer, (err)=> {console.log(err)});
    // console.log("problem usng line audio mesasge");
    // pc.addReplyMessage(`Audio is at ${fullHostname}/static/audio/test.wav`);


    textToSpeechClient.synthesizeSpeech(data)
      .then(async response => {
        console.log(inspect(response));
        const [res_data] = response;
        const buffer = res_data.audioContent;

        const audioContext = new AudioContext;
        let {duration}: any = await new Promise((resolve, reject) => {
          audioContext.decodeAudioData(buffer, (audio: any) => {
            resolve(audio);
          })
        })
        if (duration < 30) {
          duration += 1;
        } else {
          duration = 30;
        }

        let filename = (new Date()).toISOString() + pc.getSourceOrgId();
        writeFile(`./static/audio/${filename}.wav`, buffer, (err)=> {console.log(err)});

        // encode
        const encoder = new Fdkaac({
          output: `./static/audio/${filename}.m4a`,
          bitrate: 192
        }).setBuffer(buffer);

        await encoder.encode()
          .then(()=>{
            console.log('encoded');
          })

        // rplying
        let replyableEvent = pc.replyableEvent;
        if (replyableEvent) {
          let token = replyableEvent.replyToken;
          const audioMessage: AudioMessage = {
            type: "audio",
            originalContentUrl: `${fullHostname}/static/audio/${filename}.m4a`,
            duration: duration
          }
          clientLine.replyMessage(token, audioMessage)
        }
      })
  }
  return pc;
}


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
  first,
  second,
  // getUser,
  testing,
  spamLast,
  mintaId,
  textToSpeech,
);

console.log(processes);

