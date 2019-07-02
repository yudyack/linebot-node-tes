// TODO: need to add argument PC Ithink in Event
export class StateMachine<S> {
  writer = new Writer<S>();
  current: S;
  end: S[];
  other: S;
  constructor(start:S, end:S[], other: S){
    this.current = start;
    this.end = end;
    this.other = other;
  }
  set(inState: S, stateEvent: () => void, write: (w:Writer<S>) => void) {
    this.writer.inState = inState;
    write(this.writer);
    this.writer.stateEventMap.set(this.writer.inState, stateEvent);
    this.writer.inState = undefined;
  }

  go(input: string): Promise<boolean> {

    let event = this.getEvent(this.current);
    if(event) {
      event();
    } else {
      console.log("no state found")
    }
    let nextState = this.getNext(input);
    
    if(nextState !== undefined) {
      this.current = nextState;
    } else {
      this.current = this.other;
    }

    if(this.isThisEnd(this.current)) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  getEvent(state: S) {
    return this.writer.stateEventMap.get(state);
  }
  getNext(input: string) {
    let _map = this.writer.inputStateToStateMap.get(this.current);
    if(_map === undefined) {
      console.log("state not found")
    } else {
      let _state = _map.get(input);
      if(_state === undefined) {
        console.log("no input found")
      } else {
        return _state
      }
    }
  }

  getCurrentState() {
    return this.current;
  }

  isThisEnd(theState: S) {
    return this.end.includes(theState)
  }

  /**
   * clone writer and StateMachine but reference same maps and state
   */
  clone() {
    let _writer = new Writer<S>();
    let _sm = new StateMachine<S>(this.current, this.end, this.other);

    _writer.inputStateToStateMap = this.writer.inputStateToStateMap;
    _writer.stateEventMap = this.writer.stateEventMap;
    _sm.writer = _writer;

    return _sm;
  }
}

class Writer<S> {
  // inputCallbackMap = new Map<S, Map<string, any>>();
  inputStateToStateMap = new Map<S, Map<string, S>>();
  stateEventMap = new Map<S, () => void >();
  inState?: S;
  goif(input: string, to: S, callback: any) {
    if(this.inState === undefined) throw "state haven't set yet"
    let stringStateMap = this.inputStateToStateMap.get(this.inState);
    if (stringStateMap) {
      stringStateMap.set(input, to);
    } else {
      let _inputStateMap = new Map<string, S>();
      _inputStateMap.set(input, to);
      this.inputStateToStateMap.set(this.inState, _inputStateMap);
    }
  }
}

enum States {
  One = "one",
  Two = "two",
  Three = "three"
}
enum Inputs {
  one = "one",
  two = "two"
}

let sm = new StateMachine<States>(States.One, [States.Three], States.One);
sm.set(States.One, () => {
  console.log("in state one")
}, (w) => {
  w.goif("1", States.Two, () => { })
  w.goif("something not on the list", States.Three, { });
})

sm.set(States.Two, () => {
  console.log("in state two")
}, (w) => {
  w.goif("2", States.Three, () => { })
})

sm.set(States.Three, () => {
  console.log("in state three")
}, (w) => {
  w.goif("1", States.One, () => {})
})
let sm1 = sm.clone();

sm.go("1");
sm.go("1");
sm.go("2");
console.log(sm.current);

console.log(sm1);
sm1.go("something not on the list");
sm1.go("done");


////////////////////////////////
// interface StatefulSession {
//   endState: State;
//   inputs: any;
// }

// class PlainSession implements Session {
//   name:string;
//   constructor(name: string) {
//     this.name = name;
//   }
//   act(){}
// }

// enum inputs {
//   one = "1",
//   two = "2"
// }

// enum states {
// }

// class GroupBetting implements Session, StatefulSession {
//   members:any;
//   name = "groupBetting";
//   endState: State;
//   currentState: State;
//   lastState: any;

//   constructor() {
//     this.currentState = new StateOne();
//     this.endState = new StateTwo();
//     this.inputs = "-1";
//   }
 
//   act(chatId: string, userId: string, pc: Pc) {
//     this.currentState = this.currentState.go(this, this.inputs);

//     if (this.currentState.stateName == this.endState.stateName){

//     }
//   }
// }

// interface State { 
//   stateName: string;
//   go(statefulEvent: StatefulSession, inputs: string): State;
// }


// class StateOne implements State {
//   stateName = "state one";
//   go(groupBetting: GroupBetting, inputs: string){
//     return new StateTwo();
//   }
//   join(identifier: any, betAmount: any) {
//     // add member to members
//   }
// }

// class StateTwo implements State {
//   stateName = "state two";
//   go(groupBetting: GroupBetting, inputs: string) {
//     return this;
//   }
// }



// let a_session = new PlainSession("a");
// sessionManager.addSession("1", "2", a_session);
// sessionManager.addSession("a", "b", a_session);
// sessionManager.addSession("c", "d", a_session);
// sessionManager.deleteSession("a", "b", "a");
// sessionManager.deleteSession("1", "2", "a");
// sessionManager.deleteSession("c", "d", "a");
// console.log(sessionManager)

// let arr = [1,2,3,4,5,6];

// arr = arr.filter((val, index, arr) => {
//   if(val != 3) return true;
// })
// console.log(arr);