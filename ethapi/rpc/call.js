// @flow

/*:: import type { ProviderInterface } from 'eth2providers/types' */

/*:: type AttachCallOptions = {
  defaults?: Array<any>,
  inputs?: Array<?(string) => any>,
  method: string,
  output?: (any) => any
} */

/*:: type AttachCall = (...params: Array<any>) => Promise<any> */

function attachCall (provider/*: ProviderInterface */, { defaults = [], inputs = [], method, output }/*: AttachCallOptions */)/*: AttachCall */ {
  return async function (..._params/*: Array<any> */)/*: Promise<any> */ {
    const params = inputs.map((input, index) => {
      const param/*: any */ = _params[index] || defaults[index];

      return input
        ? input(param)
        : param;
    });
    const result/*: string */ = await provider.sendPromise(method, params);

    return output
      ? output(result)
      : result;
  };
}

module.exports = {
  attachCall
};
