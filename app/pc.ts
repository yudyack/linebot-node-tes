import { 
  EventBase,
  WebhookEvent,
  ReplyableEvent,
  FollowEvent,
  UnfollowEvent,
  JoinEvent,
  LeaveEvent,
  MemberJoinEvent,
  MemberLeaveEvent,
  PostbackEvent,
  TextEventMessage,
  EventMessage,
  User,
  Group,
  Room,
  ImageEventMessage,
  VideoEventMessage, 
  MessageEvent,
  EventSource
} from "@line/bot-sdk";


export let processes: Process[] = [
  // first,
  // second,
  // getUser,
  // calc,
  // mintaId,
  // testing

]

export interface Process{(dto:any) : Promise<any>;};

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
  eventSource: EventSource;



  
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
    this.eventSource = dto.source;
    this.mapEvent(this.webhookEventAll, this);
    // this.mapEventSource(this.webhookEvent.source, this.webhookEvent);
  }

  mapEvent(webhookEventAll: WebhookEventAll, pc: Pc) {
    // let eventMessage = (<MessageEvent>webhookEvent).message;
    switch (webhookEventAll.type) {
      case "message":
        pc.messageEventAll = webhookEventAll;
        this.mapEventSource(webhookEventAll);
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

  mapEventSource(webhookEventAll: WebhookEventAll) {
    let eventSource = webhookEventAll.source;
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

  getMatchesTextLowerCase(re: RegExp): string[] {
    let text = this.getMsgText() || "";
    return text.toLowerCase().match(re) || [];
  }

  isReplyable(dto: EventBase): dto is ReplyableEvent {
    return (<ReplyableEvent> dto).replyToken != undefined;
  }

  getSourceOrgId() {
    switch (this.eventSource.type) {
      case "user":
        return this.eventSource.userId;
      case "group":
        return this.eventSource.groupId;
      case "room":
        return this.eventSource.roomId;
    }
  }

  getSourceUserId() {
    switch (this.eventSource.type) {
      case "user":
        return this.eventSource.userId;
      case "group":
        return this.eventSource.userId;
      case "room":
        return this.eventSource.userId;
    }
  }
  stop(){
    this.signal.stop = true;
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