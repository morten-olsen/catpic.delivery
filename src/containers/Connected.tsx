import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import useConnection from '../hooks/useConnection';
import FileView from '../components/File';
import FileGrid from '../components/FileGrid';

const readFile = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve({
      mediaType: 'file',
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

  const reset = useCallback(() => {
    location.reload();
  }, []);

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
          <p>Drag 'n' drop some files here, or click to select files!</p>
      )}
      </div>
      <FileGrid>
        {messages.map((message) => (
          <FileView message={message} />
        ))}
      </FileGrid>
      <button onClick={reset}>Reset</button>
    </>
  );
}

export default Connected;
