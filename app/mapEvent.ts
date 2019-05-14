import {
  Client,
  MiddlewareConfig,
  TextEventMessage,
  ImageEventMessage,
  VideoEventMessage,
  AudioEventMessage,
  LocationEventMessage,
  StickerEventMessage,
  ClientConfig
} from "@line/bot-sdk";
import { config, hostname, client as $dbclient } from "./util";
import { promises } from "fs";
import { User } from "./repository";

export const handle = chaining();

const client = new Client(<ClientConfig>config);
const cache = {};

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
  if (!/.*/.test(pc.dto.type)) return pc;
  console.log('pc 2');
  pc.test.push(2);
  return pc;
}

async function getUser(pc: Pc): Promise<Pc> {
  console.log('pc 3');
  let userId = pc.dto.source.userId;
  let groupId = pc.dto.source.groupId;
  let user = await User.get(userId, groupId).catch(() => null);
  console.log(user);
  return pc;
}

async function calc(pc: Pc): Promise<Pc> {
  // if(!/.*/.test(pc.dto.type))
  return pc;
}

async function mintaId(pc: Pc): Promise<Pc> {
  let text = pc.getMsgText() || "";
  if ((/^minta id$/).test(text)) {

    let replyToken = pc.dto.replyToken;
    pc.addReplyMessage(pc.dto.source.userId);
  }

  return pc;
}

async function testing(pc: Pc): Promise<Pc> {
  let matchesText = pc.getMatchesText(/^tes \d+/);
  if (matchesText.length > 0) {
    let number = parseInt(matchesText[0].split(" ")[1]) || 1;
    console.log(`number: ${number}`);
    let replyToken = pc.dto.replyToken;
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
  }
  return pc;
}


const processes: Process[] = [
  // first,
  // second,
  getUser,
  // calc,
  // mintaId,
  testing

]

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
      let hrend = process.hrtime(hrstart);
      console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
      // TODO:
      // validating message to sent

      let simple_text_messages = pc.replyMessages.slice(0,4);
      // console.log(simple_text_messages);

      if (simple_text_messages.length > 0) {
        replyText(pc.dto.replyToken, simple_text_messages)
          .catch(i => {
            console.warn("fail reply msg: " + pc.replyMessages);
            // console.log(i);
            return i;
        });
      }
    }
    return ;
  }
}


interface Process{(dto:any) : Promise<any>;};

export class Pc {
  signal: {
    stop: boolean;
  } = {stop: false}
  dto: any;
  processHistory: Process[] = [];
  processes?: Process[];
  now?: any;
  test?: any;
  foo?: any;
  idx: number = 0;
  replyMessages: any[] = [];
  time?: number[];
  
  prepare (pc: Process): void {
    this.processes = processes;
    this.now = {
      idx: ++this.idx,
      name: pc.name
    }
    this.processHistory.push(pc);
    this.time = process.hrtime();
  }
  
  put (index: number, callback: Process): void {
    processes.splice(index, 0, callback);
  }

  putNext (callback: Process): void {
    this.put(this.idx, callback);
  }

  constructor(dto: any){
    this.dto = dto;
  }

  addReplyMessage(message: any): void {
    this.replyMessages.push(message)
  }

  getMsgText(): string | null {
    console.log(this.dto.message.text);
    let dto = this.dto;
    let message = dto.message;
    let text = message.text;
    return text ? text : null;
  }

  getMsg(): string {
    return this.dto.message;
  }

  getMatchesText(re: RegExp): string[] {
    let text = this.getMsgText() || "";
    return text.match(re) || [];
  }

}



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