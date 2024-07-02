declare module 'uuid-token-generator' {
    export default class TokenGenerator {
      constructor(byteLength?: number, baseEncoding?: string);
      generate(): string;
      static readonly BASE62: string;
      static readonly BASE64: string;
      static readonly BASE66: string;
      static readonly BASE71: string;
      static readonly BASE85: string;
      static readonly BASE91: string;
      static readonly BASE94: string;
      static readonly BASE32: string;
      static readonly BASE58: string;
      static readonly BASE16: string;
    }
  }
  