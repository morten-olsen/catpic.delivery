import EventEmitter from 'eventemitter3';
import { nanoid } from 'nanoid';

interface BaseRequest {
  type: string;
}

interface StartRequest extends BaseRequest {
  type: 'start-message';
  payload: {
    id: string;
    length: number;
  };
}

interface UpdateRequest extends BaseRequest {
  type: 'update-message';
  payload: {
    id: string;
    index: number;
    part: any;
  };
}

interface BaseMessage {
  id: string;
  type: string;
  self: boolean;
}

interface IncompleteMessage extends BaseMessage {
  type: 'incomplete';
  length: number;
  current: number;
  parts: any[];
}

interface CompleteMessage extends BaseMessage {
  type: 'complete';
  content: any;
}

type Message = CompleteMessage | IncompleteMessage;
type Request = StartRequest | UpdateRequest;

function chunkSubstr(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }

  return chunks
}

const updateMessage = (
  message: Message,
  request: UpdateRequest,
  postProcess: (a: any) => any,
): Message => {
  if (message.type === 'complete') {
    return message;
  }
  const parts = [...message.parts];
  parts[request.payload.index] = request.payload.part;
  message.current += 1;
  if (message.current === message.length) {
    console.log('data', JSON.parse(parts.join('')));
    return {
      id: message.id,
      type: 'complete',
      self: message.self,
      content: postProcess(JSON.parse(parts.join(''))), 
    };
  }


  return {
    ...message,
    parts,
  };
};

class MessageList extends EventEmitter {
  #messages: Message[] = [];
  #postProcess: (a: any) => any;

  constructor(postProces: (a: any) => any = (a) => a) {
    super();
    this.#postProcess = postProces;
  }

  get list() {
    return this.#messages;
  }

  addMessage = (request: Request, self: boolean) => {
    if (request.type === 'start-message') {
      const message: IncompleteMessage = {
        id: request.payload.id,
        type: 'incomplete',
        self,
        length: request.payload.length,
        current: 0,
        parts: [],
      };
      this.#messages = [
        ...this.#messages,
        message,
      ];
      this.emit('updated');
    }

    if (request.type === 'update-message') {
      this.#messages = this.#messages.map(message => {
        if (message.id !== request.payload.id) {
          return message;
        }
        return updateMessage(message, request, this.#postProcess);
      });
      this.emit('updated');
    }
  };

  formatMessage = (msg: any) => {
    const dataString = JSON.stringify(msg);
    const parts = chunkSubstr(dataString, 100000);
    const id = nanoid();
    const startMsg: StartRequest = {
      type: 'start-message',
      payload: {
        length: parts.length,
        id,
      },
    };
    const updateMsgs = parts.map<UpdateRequest>((part, index) => ({
      type: 'update-message',
      payload: {
        id,
        index,
        part,
      },
    }));
    return {
      startMsg,
      updateMsgs,
    };
  };
};

export default MessageList;
