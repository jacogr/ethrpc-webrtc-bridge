// @flow

const Eth = require('./eth');
const Web3 = require('./web3');

/*:: type ProviderInterface = {
  send: (method: string, params: Array<string>, callback: SendCallback) => void
} */

class EthApi {
  /*:: _provider: ProviderInterface */
  /*:: eth: Eth */
  /*:: web3: Web3 */

  constructor (provider/*: ProviderInterface */) {
    this._provider = provider;

    this._subscriptions = {};

    this.eth = new Eth(provider, this);
    this.web3 = new Web3(provider, this);
  }
}

module.exports = EthApi;
