// @flow

const { BN } = require('ethereumjs-util');

function hexToBn (_hex/*: string */)/*: BN */ {
  const hex/*: string */ = _hex.substr(0, 2) === '0x'
    ? _hex.substr(2)
    : _hex;

  return new BN(hex, 16);
}

function bnToHex (bn/*: BN */)/*: string */ {
  const value/*: string */ = bn.toString(16);
  const isShort/*: boolean */ = value.length % 2 === 1;

  return `0x${isShort ? '0' : ''}${value}`;
}

module.exports = {
  bnToHex,
  hexToBn
};
