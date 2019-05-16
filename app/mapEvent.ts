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
import { config, hostname, client as $dbclient } from "./util";
import { promises } from "fs";
import { User as RepoUser } from "./repository";

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
  if (!/.*/.test(pc.webhookEvent.type)) return pc;
  console.log('pc 2');
  pc.test.push(2);
  return pc;
}

async function getUser(pc: Pc): Promise<Pc> {
  console.log('pc 3');
  let userId = pc.webhookEventAll.source.userId;
  let groupSource = pc.webhookEventAll.groupSource;
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
  let matchesText = pc.getMatchesText(/^tes \d+/);
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

      if (simple_text_messages.length > 0 && pc.isReplyable(pc.dto)) {
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

// TODO: more typing from line
export class Pc {
  signal: {
    stop: boolean;
  } = {stop: false}
  dto: EventBase;
  processHistory: Process[] = [];
  processes?: Process[];
  now?: any;
  test?: any;
  foo?: any;
  idx: number = 0;
  replyMessages: any[] = [];
  time?: number[];

  webhookEventAll: WebhookEventAll;
  webhookEvent: WebhookEvent;
  replyableEvent?: ReplyableEvent;
  messageEventAll?: MessageEventAll;
  followEvent?: FollowEvent;
  unfollowEvent?: UnfollowEvent;
  joinEvent?: JoinEvent;
  leaveEvent?: LeaveEvent;
  memberJoinEvent?: MemberJoinEvent;
  memberLeaveEvent?: MemberLeaveEvent;
  postbackEvent?: PostbackEvent;



  
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
    this.dto = <EventBase> dto;
    this.webhookEvent = <WebhookEvent> dto;
    this.webhookEventAll = <WebhookEventAll> dto;
    this.replyableEvent = dto.replyToken? <ReplyableEvent> dto: undefined;
    this.mapEvent(this.webhookEventAll, this);
    // this.mapEventSource(this.webhookEvent.source, this.webhookEvent);
  }

  mapEvent(webhookEventAll: WebhookEventAll, pc: Pc) {
    // let eventMessage = (<MessageEvent>webhookEvent).message;
    switch (webhookEventAll.type) {
      case "message":
        pc.messageEventAll = webhookEventAll;
        break;
      case "follow":
        pc.followEvent = webhookEventAll;
        break;
      case "unfollow":
        pc.unfollowEvent = webhookEventAll;
        break;
      case "join":
        pc.joinEvent = webhookEventAll;
        break;
      case "leave":
        pc.leaveEvent = webhookEventAll;
        break;
      case "memberJoined":
        pc.memberJoinEvent = webhookEventAll;
        break;
      case "memberLeft":
        pc.memberLeaveEvent = webhookEventAll;
        break;
      case "postback":
        pc.postbackEvent = webhookEventAll;
        break;
      default:
        break;
    }
  }

  mapEventSource(eventSource: EventSource, webhookEventAll: WebhookEventAll) {
    switch (eventSource.type) {
      case "user":
        webhookEventAll.userSource = eventSource;
        break;
      case "group":
        webhookEventAll.groupSource = eventSource;
        break;
      case "room":
        webhookEventAll.roomSource = eventSource;
        break;
      default:
        break;
    }
  }

  addReplyMessage(message: any): void {
    this.replyMessages.push(message)
  }

  getMsgText(): string | null {
    return (<TextEventMessage> this.getMsg()).text || null;
  }

  getMsg(): EventMessage | null{
    return  (<MessageEvent> this.webhookEvent).message || null;
  }

  getMatchesText(re: RegExp): string[] {
    let text = this.getMsgText() || "";
    return text.match(re) || [];
  }

  isReplyable(dto: EventBase): dto is ReplyableEvent {
    return (<ReplyableEvent> dto).replyToken != undefined;
  }

}

type WebhookEventAll = {
  userSource? : User;
  groupSource? : Group;
  roomSource? : Room;
} & WebhookEvent;

type MessageEventAll = {
  textEventMessage?: TextEventMessage;
  imageEventMessage?: ImageEventMessage;
  videoEventMessage?: VideoEventMessage;
} & MessageEvent;



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