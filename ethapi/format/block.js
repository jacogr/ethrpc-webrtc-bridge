// @flow

const { BN, toChecksumAddress } = require('ethereumjs-util');

const { bnToHex, hexToBn } = require('./bn');
const { transactionOutput } = require('./transaction');

/*:: import type { TransactionType } from './transaction' */

/*:: export type BlockHeaderType = {
  author: string,
  difficulty: BN,
  gasLimit: BN,
  gasUsed: BN,
  miner: string,
  number: BN,
  size: BN,
  timestamp: Date
} */

/*:: export type BlockType = BlockHeaderType & {
  totalDifficulty: BN,
  transactions: Array<TransactionType>
} */

function blockOutput (block/*: any */)/*: BlockType */ {
  return Object
    .keys(block)
    .reduce((result/*: BlockType */, key/*: string */) => {
      switch (key) {
        case 'totalDifficulty':
          result[key] = hexToBn(block[key]);
          break;

        case 'transactions':
          result[key] = ((block[key]/*: any */)/*: Array<any> */).map(transactionOutput);
          break;

        default:
          result[key] = result[key] || block[key];
          break;
      }

      return result;
    }, (blockHeaderOutput(block)/*: $Shape<BlockType> */));
}

function blockHeaderOutput (header/*: any */)/*: BlockHeaderType */ {
  return Object
    .keys(header)
    .reduce((result/*: BlockHeaderType */, key/*: string */) => {
      switch (key) {
        case 'author':
        case 'miner':
          result[key] = toChecksumAddress(header[key]);
          break;

        case 'difficulty':
        case 'gasLimit':
        case 'gasUsed':
        case 'number':
        case 'size':
          result[key] = hexToBn(header[key]);
          break;

        case 'timestamp':
          result[key] = new Date(hexToBn(header[key]).toNumber() * 1000);
          break;

        default:
          result[key] = result[key] || header[key];
          break;
      }

      return result;
    }, ({}/*: $Shape<BlockHeaderType> */));
}

function blockNumberInput (blockNumber/*: string | number | BN */)/*: string */ {
  if (['earliest', 'latest', 'pending'].includes(blockNumber)) {
    return ((blockNumber/*: any */)/*: string */);
  }

  if (BN.isBN(blockNumber)) {
    return bnToHex(((blockNumber/*: any */)/*: BN */));
  }

  return bnToHex(new BN(blockNumber));
}

module.exports = {
  blockOutput,
  blockHeaderOutput,
  blockNumberInput
};
