import React, { useCallback } from 'react';
import styled from 'styled-components';

interface Props {
  width?: number;
  height?: number;
  file: {
    name: string;
    type: string;
    body: string;
  };
}

const Wrapper = styled.div`
  min-width: 90px;
  height: 90px;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const Image = styled.div<{ src: string }>`
  background-image: url('${props => props.src}');
  background-size: cover;
  height: 100%;
  border-radius: 6px;
`;

const NoPreview = styled.div`
  background: #2d3436;
  height: 100%;
  white-space: nowrap;
  align-items: center;
  display: flex;
  color: #fff;
  text-align: center;
  flex: 1;
  font-size: 0.8em;
  padding: 10px;
  border-radius: 6px;
`;
const getPreview = (file: Props['file']) => {
  if (file.type.startsWith('image/')) {
    return <Image src={file.body} />
  }
  return (
    <NoPreview>
      {file.name}
    </NoPreview>
  );
};

const Preview: React.FC<Props> = ({ file }) => {
  const download = useCallback(() => {
    const link = document.createElement("a");
    link.download = file.name;
    link.href = file.body;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [file]);

  return (
    <Wrapper onClick={download}>
      {getPreview(file)}
    </Wrapper>
  );
};

export default Preview;
