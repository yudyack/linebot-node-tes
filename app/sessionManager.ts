import { Pc } from "./pc";

export interface SessionBase {
  readonly name: string;
  act(pc: Pc): void;
}

class SessionManager<SessionAny extends SessionBase> {
  sessionMap: Map<string, SessionAny[]>;
  constructor() {
    this.sessionMap = new Map<string, SessionAny[]>(); 
  }

  addSession(chatId: string, userId: string, session: SessionAny) {
    let concat = this.ck(chatId, userId);
    let sessions = this.sessionMap.get(concat);
    if (!sessions) {
      let sessions = [session];
      this.sessionMap.set(concat, sessions);
    } else {
      sessions.push(session);
    }
  }

  deleteSession(chatId: string, userId: string, sessionName: SessionAny["name"]) {
    let concat = this.ck(chatId,userId);
    let sessions = this.sessionMap.get(concat);

    if (!sessions) {}
    else {
      sessions = sessions.filter((val) => {
        if (val.name != sessionName) {
          return true;
        } else {
          return false;
        }
      })
      this.sessionMap.set(concat, sessions);
    }
  }
  
  getSessions(chatId: string, userId: string): SessionAny[] | undefined {
    return this.sessionMap.get(this.ck(chatId, userId));
  }

  getSession(chatId: string, userId: string) {
    let sessions = this.getSessions(chatId, userId);
    if(sessions && sessions.length > 0) {
      return sessions[0];
    }
  }

  // concat chatId and userid for key
  ck(chatId: string, userId: string): string {
    return `${chatId}_${userId}`;
  }
}
export const sessionManager = new SessionManager();