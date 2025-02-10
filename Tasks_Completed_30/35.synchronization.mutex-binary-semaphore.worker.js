//? Use 33.synchronization.js file to test this.

import { workerData, threadId, parentPort } from "node:worker_threads";

const sharedArray = new Uint32Array(workerData.data);
const lock = new Int32Array(workerData.lock);

const count = 10_000_000;

for (let i = 0; i < count; i++) {
  //## => sharedArray[0] = sharedArray[0] + 1;  // With Race condtion

  //## Eliminating race condition by using Atomics.

  //## We have only simple operations in Atomics.
  //## => Atomics.add(sharedArray, 0, 1); // No Race Conditions with Atomics, Atomic and Isolated(Mutually Exclusive).

  //*********************************/
  //## Using Mutual Exclusion Techniques
  //******* Mutex / Binary Semaphore  *******/

  // Isolating the critical section using Mutual Exclusion => Mutex/Binary Semaphore.
  mutexLock(lock);
  // critical section.
  // doing update operation on shared resource.
  sharedArray[0] = sharedArray[0] + 1;
  // unlock
  unLockAndNotify(lock);
}

function mutexLock(lock) {
  const typedArrayInt32 = lock;
  const index = 0;
  const compareValue = 0;
  const exchangeValue = 1;

  // Exchange only if comparision satisfies.
  while (
    Atomics.compareExchange(
      typedArrayInt32,
      index,
      compareValue,
      exchangeValue
    ) === 1
  ) {
    // Suspend the while loop by moving the thread to sleeping/wait Queue ,
    // instead of simply executing the while loop while other threads are accessing the critical section/shared resources.
    // Notify once ready to continue i.e when other threads unlocks and notifies.
    // Atomics.wait and Atomics.notify() uses OS CPU inturrupts behind the scenes.
    Atomics.wait(typedArrayInt32, index);
  }
}

function unLockAndNotify(lock) {
  const typedArrayInt32 = lock;
  const index = 0;
  const storeValue = 0; // unlock
  const no_threads_to_notify = 1;

  Atomics.store(typedArrayInt32, index, storeValue);
  Atomics.notify(typedArrayInt32, index, no_threads_to_notify); // notify a thread to continue the execution from where it stopped.
}
