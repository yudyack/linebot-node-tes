import { client as $dbclient, config } from "./util";
import { Client, ClientConfig } from "@line/bot-sdk";
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
    let result = users? await users.find().toArray().catch(()=>{throw "fail when finding user"}) : null;
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

  export async function get(userId: string) {
    let user = repo.get(userId) || null;
    if (user === null) {
      let users = await getUsersClient();
      console.log("finding users");
      let result = users? await users.find({userId: userId}).toArray().catch(()=>{throw "fail when finding user"}): null;
      if (result == null ) {
        console.warn("can't get userClient");
      } else if (result != null && result.length == 0) {
        let userDoc = await getFromLine(userId);
        await insert(userDoc).catch(() => "fail insert");
      } else {
        user = result[0];
        console.log('user found', result);
      }
      // closeDbClient();
    }
    return user;
  }

  export async function getFromLine(userId: string) {
    return await client.getProfile(userId).catch((i)=> { console.warn(i); throw "error get data";});
  }

  async function insert(user: any) {
    let usersClient = await getUsersClient().catch(i=> console.warn("users client is null"));
    let result = usersClient? await usersClient.insert(user).catch(()=>{throw "error insert"}): null;
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

