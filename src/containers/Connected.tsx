import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import useConnection from '../hooks/useConnection';

const readFile = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve({
      name: file.name,
      type: file.type,
      body: reader.result,
    });
  };
  reader.onerror = (err) => {
    reject(err);
  };
  reader.readAsDataURL(file);
});

const Connected: React.FC<{}> = () => {
  const { send, messages } = useConnection();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const files = await Promise.all(acceptedFiles.map(readFile));
    files.forEach(send);
  }, [send]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({onDrop})

  return (
    <>
      <div {...getRootProps()}>
      <input {...getInputProps()} />
      { isDragActive ? (
        <p>Drop the files here ...</p> 
      ):(
          <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      </div>
      {messages.map((message) => (
        <div>
          {message.name}-{message.body.length}
          <img style={{ width: 300, height: 300 }} src={message.body} />
        </div>
      ))}
    </>
  );
}

export default Connected;
