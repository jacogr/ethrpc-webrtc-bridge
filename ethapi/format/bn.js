// @flow

const { BN } = require('ethereumjs-util');

function hexToBN (_hex/*: string */)/*: BN */ {
  const hex = _hex.substr(0, 2) === '0x'
    ? _hex.substr(2)
    : _hex;

  return new BN(hex, 16);
}

module.exports = {
  hexToBN
};
