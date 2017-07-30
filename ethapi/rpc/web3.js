// @flow

/*:: import type { ProviderInterface } from 'eth2providers/types' */

class Web3 {
  /*:: _provider: ProviderInterface */

  constructor (provider/*: ProviderInterface */) {
    this._provider = provider;
  }

  async clientVersion ()/*: Promise<string> */ {
    const clientId/*: string */ = await this._provider.sendPromise('web3_clientVersion', []);

    return clientId.split('/').filter((part) => part).join('/');
  }
}

module.exports = Web3;
