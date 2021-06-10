import { encrypt, decrypt } from '../utils/crypto';

class Crypto {
  #secret: string;
  #ticket?: Symbol;

  constructor(secret: string, ticket?: Symbol) {
    this.#secret = secret;
    this.#ticket = ticket
  }

  encrypt = async (data: any) => {
    const raw = JSON.stringify(data);
    const result = await encrypt(raw, this.#secret);
    return result;
  };

  decrypt = async (data: any) => {
    return decrypt(data, this.#secret);
  };

  getSecret(ticket: Symbol) {
    if (!this.#ticket || this.#ticket !== ticket) {
      throw new Error('Ticket not valid');
    }
    return this.#secret;
  }
}

export default Crypto;
