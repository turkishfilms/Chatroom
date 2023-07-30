export default class PrimeManager {
  constructor(primeList) {
    this.primesList = primeList || [];
  }

  /**
   * Generates a Par of different primes from number inputs.
   * @param {number} input1 first input seed value
   * @param {number} input2 second input seed value
   * @returns {number number} two prime numbers
   */
  generatePrimePair = (input1, input2) => {
    const prime1 = this.randomPrimeGenerator(input1);
    const prime2 = this.differentPrime(
      prime1,
      this.randomPrimeGenerator(input2)
    );

    return { prime1, prime2 };
  };

  /////////
  randomPrimeGenerator = (input, primesList = this.primesList) => {
    // find a more efficient way to search
    if (typeof input !== "number" || !Number.isInteger(input)) {
      throw new Error("Input must be an integer");
    }
    if (input < 4) return 3;
    let potentialPrime = input % 2 == 0 ? input + 1 : input;
    while (!this.isPrime(potentialPrime, primesList)) {
      potentialPrime += 2; //this is really crude and terribly inefficient for big integers
    }
    return potentialPrime;
  };
  //////////////
  isPrime(num, primesList = this.primesList) {
    if (num <= primesList[primesList.length] * 2) {
      return this.smallPrimeTest(num, primesList);
    }
    if (num == 2 || num == 3) return true;
    if (num <= 1 || num % 2 == 0 || num % 3 == 0) return false;
    for (let i = 5; i * i <= num; i += 6)
      if (num % i == 0 || num % (i + 2) == 0) return false;
    return true;
  }

  smallPrimeTest = (num, primesList = this.primesList) => {
    return primesList.some((prime) => {
      return num % prime === 0;
    });
  };

  differentPrime = (prime1, prime2, primeList = this.primesList) => {
    return prime1 == prime2
      ? this.randomPrimeGenerator(prime2 * 2, primeList)
      : prime2;
  };
}
