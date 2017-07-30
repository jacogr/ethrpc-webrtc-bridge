// @flow

const { formatNewHeads } = require('./format/block');
const { hexToBN } = require('./format/bn');

/*:: import type { BlockHeadType } from './format/block' */

class Eth {
  constructor (provider) {
    this._provider = provider;
  }

  async blockNumber ()/*: Promise<BN> */ {
    const blockNumber/*: string */ = await this._provider.sendPromise('eth_blockNumber', []);

    return hexToBN(blockNumber);
  }

  async subscribeBlockNumber (callback/*: (blockNumber: BN) => void */)/*: Promise<string> */ {
    return this._provider.subscribe('newHeads', [], (error, newHeads) => {
      if (!error) {
        callback(hexToBN(newHeads.number));
      }
    });
  }

  async subscribeNewHeads (callback/*: (block: BlockHeadType) => void */)/*: Promise<string> */ {
    return this._provider.subscribe('newHeads', [], (error, newHeads) => {
      if (!error) {
        callback(formatNewHeads(newHeads));
      }
    });
  }
}

module.exports = Eth;
