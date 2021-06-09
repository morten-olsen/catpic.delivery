import React from 'react';
import styled from 'styled-components';
import ComposeMessage from '../types/ComposeMessage';
import Preview from './Preview';

interface Props {
  message: ComposeMessage;
  self: boolean;
}

const Direction = styled.div<{ self: boolean }>`
  display: flex;
  flex-direction: column;
  transform: scale(1, -1);
  align-items: ${props => props.self ? 'flex-start' : 'flex-end'};
  margin: 8px 10px;
`;

const Wrapper = styled.div<{ self: boolean }>`
  color: #fff;
  padding: 10px;
  background: #6c5ce7;
  max-width: 80%;
  margin: 8px 0;
  border-radius: 10px;
`;

const PreviewWrapper = styled.div`
  display: flex;
`;

const Message: React.FC<Props> = ({ message }) => {
  return (
    <Direction self={true}>
      {message.files && message.files.length > 0 && (
        <PreviewWrapper>
          {message.files.map((file, i) => (
            <Preview file={file} key={i} />
          ))}
        </PreviewWrapper>
      )}
      {message.text && (
        <Wrapper self={true}>
          {message.text}
        </Wrapper>
      )}
    </Direction>
  );
};

export default Message;
