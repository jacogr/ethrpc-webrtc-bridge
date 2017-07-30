// @flow

const { formatBlockHeader } = require('./format/block');
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

  async subscribeBlockHeader (callback/*: (header: BlockHeaderType) => void */)/*: Promise<string> */ {
    return this._provider.subscribe('newHeads', [], (error, header) => {
      if (!error) {
        callback(formatBlockHeader(header));
      }
    });
  }

  async subscribeBlockNumber (callback/*: (blockNumber: BN) => void */)/*: Promise<string> */ {
    return this._provider.subscribe('newHeads', [], (error, header) => {
      if (!error) {
        callback(hexToBN(header.number));
      }
    });
  }
}

module.exports = Eth;
