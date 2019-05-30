import {
  Client,
  MiddlewareConfig,
  TextEventMessage,
  ImageEventMessage,
  VideoEventMessage,
  AudioEventMessage,
  LocationEventMessage,
  StickerEventMessage,
  ClientConfig,
  WebhookEvent,
  MessageEvent,
  FollowEvent,
  UnfollowEvent,
  JoinEvent,
  LeaveEvent,
  MemberJoinEvent,
  MemberLeaveEvent,
  PostbackEvent,
  EventSource,
  User,
  Group,
  Room,
  EventMessage,
  ReplyableEvent,
  EventBase
} from "@line/bot-sdk";
import { config, hostname, client as $dbclient, range } from "./util";
import { promises } from "fs";
import { User as RepoUser } from "./repository";

export const handle = chaining();

const client = new Client(<ClientConfig>config);
const cache = {};
import { Pc, processes } from "./pc";
import { addpc, getLastCachePc, cacheMapPcs } from "./cacheChat";

const replyText = (token: string, texts: string | any[]) => {
    // token expire in 30s
    texts = Array.isArray(texts) ? texts : [texts];
    console.log(`sending ${texts}`);
    return client.replyMessage(
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
  let matchesText = pc.getMatchesText(/^last! \d+/);
  if (matchesText.length > 0) {
    let number = parseInt(matchesText[0].split(" ")[1]) || 1;
    let lastPc = getLastCachePc(pc);
    if(lastPc) {
      let text = lastPc.getMsgText();
      if (!text) return pc;
      for (const i of Array(number).keys()) {
        pc.addReplyMessage(text)
      }
    }
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
    console.log(getLastCachePc(pc));
    console.log(cacheMapPcs);
    let hrend = process.hrtime(hrstart);
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return ;
  }
}

processes.push(
  first,
  second,
  getUser,
  testing,
  spamLast,
  mintaId,

);

console.log(processes);

