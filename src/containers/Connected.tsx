import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import useSession, { State } from '../hooks/useSession';
import Message from '../components/Message';
import ComposeMessage from '../types/ComposeMessage';
import ComposeBar from '../components/ComposeBar';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  flex: 1;
  transform: scale(1, -1);
`;

const Loading = styled.div`
  transform: scale(1, -1);
`;


const Connected: React.FC<{}> = () => {
  const { send, messages, state } = useSession();
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
          <Message self={message.self} message={message.content} />
        ):(
          <Loading>Loading {Math.round(message.current / message.length * 100)}%</Loading>
        )))}
      </MessageList>
      { state === State.CONNECTED && (
        <ComposeBar onSend={onSend} message={currentMessage} setMessage={setCurrentMessage} />
      )}
    </Wrapper>
  );
}

export default Connected;
