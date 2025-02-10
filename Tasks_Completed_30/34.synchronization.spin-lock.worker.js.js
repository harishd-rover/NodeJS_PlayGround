import { workerData, threadId, parentPort } from "node:worker_threads";

const sharedArray = new Uint32Array(workerData.data);
const lock = new Uint8Array(workerData.lock);

const count = 10_000_000;

for (let i = 0; i < count; i++) {
  //## => sharedArray[0] = sharedArray[0] + 1;  // With Race condtion.

  //## Eliminating race condition by using Atomics.
  //## We have only simple operations in Atomics.
  //## => Atomics.add(sharedArray, 0, 1); // No Race Conditions with Atomics, Atomic and Isolated(Mutually Exclusive).

  //*********************************/
  //## Using Mutual Exclusion Techniques
  //******* SpinLock  *******/

  // Isolating the critical section using Mutual Exclusion => SpinLock.
  spinLock(lock);
  // critical section.
  // doing update operation on shared resource.
  sharedArray[0] = sharedArray[0] + 1;
  unLock(lock);
}

function spinLock(lock) {
  const typedArray = lock;
  const index = 0;
  const compareValue = 0;
  const exchangeValue = 1;

  // Exchange only if comparision satisfies.

  // Loops uses 100% CPU usage in all Locked Threads.
  // So SpinLock is not an efficient method.
  while (
    Atomics.compareExchange(typedArray, index, compareValue, exchangeValue) ===
    1
  ) {}
}

function unLock(lock) {
  const typedArray = lock;
  const index = 0;
  const storeValue = 0;
  Atomics.store(typedArray, index, storeValue);
}
