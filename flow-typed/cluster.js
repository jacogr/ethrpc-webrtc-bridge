// @flow

declare type ClusterWorker = {
  process: {
    pid: number
  }
};

declare type ClusterEventTypes = 'exit';
declare type ClusterEventExit = (worker: ClusterWorker, code: number, signal: string) => void;

declare module 'cluster' {
  declare module.exports: {
    isMaster: boolean,
    isWorker: boolean,
    fork: () => void,
    on: (event: ClusterEventTypes, callback: ClusterEventExit) => void
  }
}
