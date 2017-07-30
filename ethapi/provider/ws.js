// @flow

const l = require('abc2logger')('Ws', false);
const WebSocketClient = require('websocket').client;

const JsonRpc = require('./jsonrpc');

/*:: import type { ProviderInterface, ProviderResultCallback } from './types' */

/*:: type WsRpcOptions = {
  host: string,
  port: number
} */

/*:: type WsHandlerType = {
  callback: ProviderResultCallback,
  id: number
} */

/*:: type WsSubscriptionType = {
  callbacks: Array<ProviderResultCallback>,
  method: string,
  result: ?string
} */

class WsProvider extends JsonRpc /*:: implements ProviderInterface */ {
  /*:: _connection: ?WebSocketConnection = null */
  /*:: _handlers: { [number]: WsHandlerType } = {} */
  /*:: _queued: Array<string> = [] */
  /*:: _subscriptions: { [number]: WsSubscriptionType } = {} */
  /*:: _ws: ?WebSocketClient = null */

  constructor (options/*: WsRpcOptions */) {
    super();

    this._onClose = this._onClose.bind(this);
    this._onConnect = this._onConnect.bind(this);
    this._onError = this._onError.bind(this);
    this._onMessage = this._onMessage.bind(this);

    this._connection = null;
    this._handlers = {};
    this._queued = [];
    this._subscriptions = {};

    this._ws = new WebSocketClient();
    this._ws.on('connectFailed', this._onError);
    this._ws.on('connect', this._onConnect);
    this._ws.connect(`ws://${options.host}:${options.port}/`, []);
  }

  get isConnected ()/*: boolean */ {
    return this._connection !== null;
  }

  _onClose () {
    this._connection = null;
    this.emit('disconnected');

    l.warn('connection closed');
  }

  _onConnect (connection/* WebSocketConnection */) {
    this._connection = connection;

    connection.on('close', this._onClose);
    connection.on('error', this._onError);
    connection.on('message', this._onMessage);

    this.emit('connected');

    this._queued.forEach((json) => {
      this._connection.sendUTF(json);
    });

    this._queued = [];
  }

  _onError (error/*: Error */) {
    l.error(error);
  }

  _onMessageAsync (id, error, result) {
    if (!this._handlers[id]) {
      this.emit('error', new Error(`Unable to find handler for message '${id}'`));
      return;
    }

    const { callback } = this._handlers[id];

    try {
      if (error) {
        callback(new Error(`${error.code}: ${error.message}`));
      } else {
        callback(null, result);
      }
    } catch (error) {
      l.error(error);
    }

    delete this._handlers[id];
  }

  _onMessageSubscription (id, _error, result) {
    if (!this._subscriptions[id]) {
      this.emit('error', new Error(`Unable to find subscription for '${id}'`));
      return;
    }

    const subscription = this._subscriptions[id];
    const { callbacks } = subscription;
    const error = _error
      ? new Error(`${_error.code}: ${_error.message}`)
      : null;

    subscription.result = error
      ? null
      : result;

    callbacks.forEach((callback) => {
      try {
        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }
      } catch (error) {
        l.error(error);
      }
    });
  }

  _onMessage (message/*: WebSocketMessage */) {
    l.debug('onMessage', message);

    if (message.type !== 'utf8') {
      l.error('Invalid message', message);
      return;
    }

    const { id, error, method, params, result } = this._decode(message.utf8Data);

    if (!id) {
      if (method === 'eth_subscription') {
        this._onMessageSubscription(params.subscription, error, params.result);
      }
    } else {
      this._onMessageAsync(id, error, result);
    }
  }

  send (method/*: string */, params/*: Array<string> */, callback/*: ProviderResultCallback */)/*: number */ {
    const { id, json } = this._encode(method, params);

    this._handlers[id] = {
      callback,
      id
    };

    if (this.isConnected) {
      this._connection.sendUTF(json);
    } else {
      this._queued.push(json);
    }

    return id;
  }

  sendPromise (method/*: string */, params/*: Array<string> */)/*: Promise<string> */ {
    return new Promise((resolve, reject) => {
      this.send(method, params, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async subscribe (method/*: string */, params/*: Array<string> */, callback/*: ProviderResultCallback */)/*: Promise<string> */ {
    const subscription/*: ?WsSubscriptionType */ = Object
      .values(this._subscriptions)
      .find((subscription) => subscription.method === method);

    if (subscription) {
      const { callbacks, result, id } = subscription;

      callbacks.push(callback);

      if (result) {
        callback(null, result);
      }

      return id;
    }

    const id = await this.sendPromise('eth_subscribe', [method]);

    this._subscriptions[id] = {
      callbacks: [callback],
      id,
      method,
      result: null
    };
  }

  unsubscribe (method/*: string */, params/*: Array<string> */)/*: Promise<string> */ {
  }
}

module.exports = WsProvider;
