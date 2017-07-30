// @flow

const Eth = require('./rpc/eth');
const Web3 = require('./rpc/web3');

/*:: import type { ProviderInterface } from 'eth2providers/types' */

class EthApi {
  /*:: _provider: ProviderInterface */
  /*:: eth: Eth */
  /*:: web3: Web3 */

  constructor (provider/*: ProviderInterface */) {
    this._provider = provider;

    this.eth = new Eth(provider);
    this.web3 = new Web3(provider);
  }
}

module.exports = EthApi;
