// @flow

const { toChecksumAddress } = require('ethereumjs-util');

const { hexToBn } = require('./bn');

/*:: export type TransactionType = {
  blockNumber: BN,
  creates: ?string,
  from: string,
  gas: BN,
  gasPrice: BN,
  networkId: number,
  nonce: BN,
  to: string,
  value: BN
} */

function transactionOutput (tx/*: any */)/*: TransactionType */ {
  return Object
    .keys(tx)
    .reduce((result/*: TransactionType */, key/*: string */) => {
      switch (key) {
        case 'blockNumber':
        case 'gas':
        case 'gasPrice':
        case 'nonce':
        case 'value':
          result[key] = hexToBn(tx[key]);
          break;

        case 'creates':
        case 'from':
        case 'to':
          result[key] = tx[key]
            ? toChecksumAddress(tx[key])
            : tx[key];
          break;

        case 'networkId':
          result[key] = parseInt(tx[key], 10);
          break;

        default:
          result[key] = tx[key];
          break;
      }

      return result;
    }, ({}/*: $Shape<TransactionType> */));
}

module.exports = {
  transactionOutput
};
