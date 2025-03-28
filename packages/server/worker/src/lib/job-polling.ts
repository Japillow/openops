import {
  QueueJob,
  QueueName,
  system,
  WorkerSystemProps,
} from '@openops/server-shared';
import { Semaphore } from 'async-mutex';
import { workerApiService } from './api/server-api.service';

const POLLING_POOL_SIZE = system.getNumberOrThrow(
  WorkerSystemProps.POLLING_POOL_SIZE,
);

const pollLocks = {
  [QueueName.ONE_TIME]: new Semaphore(POLLING_POOL_SIZE),
  [QueueName.SCHEDULED]: new Semaphore(POLLING_POOL_SIZE),
  [QueueName.WEBHOOK]: new Semaphore(POLLING_POOL_SIZE),
};

export const jobPoller = {
  poll: async (
    workerToken: string,
    queueName: QueueName,
  ): Promise<QueueJob | null> => {
    try {
      await acquireLockToPreventFloodingApp(queueName);
      const job = await workerApiService(workerToken).poll(queueName);
      return job;
    } finally {
      pollLocks[queueName].release(1);
    }
  },
};

async function acquireLockToPreventFloodingApp(
  queueName: QueueName,
): Promise<void> {
  await pollLocks[queueName].acquire(1);
}
