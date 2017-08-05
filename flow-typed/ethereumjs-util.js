// @flow

import BN from './bn.js';

declare module 'ethereumjs-util' {
  declare module.exports: {
    BN: typeof BN,

    toChecksumAddress: (address: string) => string
  }
}
