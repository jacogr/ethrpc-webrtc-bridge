// @flow

const l = require('eth2logger')('Api:Eth');

const { attachCall } = require('./call');
const { blockOutput, blockHeaderOutput, blockNumberInput } = require('../format/block');
const { booleanInput } = require('../format/boolean');
const { hexToBn } = require('../format/bn');

/*:: import type { ProviderInterface } from 'eth2providers/types' */
/*:: import type { BlockType, BlockHeaderType } from '../format/block' */

/*:: type CallbackNewBlocks = (block: BlockType) => void */
/*:: type CallbackNewHeads = (header: BlockHeaderType) => void */

/*:: type EthSubscriptionType = {
  subscribeBlock: (callback: CallbackNewBlocks) => void,
  subscribeBlockHeader: (callback: CallbackNewHeads) => void,
  subscribeBlockNumber: (callback: (blockNumber: BN) => void) => void
} */

/*:: export type EthRpcType = EthSubscriptionType & {
  blockNumber: () => Promise<BN>,
  getBlockByNumber: (blockNumber: ?string, full?: boolean) => Promise<BlockType>,
} */

function initSubscriptions (provider/*: ProviderInterface */)/*: EthSubscriptionType */ {
  let newBlocksCallbacks/*: Array<CallbackNewBlocks> */ = [];
  let newHeadsCallbacks/*: Array<CallbackNewHeads> */ = [];

  try {
    provider.subscribe('newHeads', [], (error/*: ?Error */, header/*?: string | { [string]: string } */)/*: void */ => {
      if (error || !header) {
        return;
      }

      const blockHeader/*: BlockHeaderType */ = blockHeaderOutput(header);

      newHeadsCallbacks = newHeadsCallbacks.filter((callback/*: CallbackNewHeads */) => {
        try {
          callback(blockHeader);
          return true;
        } catch (error) {
          l.warn('subscription callback', error);
        }

        return false;
      });

      provider
        .sendPromise('eth_getBlockByNumber', [blockNumberInput(blockHeader.number), true])
        .then((block) => {
          const fullBlock = blockOutput(((block/*: any */)/*: { [string]: string } */));

          newBlocksCallbacks = newBlocksCallbacks.filter((callback/*: CallbackNewBlocks */) => {
            try {
              callback(fullBlock);
              return true;
            } catch (error) {
              l.warn('subscription callback', error);
            }

            return false;
          });
        });
    });
  } catch (error) {
    l.warn('subscriptions disabled', error);
  }

  return {
    subscribeBlock: (callback/*: CallbackNewBlocks */)/*: void */ => {
      newBlocksCallbacks.push(callback);
    },
    subscribeBlockHeader: (callback/*: CallbackNewHeads */)/*: void */ => {
      newHeadsCallbacks.push(callback);
    },
    subscribeBlockNumber: (callback/*: (blockNumber: BN) => void */)/*: void */ => {
      newHeadsCallbacks.push((header) => callback(header.number));
    }
  };
}

function init (provider/*: ProviderInterface */)/*: EthRpcType */ {
  return Object.assign({}, initSubscriptions(provider), {
    blockNumber: attachCall(provider, {
      method: 'eth_blockNumber',
      output: hexToBn
    }),
    getBlockByNumber: attachCall(provider, {
      method: 'eth_getBlockByNumber',
      defaults: ['latest', false],
      inputs: [blockNumberInput, booleanInput],
      output: blockOutput
    })
  });
}

module.exports = init;
