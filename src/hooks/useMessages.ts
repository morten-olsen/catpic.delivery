import { nanoid } from 'nanoid';
import { useState, useCallback } from 'react';

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
      content: postProcess(JSON.parse(parts.join(''))), 
    };
  }


  return {
    ...message,
    parts,
  };
};

const useMessages = (postProcess: (input: any) => any) => {
  const [messages, setMessage] = useState<Message[]>([]);

  const addMessage = useCallback((request: Request) => {
    setMessage((current) => {
      if (request.type === 'start-message') {
        const message: IncompleteMessage = {
          id: request.payload.id,
          type: 'incomplete',
          length: request.payload.length,
          current: 0,
          parts: [],
        };
        return [
          ...current,
          message,
        ];
      }

      if (request.type === 'update-message') {
        return current.map(message => {
          if (message.id !== request.payload.id) {
            return message;
          }
          return updateMessage(message, request, postProcess);
        });
      }

      return current;
    });
  }, []);

  const formatMessage = (msg: any) => {
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

  return {
    messages,
    addMessage,
    formatMessage,
  }
};

export default useMessages;
