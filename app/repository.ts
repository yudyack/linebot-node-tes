import { client as $dbclient, config } from "./util";
import { Client, ClientConfig, Profile } from "@line/bot-sdk";
import { Collection, MongoClient } from "mongodb";

export let _users = 0;
export const plus = function(num: number) {
  _users+=num;
}

//TODO: buat getAll untuk cache
// buat cache
// update chache
// buat periodik simpan database ? atau setiap update simpan database -> setiap update simpan karena resiko bisa ilang
// simpan cache lalu? dan? simpan database
// perlu cache? gimana kalau yang di tarik ribet? / perlu query?
// cache hanya untuk get?
// cache query?
// apa langsung cache query?
// gimana cara cache query mongodb? querynya bentuknya json
// buat dua satu cache user aja satu cache query <- mengurangin connection overhead


const client = new Client(<ClientConfig>config);
let dbClient: MongoClient | null = null;

async function getDbClient() {
  if (!dbClient || !dbClient.isConnected()) {
    dbClient = await $dbclient()
      .catch(i => {
        console.warn("error getting dbCline", i);
        return null;
      });
  }
  return dbClient;
}

export async function closeDbClient() {
  if(dbClient){
    dbClient.close();
    dbClient = null;
  }
}

export namespace User {
  
  let repo = new Map<string, any>();
  let usersClient: Collection<any> | null;

  init();

  async function init() {
    let users = await getUsersClient();
    let result = users? await users.find().toArray().catch(()=>{console.warn("fail when finding user")}) : null;
    if (result == null) {
      console.warn("cant' get userClient")
    } else if (result.length == 0) {
      console.warn("no users result")
    } else {
      result.forEach(i => {
        let userId = i.userId;
        repo.set(userId, i);
      });
    }
    // closeDbClient();
  }

  // TODO: need fix for case get from group or user
  export async function get(userId: string, groupId: string) {
    let user = repo.get(userId) || null;
    if (user === null) {
      let users = await getUsersClient();
      console.log("finding users");
      let result = users? await users.find({userId: userId}).toArray().catch(()=>{console.warn("fail when finding user")}): null;
      if (result == null ) {
        console.warn("can't get userClient");
      } else if (result != null && result.length == 0) {
        let userDoc = await getFromLine(userId).catch((i => null));
        userDoc = userDoc? userDoc : await getFromLine(userId, groupId).catch(i => null);
        await insert(userDoc).catch(() => {console.warn("fail insert")});
      } else {
        user = result[0];
        console.log('user found', result);
      }
      // closeDbClient();
    }
    return user;
  }

  export async function getFromLine(userId: string, groupId?: string) {
    console.log(`get user line: ${userId}`);
    let prom;
    if(!groupId) {
      prom = client.getProfile(userId);
    } else {
      prom = client.getRoomMemberProfile(userId, groupId);
    }
    let profile =  await prom.catch((i)=> { 
      console.warn(i); 
      // return null;
      console.warn("fail getprofile");
    });
    return profile;
  }

  async function insert(user: any) {
    let usersClient = await getUsersClient().catch(i=> console.warn("users client is null"));
    let result = usersClient? await usersClient.insert(user).catch(()=> console.warn("error insert")): null;
    if (result == null) {
      console.warn("insert fail")      
    } else {
      // save to cache
      let userId = user.userId;
      repo.set(userId, user);
    }
  }

  async function getUsersClient() {
    if(!usersClient) {
      let dbClient = await getDbClient().catch(i => console.warn("db client null", i));
      usersClient = dbClient? dbClient.db("sampledb").collection("user") : null;
    } 
    return usersClient;
  }
}

