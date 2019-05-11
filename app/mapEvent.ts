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

export const handle = chaining();

const client = new Client(<ClientConfig>config);
const cache = {};

const replyText = (token: string, texts: string | any[]) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      token,
      texts.map((text) => ({ type: 'text', text }))
    );
};



  
function handleTextQ(message: TextEventMessage, replyToken: string, source: string) : Promise<any> | null {return Promise.resolve()}
function handleImage(message: ImageEventMessage, replyToken:string) : Promise<any> | null {return Promise.resolve()}
function handleVideo(message: VideoEventMessage, replyToken:string) : Promise<any> | null {return Promise.resolve()}
function handleAudio(message: AudioEventMessage, replyToken:string) : Promise<any> | null {return Promise.resolve()}
function handleLocation(message: LocationEventMessage, replyToken:string) : Promise<any> | null {return Promise.resolve()}
function handleSticker(message: StickerEventMessage, replyToken:string) : Promise<any> | null {return Promise.resolve()}

export function handleEvent(event: any) {
  if ((event).replyToken && (event).replyToken.match(/^(.)\1*$/)) {
    return console.log("Test hook recieved: " + JSON.stringify(event.message));
  }

  switch (event.type) {
    case 'message':
      const message = event.message;
      switch(message.type) {
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
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }

}

function handleText(message:any, replyToken:any, source:any) {
  const buttonsImageURL = `https://${hostname}/static/buttons/1040.jpg`;
  // const buttonsImageURL = "https://i.imgur.com/3hrYrON.jpg"
  console.log(buttonsImageURL);

  switch (message.text) {
    case 'profile':
      if (source.userId) {
        return client.getProfile(source.userId)
          .then((profile) => replyText(
            replyToken,
            [
              `Display name: ${profile.displayName}`,
              `Status message: ${profile.statusMessage}`,
            ]
          ));
      } else {
        return replyText(replyToken, 'Bot can\'t use profile API without user ID');
      }
    case 'buttons':
      return client.replyMessage(
        replyToken,
        {
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
        }
      );
    case 'confirm':
      return client.replyMessage(
        replyToken,
        {
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
        }
      )
    case 'carousel':
      return client.replyMessage(
        replyToken,
        {
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
        }
      );
    case 'image carousel':
      return client.replyMessage(
        replyToken,
        <any> {
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
        }
      );
    case 'datetime':
      return client.replyMessage(
        replyToken,
        {
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
        }
      );
    case 'imagemap':
      return client.replyMessage(
        replyToken,
        {
          type: 'imagemap',
          baseUrl: `${__dirname}/static/rich`,
          altText: 'Imagemap alt text',
          baseSize: { width: 1040, height: 1040 },
          actions: [
            { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
            { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
            { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
            { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
          ],
          video: {
            originalContentUrl: `${__dirname}/static/imagemap/video.mp4`,
            previewImageUrl: `${__dirname}/static/imagemap/preview.jpg`,
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
        }
      );
    case 'bye':
      switch (source.type) {
        case 'user':
          return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
        case 'group':
          return replyText(replyToken, 'Leaving group')
            .then(() => client.leaveGroup(source.groupId));
        case 'room':
          return replyText(replyToken, 'Leaving room')
            .then(() => client.leaveRoom(source.roomId));
      }
    default:
      // console.log(`Echo message to ${replyToken}: ${message.text}`);
      // return replyText(replyToken, message.text);
      return null;
  }
}


async function first(pc: Pc): Promise<Pc>{
  console.log('1');
  let arr = [1];
  pc.test = arr;
  // pc['signal'] = {stop:true};
  // pc.put(2, second);
  return pc;
}

async function second(pc: Pc): Promise<Pc> {
  if (!/.*/.test(pc.dto.type)) return pc;
  console.log('2');
  pc.test.push(2);
  return pc;
}

async function getUser(pc: Pc): Promise<Pc> {
  console.log(3);
  let dbclient = await $dbclient();
  let userId = pc.dto.source.userId;
  let users = dbclient.db("sampledb").collection("user");
  console.log("finding users");
  let result = await users.find(userId).toArray().catch(()=>{throw "fail when finding user"});
  if (result.length == 0) {
    let userDoc = await client.getProfile(userId).catch(()=> {throw "error get data"});
    let result = await users.insert(userDoc).catch(()=>{throw "error insert"});
  } else {
    console.log('user found', result);
  }
  dbclient.close();
  return pc;
}

async function calc(pc: Pc): Promise<Pc> {
  // if(!/.*/.test(pc.dto.type))
  return pc;
}

async function mintaId(pc: Pc): Promise<Pc> {
  let msg = pc.dto.message.text.toLowerCase;
  if (!(/^minta id$/).test(msg)) {

    let replyToken = pc.dto.replyToken;
    // pc.addReplyMessage("testing");
    pc.addReplyMessage(pc.dto.source.userId);
    // replyText(replyToken, "testing");
    // replyText(replyToken, "testing");
  }

  return pc;
}


const processes: Process[] = [
  first,
  second,
  getUser,
  calc,
  mintaId

]

let counter = 0;
export function chaining() : Function {
  counter+=1;
  return async function run(dto: any) {
    console.log("counter: " + counter);
    let pc: Pc = new Pc(dto);
    console.log(dto);
    for (const process of processes) {
      pc.prepare(process);
      pc = await process(pc);
      if (pc.signal.stop) break;
    }
    // TODO:
    // adding return
    // validating message to sent
    // harus ngirim di setiap process atau dikumpulin baru kirim?

    let simple_text_messages = pc.replyMessages.slice(0,4);
    // console.log(simple_text_messages);
    return replyText(pc.dto.replyToken, simple_text_messages);
  }
}


interface Process{(dto:any) : Promise<any>;};

class Pc {
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
  
  prepare (process: Process): void {
    this.processes = processes;
    this.now = {
      idx: ++this.idx,
      name: process.name
    }
    this.processHistory.push(process);
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