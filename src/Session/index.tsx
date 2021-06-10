import Peer, { DataConnection } from 'peerjs';
import Crypto from '../Crypto';
import MessageList from '../MessageList';
import EventEmitter from 'eventemitter3';
import { nanoid } from 'nanoid';

enum State {
  READY,
  CONNECTING,
  CONNECTED,
  DISCONNECTED,
};

class Session extends EventEmitter {
  #cryptoTicket = Symbol('crypto-ticket');
  #name: string;
  #peer: Peer;
  #connection?: DataConnection;
  #crypto: Crypto;
  #messages: MessageList = new MessageList();
  #state: State = State.READY;

  constructor(
    name: string = 'unnamed',
    id: string = nanoid(),
    secret: string = nanoid(),
  ) {
    super();
    this.#name = name;
    this.#peer = new Peer(id);
    this.#crypto = new Crypto(secret, this.#cryptoTicket);
    this.#peer.on('connection', this.#handleConnection);
    this.#messages.on('updated', () => {
      this.emit('updated');
    });
  }

  #handleConnection = (connection: DataConnection) => {
    if (this.#connection) {
      return;
    }
    this.#connection = connection;
    this.#connection.on('data', this.#handleData);
    this.#connection.on('close', this.#handleDisconnect);
    this.#connection.on('error', this.#handleDisconnect);
    this.#state = State.CONNECTED;
    this.emit('updated');
  }

  #handleData = async (encrypted: any) => {
    const message = await this.#crypto.decrypt(encrypted);
    this.#messages.addMessage(message, false);
    console.log('foo', message);
  }

  #reconnect = () => {
    if (!this.#connection) return;
    const id = this.#connection.peer;
    const secret = this.#crypto.getSecret(this.#cryptoTicket);
    // TODO: Add reconnect functionality
  }

  #handleDisconnect = () => {
    this.#state = State.DISCONNECTED;
    this.emit('updated');
  }

  get id() {
    return this.#peer.id;
  }

  get name() {
    return this.#name;
  }

  get messages() {
    return this.#messages.list;
  }

  get state() {
    return this.#state;
  }

  get connectInfo() {
    return {
      id: this.#peer.id,
      secret: this.#crypto.getSecret(this.#cryptoTicket),
    }
  }

  connect = (id: string, secret: string) => {
    this.#state = State.CONNECTING;
    this.#crypto = new Crypto(secret, this.#cryptoTicket);
    this.#connection = this.#peer.connect(id);
    this.#connection.on('close', this.#handleDisconnect);
    this.#connection.on('error', this.#handleDisconnect);
    this.emit('updated');
    this.#connection.on('open', () => {
      this.#state = State.CONNECTED;
      this.emit('updated');
    });
  };

  send = async (data: any) => {
    if (!this.#connection) {
      throw new Error('Not connected');
    }
    const { startMsg, updateMsgs } = this.#messages.formatMessage(data);

    this.#messages.addMessage(startMsg, true);
    this.#connection.send(await this.#crypto.encrypt(startMsg)); 
    for (let updateMsg of updateMsgs) {
      this.#connection.send(await this.#crypto.encrypt(updateMsg));
      this.#messages.addMessage(updateMsg, true);
    }
  };
};

export { State };

export default Session;
