// @flow

const { attachCall } = require('./call');
const { numberOutput } = require('../format/number');

/*:: import type { ProviderInterface } from 'eth2providers/types' */

/*:: export type NetRpcType = {
  version: () => Promise<number>
} */

function init (provider/*: ProviderInterface */)/*: NetRpcType */ {
  return {
    version: attachCall(provider, {
      method: 'net_version',
      output: numberOutput
    })
  };
}

module.exports = init;
