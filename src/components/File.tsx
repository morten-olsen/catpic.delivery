import React, { useCallback } from 'react';
import styled from 'styled-components';

interface Props {
  message: any;
}

const Wrapper = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Preview = styled.div`
  flex: 1;
  background: #eee;
`;

const Meta = styled.div`
  text-align: center;
`;

const Image = styled.div<{ src: string }>`
  background-image: url('${props => props.src}');
  background-size: cover;
  height: 100%;
`;

const NoPreview = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const getPreview = (type: string, src: string) => {
  if (type.startsWith('image/')) {
    return <Image src={src} />
  }
  return (
    <NoPreview>No preview</NoPreview>
  );
};

const File: React.FC<Props> = ({ message }) => {
  const { content } = message;
  const download = useCallback(() => {
    const link = document.createElement("a");
    link.download = content.name;
    link.href = content.body;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [content?.body, content?.name]);

  if (message.type === 'incomplete') {
    return (
      <Wrapper>
        <Preview />
        <Meta>
          {Math.round(message.current / message.length * 100)}%
        </Meta>
      </Wrapper>
    );
  }
  return (
    <Wrapper onClick={download}>
      <Preview>
        {getPreview(content.type, content.body)}
      </Preview>
      <Meta>
        {content.name}
      </Meta>
    </Wrapper>
  );
};

export default File;
