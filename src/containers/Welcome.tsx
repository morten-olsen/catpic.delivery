import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
`;

const Header = styled.div`
  display: flex;
`;

const Button = styled.button<{ active: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px;
  font-weight: bold;
  ${props => props.active ? 'border-bottom: solid 1px red;' : ''}
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Welcome: React.FC<{}> = () => {
  const { connect, clientInfo } = useConnection();
  const [mode, setMode] = useState<'view' | 'scan'>('view');

  const onScan = useCallback(
    (result) => {
      if (result) {
        setMode('view');
        connect(JSON.parse(result));
      }
    },
    [],
  );

  return (
    <Wrapper>
      <Header>
        <Button active={mode==='view'} onClick={() => setMode('view')}>View</Button>
        <Button active={mode==='scan'} onClick={() => setMode('scan')}>Scan</Button>
      </Header>
      <Content>
        {mode === 'view' && (
          <QRCode
            value={JSON.stringify(clientInfo)}
            size={300}
          />
        )}
        {mode === 'scan' && (
          <QRReader
            delay={300}
            onScan={onScan}
            onError={(result) => { console.error(result) }}
            style={{ width: '300px', height: '300px' }}
          />
        )}
      </Content>
    </Wrapper>
  );
}

export default Welcome;
