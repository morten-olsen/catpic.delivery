import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import QRReader from 'react-qr-reader'
import useConnection from '../hooks/useConnection';

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Link = styled.input`
  width: 300px;
  border: none;
  background: none;
`;

const Welcome: React.FC<{}> = () => {
  const linkRef = useRef<any>();
  const { connect, clientInfo } = useConnection();
  const link = useMemo(
    () => `${location.protocol}//${location.host}${location.pathname}#${btoa(JSON.stringify(clientInfo))}`,
    [clientInfo],
  )

  const onScan = useCallback(
    (result) => {
      if (result) {
        connect(JSON.parse(result));
      }
    },
    [],
  );

  const copy = useCallback(() => {
    const text = linkRef.current;
    if (!text) return;
    text.focus();
    text.select();
    let successful = document.execCommand('copy');
    let msg = successful ? 'successful' : 'unsuccessful';
    alert('Copy text command was ' + msg);
  }, [linkRef]);

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
    <Wrapper>
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
      <Link ref={linkRef} onFocus={copy} value={link} /> 
    </Wrapper>
  );
}

export default Welcome;
