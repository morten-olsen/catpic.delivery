import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import useConnection from '../hooks/useConnection';
import Message from '../components/Message';
import ComposeMessage from '../types/ComposeMessage';
import ComposeBar from '../components/ComposeBar';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  flex: 1;
  transform: scale(1, -1);
`;


const Connected: React.FC<{}> = () => {
  const { send, messages } = useConnection();
  const [currentMessage, setCurrentMessage] = useState<ComposeMessage>({
    files: [],
    text: '',
  });
  const reverseMessages = useMemo(() => [...messages].reverse(), [messages]);

  const onSend = useCallback(() => {
    send(currentMessage);
    setCurrentMessage({ files: [], text: '' });
  }, [currentMessage])

  const reset = useCallback(() => {
    location.reload();
  }, []);

  return (
    <Wrapper>
      <button onClick={reset}>Reset</button>
      <MessageList>
        {reverseMessages.map((message) => (message.content ? (
          <Message message={message.content} />
        ):(
          <div>Loading</div>
        )))}
      </MessageList>
      <ComposeBar onSend={onSend} message={currentMessage} setMessage={setCurrentMessage} />
    </Wrapper>
  );
}

export default Connected;
