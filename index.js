// @flow

const logger = require('eth2logger');
const cluster = require('cluster');
const WsProvider = require('eth2providers/ws');
const os = require('os');
const yargs = require('yargs');

const EthApi = require('./ethapi');

/*:: type ArgvType = {
  color: boolean,
  rpcHost: string,
  rpcPort: number,
  rtcPort: number,
  spawn: boolean,
  workersPerCpu: number
} */

const ARGV_DEFAULTS = ({
  color: true,
  rpcHost: '127.0.0.1',
  rpcPort: 8546,
  rtcPort: 36363,
  spawn: false,
  workersPerCpu: 1
}/*: ArgvType */);

const argv/*: ArgvType */ = yargs.default(ARGV_DEFAULTS).argv;

function initMaster () {
  const l = logger('Master');

  if (argv.spawn) {
    l.log('initialising');

    const numCpus/*: number */ = os.cpus().length;
    const processes/*: number */ = numCpus * argv.workersPerCpu;

    for (let i/*: number */ = 0; i < processes; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker/*: ClusterWorker */, code/*: number */, signal/*: string */) => {
      l.log('process died', worker.process.pid);

      cluster.fork();
    });

    l.ok('started');
  } else {
    initWorker('Process');
  }
}

function initWorker (type/*: string */) {
  const l = logger(type);

  // l.log(clientId);
  l.log('initialising');

  const api = new EthApi(
    new WsProvider({
      host: argv.rpcHost,
      port: argv.rpcPort
    })
  );

  api.web3.clientVersion()
    .then((version) => console.log('version', version))
    .catch((error) => console.error('version', error));

  api.eth.subscribeBlock(console.log);

  l.ok('started');
}

if (cluster.isMaster) {
  initMaster();
} else {
  initWorker('Worker');
}
