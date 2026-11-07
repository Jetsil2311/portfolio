/// <reference lib="webworker" />
// CODEHER's real pseudocode worker: everything in this folder except core.ts is
// its packages/grader/src/pseudo, copied unchanged apart from that one import.
import { createPseudoWorkerHandler, type PseudoWorkerRequest } from "./worker-handler";

const handle = createPseudoWorkerHandler((msg) => (self as unknown as DedicatedWorkerGlobalScope).postMessage(msg));
self.onmessage = (ev: MessageEvent<PseudoWorkerRequest>) => handle(ev.data);
