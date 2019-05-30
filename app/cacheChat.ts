import { Pc } from "./pc";
import { EventSource } from "@line/bot-sdk";

export const cacheMapPcs = new Map<EventSource["type"], Map<string, Pc[]>>();

export function addpc(pc: Pc) {
  let sourceType = pc.eventSource.type;
  let id = pc.getSourceOrgId();
  let idMap = cacheMapPcs.get(sourceType);
  if (!idMap) {
    let _idMap = new Map<string, Pc[]>();
    _idMap.set(id, [pc]);
    cacheMapPcs.set(sourceType, _idMap);
  } 
  else {
    let pcs = idMap.get(id);
    if(!pcs) {
      idMap.set(id, [pc])
    } else {
      pcs.push(pc);
    }
  }
}

export function getLastCachePc(nowPc: Pc): Pc | undefined {
  let cachePc = getOrUndefined(nowPc);
  if (!cachePc) return undefined;

  let lastPc = cachePc.slice(-1)[0];
  return lastPc;
}

export function getIndexCachePc(nowPc: Pc, index: number): Pc | undefined {
  let cachePc = getOrUndefined(nowPc);
  if (!cachePc) return undefined;

  index = Math.floor(index);
  if (index > 0) {
    return cachePc[index];
  } else {
    return cachePc[cachePc.length + index];
  }
}

export function getLastIndexCachePc(nowPc: Pc, lastIndex: number): Pc | undefined {
  let cachePc = getOrUndefined(nowPc);
  if (!cachePc) return undefined;

  lastIndex = Math.floor(lastIndex);
  if (lastIndex > 0) {
    return cachePc[cachePc.length - lastIndex];
  } else {
    return cachePc[lastIndex*(-1)];
  }
}

function getOrUndefined(pc: Pc): Pc[] | undefined{
  let idMap = cacheMapPcs.get(pc.eventSource.type);
  if (!idMap) return undefined;

  let pcs = idMap.get(pc.getSourceOrgId());
  if (!pcs) return undefined;

  return pcs;

}