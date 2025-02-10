//? Use 33.synchronization.js file to test this.

//# DeadLock
//## Dead Lock is a situation, when Threads Mutually Waiting for each other to get Unlock and End-up in Infinite Waiting condition. They won't wake up at all.

//## When we have enbled Synchronization and Isolated the Critical Sections/Shared Resources in multi-threaded environmant at some point bcz of Improper Synchronization and Mutual Exclusion or bcz of some un-certain situations, some threads might fails to unlock other threads some threads end-up in infinite waiting condition.

//* Solution:  always try to unlock the threads in any uncertain situations,
//* Properly check, Lock and unlock orders, when we are dealing with multiple shared resources and multiple locks/semaphores.

import { workerData, threadId, parentPort } from "node:worker_threads";

const sharedArray = new Uint32Array(workerData.data);
const lock = new Int32Array(workerData.lock);

const count = 10_000_000;

for (let i = 0; i < count; i++) {
  try {
    mutexLock(lock); // lock others

    sharedArray[0] = sharedArray[0] + 1; // access critical section.

    if (i === 5_000_000) {
      throw new Error("Hey!!! I caused the Dead Lock");
    }

    // unLockAndNotify(lock); // unlock next thread
  } catch (error) {
    console.log(error.message); // got an error in thread
    console.log("Still unlocking the Thread in finally block");
  } finally {
    unLockAndNotify(lock); // unlocking in finally to handle dead-lock.
  }
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
