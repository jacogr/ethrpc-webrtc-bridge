// @flow

const { attachCall } = require('./call');

/*:: import type { ProviderInterface } from 'eth2providers/types' */

/*:: export type Web3RpcType = {
  clientVersion: () => Promise<string>
} */

function clientVersionOutput (version/*: string */)/*: string */ {
  return version.split('/').filter((part) => part).join('/');
}

function init (provider/*: ProviderInterface */)/*: Web3RpcType */ {
  return {
    clientVersion: attachCall(provider, {
      method: 'web3_clientVersion',
      output: clientVersionOutput
    })
  };
}

module.exports = init;
