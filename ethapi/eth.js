// @flow

const { formatNewHeads } = require('./format/block');
const { hexToBN } = require('./format/bn');

class Eth {
  constructor (provider) {
    this._provider = provider;
  }

  async blockNumber ()/*: Promise<BN> */ {
    const blockNumber/*: string */ = await this._provider.sendPromise('eth_blockNumber', []);

    return hexToBN(blockNumber);
  }

  async subscribeBlockNumber (callback/*: (error: Error, blockNumber: BN) => void */)/*: Promise<string> */ {
    return this._provider.subscribe('newHeads', [], (error, newHeads) => {
      if (error) {
        callback(error);
      } else {
        callback(null, hexToBN(newHeads.number));
      }
    });
  }

  async subscribeNewHeads (callback/*: (error: Error, block: any) => void */)/*: Promise<string> */ {
    return this._provider.subscribe('newHeads', [], (error, newHeads) => {
      if (error) {
        callback(error);
      } else {
        callback(null, formatNewHeads(newHeads));
      }
    });
  }
}

module.exports = Eth;
