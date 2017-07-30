// @flow

declare type WebSocketMessage = {
  type: string,
  utf8Data: string
}

declare type WebSocketErrorCallback = (error: Error) => void;
declare type WebSocketMessageCallback = (message: WebSocketMessage) => void;

declare type WebSocketConnection = {
  on: (type: string, callback: WebSocketErrorCallback | WebSocketMessageCallback);
  sendUTF: (message: string) => void;
}

declare type WebSocketCloseCallback = () => void;
declare type WebSocketConnectCallback = (connection: WebSocketConnection) => void;

declare class WebSocketClient {
  constructor: () => WebSocketClient;
  connect: (url: string) => void;
  on: (type: string, callback: WebSocketCloseCallback | WebSocketConnectCallback | WebSocketErrorCallback);
}

declare module 'websocket' {
  declare module.exports: {
    client: typeof WebSocketClient
  }
}
