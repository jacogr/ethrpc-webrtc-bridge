// @flow

declare class BN {
  constructor (value?: any, base: ?number): BN;

  add (value?: BN): BN;
  div (value?: BN): BN;
  divRound (value?: BN): BN;
  mul (value?: BN): BN;
  sub (value?: BN): BN;
  isZero (): boolean;
  eq (value: BN): boolean;
  lt (value: BN): boolean;
  gt (value: BN): boolean;
  toString (base?: number, padding?: number): string;

  static isBN (object: any): boolean;
}

declare module 'bn.js' {
  declare module.exports: typeof BN;
}
