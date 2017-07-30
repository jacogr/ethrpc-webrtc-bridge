// @flow

const { toChecksumAddress } = require('ethereumjs-util');

const { hexToBN } = require('./bn');

/*:: type BlockHeadType = {
  author: string,
  blockNumber: BN,
  difficulty: BN,
  gasLimit: BN,
  gasUsed: BN,
  miner: string,
  size: BN,
  timestamp: Date
} */

function formatNewHeads (newHeads/*: { [string]: string } */)/*: BlockHeadType */ {
  return Object
    .keys(newHeads)
    .reduce((result, key) => {
      switch (key) {
        case 'author':
        case 'miner':
          result[key] = toChecksumAddress(newHeads[key]);
          break;

        case 'difficulty':
        case 'gasLimit':
        case 'gasUsed':
        case 'number':
        case 'size':
          result[key] = hexToBN(newHeads[key]);
          break;

        case 'timestamp':
          result[key] = new Date(hexToBN(newHeads[key]).toNumber() * 1000);
          break;

        default:
          result[key] = newHeads[key];
          break;
      }

      return result;
    }, {});
}

module.exports = {
  formatNewHeads
};
