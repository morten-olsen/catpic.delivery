import { useCallback } from 'react';
import { encrypt, decrypt } from '../utils/crypto';


const useCrypto = (secret: string) => {
  const doEncrypt = useCallback(async (data: any) => {
    const raw = JSON.stringify(data);
    const result = await encrypt(raw, secret);
    return result;
  }, [secret]);

  const doDecrypt = useCallback(async (data: string[]) => {
    return decrypt(data, secret);
  }, [secret]);

  return {
    encrypt: doEncrypt,
    decrypt: doDecrypt,
  };
}

export default useCrypto;
