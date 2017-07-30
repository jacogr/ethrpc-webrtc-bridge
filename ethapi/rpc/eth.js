// @flow

const l = require('abc2logger')('Api:Eth');

const { formatBlockHeader } = require('../format/block');
const { hexToBN } = require('../format/bn');

/*:: import type { BlockHeaderType } from '../format/block' */
/*:: import type { ProviderInterface } from '../provider/types' */

/*:: type CallbackNewHeads = (header: BlockHeaderType) => void */

class Eth {
  /*:: _provider: ProviderInterface */
  /*:: _newHeadsCallbacks: Array<CallbackNewHeads> */

  constructor (provider/*: ProviderInterface */) {
    this._provider = provider;

    this._newHeadsCallbacks = [];
    this._onNewHeadsMessage = this._onNewHeadsMessage.bind(this);

    this._subscribeNewHeads();
  }

  _onNewHeadsMessage (error/*: Error */, header/*: { [string]: string } */) {
    if (error) {
      return;
    }

    const blockHeader/*: BlockHeaderType */ = formatBlockHeader(header);

    this._newHeadsCallbacks = this._newHeadsCallbacks.filter((callback) => {
      try {
        callback(blockHeader);
        return true;
      } catch (error) {
        l.warn('subscription callback', error);
        return false;
      }
    });
  }

  _subscribeNewHeads () {
    try {
      this._provider.subscribe('newHeads', [], this._onNewHeadsMessage);
    } catch (error) {
      l.warn('subscriptions disabled', error);
    }
  }

  async blockNumber ()/*: Promise<BN> */ {
    const blockNumber/*: string */ = await this._provider.sendPromise('eth_blockNumber', []);

    return hexToBN(blockNumber);
  }

  subscribeBlockHeader (callback/*: CallbackNewHeads */) {
    this._newHeadsCallbacks.push(callback);
  }

  subscribeBlockNumber (callback/*: (blockNumber: BN) => void */) {
    this._newHeadsCallbacks.push((header) => callback(header.number));
  }
}

module.exports = Eth;
