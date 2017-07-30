// @flow

const { toChecksumAddress } = require('ethereumjs-util');

const { hexToBN } = require('./bn');

/*:: export type BlockHeaderType = {
  author: string,
  blockNumber: BN,
  difficulty: BN,
  gasLimit: BN,
  gasUsed: BN,
  miner: string,
  size: BN,
  timestamp: Date
} */

function formatBlockHeader (header/*: { [string]: string } */)/*: BlockHeaderType */ {
  return Object
    .keys(header)
    .reduce((result, key) => {
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
          result[key] = hexToBN(header[key]);
          break;

        case 'timestamp':
          result[key] = new Date(hexToBN(header[key]).toNumber() * 1000);
          break;

        default:
          result[key] = header[key];
          break;
      }

      return result;
    }, {});
}

module.exports = {
  formatBlockHeader
};
