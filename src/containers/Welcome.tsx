import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import QRReader from 'react-qr-reader'
import useSession from '../hooks/useSession';

const Wrapper = styled.div`
  display: flex;
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
  const { connect, connectInfo } = useSession();
  const [mode, setMode] = useState<'view' | 'scan'>('view');

  const onScan = useCallback(
    (result) => {
      if (result) {
        setMode('view');
        const { id, secret } = JSON.parse(result);
        connect(id, secret);
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
        {JSON.stringify(connectInfo)}
        {mode === 'view' && (
          <QRCode
            value={JSON.stringify(connectInfo)}
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
