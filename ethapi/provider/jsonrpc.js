// @flow

const { EventEmitter } = require('events');

/*:: type JsonRpcVersion = '2.0' */

/*:: type JsonRpcRequest = {
  id: number,
  jsonrpc: JsonRpcVersion,
  message: string,
  params: Array<string>
} */

/*:: type JsonRpcResponse = {
  error: ?{
    code: number,
    message: string
  },
  id: number,
  jsonrpc: JsonRpcVersion,
  method?: string,
  params?: {
    result: {
      [string]: any
    }
  },
  result: string
} */

class JsonRpc extends EventEmitter {
  /*:: _id: number = 0 */

  constructor () {
    super();

    this._id = 0;
  }

  _encode (method/*: string */, params/*: Array<string> */)/*: string */ {
    const id/*: number */ = ++this._id;
    const json/*: string */ = JSON.stringify(({
      id,
      jsonrpc: '2.0',
      method,
      params
    }/*: JsonRpcRequest */));

    return {
      id,
      json
    };
  }

  _decode (data/*: string */)/*: JsonRpcResponse */ {
    const response/*: JsonRpcResponse */ = JSON.parse(data);

    return response;
  }
}

module.exports = JsonRpc;
