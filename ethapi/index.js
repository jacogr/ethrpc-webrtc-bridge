// @flow

const initEth = require('./rpc/eth');
const initNet = require('./rpc/net');
const initWeb3 = require('./rpc/web3');

/*:: import type { ProviderInterface } from 'eth2providers/types' */

/*:: import { type EthRpcType } from './rpc/eth' */
/*:: import { type NetRpcType } from './rpc/net' */
/*:: import { type Web3RpcType } from './rpc/web3' */

/*:: type EthApiType = {
  eth: EthRpcType,
  net: NetRpcType,
  web3: Web3RpcType
} */

function init (provider/*: ProviderInterface */)/*: EthApiType */ {
  return {
    eth: initEth(provider),
    net: initNet(provider),
    web3: initWeb3(provider)
  };
}

module.exports = init;
