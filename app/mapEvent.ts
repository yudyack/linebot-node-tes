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
import { config } from "./util";

const client = new Client(<ClientConfig>config);

const replyText = (token: string, texts: string | any[]) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      token,
      texts.map((text) => ({ type: 'text', text }))
    );
};
  
  
function handleText(message: TextEventMessage, replyToken: string, source: string) : Promise<any> | null {return Promise.resolve()}
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
      switch(message) {
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