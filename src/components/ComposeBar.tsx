import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import ComposeMessage from '../types/ComposeMessage';
import Preview from './Preview';

interface Props {
  message: ComposeMessage;
  setMessage: React.Dispatch<React.SetStateAction<ComposeMessage>>;
  onSend: () => any;
}

const Wrapper = styled.div`

`;

const ComposeArea = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  font-size: 18px;
  height: 30px;
  background: #eee;
  padding: 0 10px;
  border-radius: 6px;
`;

const Button = styled.button`
  height: 30px;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  margin-left: 10px;
`;

const PreviewWrapper = styled.div`
  display: flex;
  padding: 3px;
  margin: 6px;
  background: #eee;
  border-radius: 6px;
`;

const readFile = (file: File) => new Promise<ComposeMessage['files'][0]>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve({
      name: file.name,
      type: file.type,
      body: reader.result as string,
    });
  };
  reader.onerror = (err) => {
    reject(err);
  };
  reader.readAsDataURL(file);
});

const ComposeBar: React.FC<Props> = ({ message, setMessage, onSend }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const files = await Promise.all(acceptedFiles.map(readFile));
    setMessage((current) => ({
      ...current,
      files: [
        ...current.files,
        ...files,
      ],
    }));
  }, [setMessage]);

  const setText = useCallback((evt: any) => {
    setMessage((current) => ({
      ...current,
      text: evt.target.value,
    }));
  }, [setMessage]);

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({onDrop})

  return (
    <Wrapper>
      <ComposeArea>
        <Input placeholder="Type a message..." value={message.text} onChange={setText} />
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button>File</Button>
        </div>
        <Button onClick={onSend}>Send</Button>
      </ComposeArea>
      {message.files.length > 0 && (
        <PreviewWrapper>
          {message.files.map((file, i) => (
            <Preview key={i} file={file} />
          ))}
        </PreviewWrapper>
      )}
    </Wrapper>
  )
};

export default ComposeBar;

