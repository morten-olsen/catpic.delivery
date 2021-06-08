import React, { useCallback, useEffect } from 'react';
import QRCode from 'react-qr-code';
import QRReader from 'react-qr-reader'
import useConnection from '../hooks/useConnection';

const Welcome: React.FC<{}> = () => {
  const { connect, clientInfo } = useConnection();

  const onScan = useCallback(
    (result) => {
      if (result) {
        connect(JSON.parse(result));
      }
    },
    [],
  );

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const clientInfoEncoded = hash.substring(1);
      const clientInfo = JSON.parse(atob(clientInfoEncoded));
      connect(clientInfo);
    }
    console.log(hash);
  }, []);

  return (
    <>
      <div>{location.protocol}//{location.host}{location.pathname}#{btoa(JSON.stringify(clientInfo))}</div>
      <QRCode
        value={JSON.stringify(clientInfo)}
        size={300}
      />
      <QRReader
        delay={300}
        onScan={onScan}
        onError={(result) => { console.error(result) }}
        style={{ width: '300px', height: '300px' }}
      />
    </>
  );
}

export default Welcome;
