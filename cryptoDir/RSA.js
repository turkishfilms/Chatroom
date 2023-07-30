import primesList from "./Primes";

export default class RSA {
  constructor() {
    this.primesList = primesList;
  }

  generateKeyPair = (input1, input2) => {
    const prime1 = this.generatePrimeFromInput(input1);
    const prime2 = this.generatePrimeFromInput(input2);

    return this.keyPairgeneratorRSA(
      prime1,
      this.differentPrime(prime1, prime2, this.primeList)
    );
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
  differentPrime = (prime1, prime2, primeList) => {
    if (prime1 == prime2) {
      //if prime number 2 is equal to prime number 1
      return primeList[(primeList.indexOf(prime2) + 1) % primeList.length];
      //then pick the next prime number, (index wraps around the end)
    } else {
      return prime2;
    }
  };

  sumCharacterCodes = (characters) => {
    const codeList = characters.split("");
    const total = codeList.reduce((prev, curr) => {
      return (prev += curr.charCodeAt());
    }, 0);
    return total;
  };

  generatePrimeFromInput = (input, primeList) => {
    return primeList[this.sumCharacterCodes(input) % primeList.length];
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
            encryptionKey: { key: e, base: N },
            decryptionKey: { key: d, base: N },
          };
        }
      }
    }
  };
}
