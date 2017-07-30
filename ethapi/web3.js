// @flow

class Web3 {
  constructor (provider/*: ProviderInterface */) {
    this._provider = provider;
  }

  async clientVersion ()/*: Promise<string> */ {
    const clientId/*: string */ = await this._provider.sendPromise('web3_clientVersion', []);

    return clientId.split('/').filter((part) => part).join('/');
  }
}

module.exports = Web3;
