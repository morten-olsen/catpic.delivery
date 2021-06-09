import React, { useCallback } from 'react';
import styled from 'styled-components';

interface Props {
  name: string;
  type: string;
  src: string;
}

const Wrapper = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Preview = styled.div`
  flex: 1
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

const File: React.FC<Props> = ({ name, type, src }) => {
  const download = useCallback(() => {
    const link = document.createElement("a");
    link.download = name;
    link.href = src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [src]);

  return (
    <Wrapper onClick={download}>
      <Preview>
        {getPreview(type, src)}
      </Preview>
      <Meta>
        {name}
      </Meta>
    </Wrapper>
  );
};

export default File;
