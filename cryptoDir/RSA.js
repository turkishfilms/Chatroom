import primesList from "./Primes";
import PrimeManager from "./PrimeManager";
/**
 * import RSA from "./cryptoDir/RSA"
 *
 * const rsa = new RSA()
 * const SERVER_KEYS = rsa.generateKeyPair("some random string", "some random string")
 * when receiving a message, use message.publicKey to decrypt message using rsa.decryptMessage(message.message,message.publicKey)
 * when sending messages send {message:encryptedMessage, key:SERVER_KEYS.publicKey} encrpytedMessage = rsa.encryptMessage(message,SERVER_KEYS.privateKey)
 *
 */
export default class RSA {
  constructor() {
    this.primeManager = new PrimeManager(primesList);
  }

  generateKeyPair = (input1, input2) => {
    const { prime1, prime2 } = this.generatePrimesFromInput(input1, input2);
    return this.keyPairgeneratorRSA(prime1, prime2);
  };

  encryptMessage = (message, encryptionKey) => {
    const msgCharList = message.split("");
    const encodedMessage = msgCharList.map((character) => {
      return Number(
        BigInt(character.charCodeAt()) ** BigInt(encryptionKey.key) %
          BigInt(encryptionKey.base)
      );
    });
    return encodedMessage;
  };

  decryptMessage = (cipher, decryptionKey) => {
    //   const cipherCharList = cipher.split("");
    const cipherCharList = cipher;
    const message = cipherCharList.map((character) => {
      return String.fromCharCode(
        Number(
          BigInt(character) ** BigInt(decryptionKey.key) %
            BigInt(decryptionKey.base)
        )
      );
    });
    return message.join("");
  };
  /////////////////////////////////

  sumCharacterCodes = (characters) => {
    const codeList = characters.split("");
    const total = codeList.reduce((prev, curr) => {
      return (prev += curr.charCodeAt());
    }, 0);
    return total;
  };

  generatePrimesFromInput = (input1, input2) => {
    return this.primeManager.generatePrimePair(
      this.sumCharacterCodes(input1),
      this.sumCharacterCodes(input2)
    );
  };

  keyPairgeneratorRSA = (prime1, prime2) => {
    /**
     * N = product of prime 1 and prime 2
     * T = product of prime1 -1 and prime2 -1
     * e is a number between 2 and T-1
     *   is not a multiple of N or T
     * d is a number between 2 and T/12
     */
    let N = prime1 * prime2;
    let T = (prime1 - 1) * (prime2 - 1);
    for (let e = 2; e < T; e++) {
      if (N % e == 0 || T % e == 0) continue;
      for (let d = 2; d < T / 12; d++) {
        if ((d * e) % T == 1 && e != d && d < 500000) {
          return {
            publicKey: { key: e, base: N },
            privateKey: { key: d, base: N },
          };
        }
      }
    }
  };
}
