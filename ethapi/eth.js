// @flow

const { formatBlockHeader } = require('./format/block');
const { hexToBN } = require('./format/bn');

/*:: import type { BlockHeaderType } from './format/block' */

/*:: type CallbackNewHeads = (header: BlockHeaderType) => void */

class Eth {
  /*:: _newHeadsCallbacks: Array<CallbackNewHeads> */

  constructor (provider) {
    this._provider = provider;

    this._newHeadsCallbacks = [];

    this._subscribeNewHeads();
  }

  _subscribeNewHeads () {
    this._provider.subscribe('newHeads', [], (error, header) => {
      if (error) {
        return;
      }

      const blockHeader/*: BlockHeaderType */ = formatBlockHeader(header);

      this._newHeadsCallbacks = this._newHeadsCallbacks.filter((callback) => {
        try {
          callback(blockHeader);
          return true;
        } catch (error) {
          return false;
        }
      });
    });
  }

  async blockNumber ()/*: Promise<BN> */ {
    const blockNumber/*: string */ = await this._provider.sendPromise('eth_blockNumber', []);

    return hexToBN(blockNumber);
  }

  subscribeBlockHeader (callback/*: CallbackNewHeads */)/*: Promise<string> */ {
    this._newHeadsCallbacks.push(callback);
  }

  subscribeBlockNumber (callback/*: (blockNumber: BN) => void */)/*: Promise<string> */ {
    this._newHeadsCallbacks.push((header) => callback(header.number));
  }
}

module.exports = Eth;
