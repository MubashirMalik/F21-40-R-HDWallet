# HDWallet

A hierarchical deterministic Ethereum wallet based on electrum protocol for Bitcoin. 

## Introduction

At a high level, a wallet is a software application that serves as the primary user interface to Ethereum. The wallet controls access to a user’s money, managing keys and addresses, tracking the balance, and creating and signing transactions. 

More narrowly, from a programmer’s perspective, the word wallet refers to the system used to store and manage a user’s keys. Every wallet has a key-management component. For some wallets, that is all there is. Other wallets are part of a much broader category that of browsers, which are interfaces to Ethereum-based decentralized applications, or DApps.

A common misconception about cryptocurrencies is that the cryptocurrency wallets are used to store tokens or coins (ether in case of Ethereum). In fact, cryptocurrency wallets store keys – Public and Private keys to be exact. The coins or tokens are recorded on the Blockchain in the form of transactions. Users can control these coins or tokens on the network (Blockchain) by creating a valid transaction and signing it with their private keys. In a sense, a cryptocurrency wallet is just a key-chain.

## Types of Wallets
Digital Wallets are basically divided into two categories/types based on the relation of
keys:
- Nondeterministic
- Deterministic

### Nondeterministic

In a non-deterministic wallet each key is generated from a different seed which is mostly random. There is no relationship between multiple keys or accounts. Such wallets are known as JBOK wallets, from the phrase “Just a bunch of keys”. When the cryptocurrencies were first introduced, these types of wallets were very common.

However, after the development of deterministic wallets (which we have discussed in the next section), it is widely discouraged to use non-deterministic wallets except for simple tests. It is a good practice to use a different account (address) for a new transaction. Therefore, it is advised to avoid reuse of addresses as a part of maximizing privacy.

### Deterministic

The second wallet is a deterministic wallet, where all the keys are derived from a single master key, known as seed, which stems from a cryptographically secure pseudo random number (CSPRNG) or true random number generator (TRNG). In the case of a deterministic wallet, the keys are all related to each other and can be derived from a single master key. This advantage or characteristic of deterministic wallets makes them prone to single point of failure. To make these wallets more secure against data-loss accidents such having your phone stolen or losing access to your phone/personal computer, the seeds are often encoded as a list of English words (seeds can be encoded in other languages also but generally English is used).

#### Hierarchical Determinism

Currently the most advanced form of deterministic wallets is the Hierarchical deterministic (HD) wallet. It is defined in the BIP-32 standard of Bitcoin. HD wallets
contain keys derived in a tree structure, such that a parent key can derive a sequence of child keys, each of which can derive a sequence of grandchild keys, and so on.
This tree structure is illustrated in Figure

![image](https://user-images.githubusercontent.com/50724133/147164306-5d66060b-05c8-40b3-8db5-5a811acc1b09.png) 
Figure 1.1: HD wallet: a tree of keys generated from a single seed

## Creating an HD Wallet

### Mnemonic Code Words (BIP-39)
Mnemonic code words are just a bunch of words that are used to encode a random number. The random number is used to create a seed that is then used to generate the
private key.

An ethereum account has:
- a Private Key
- a Public Key
- an Address

### Sequence of Generation
Private Key -> Public Key -> Address

### Private Key
#### Generating Mnemnonic Words
- Create a cryptographically secure random number S of 128-to-256 bits.
  * Our Wallet Software uses 128-bit random numbers.
- Pass this random number S through the Secure Hash Algorithm (SHA-256).
  * Hash = SHA256(S)
- Divide the length-of-S (bits) by 32 (bits) and store in a variable.
  * Length = 128 / 32 = 4
- Take the first ‘Length’ bits of Hash and append it to the random number S. This is
- Divide the sequence-and-checksum concatenation into sections of 11 bits.
- Map each 11-bit value to a word from the predefined dictionary of 2,048 words.

#### Generating Seed from Mnemonic
- The first parameter to the PBKDF2 key-stretching function is the mnemonic produced in step 6
- The second parameter to the PBKDF2 key-stretching function is a salt. The salt is composed of the string constant "mnemonic" concatenated with an optional user supplied passphrase.
- PBKDF2 stretches the mnemonic and salt parameters using 2,048 rounds of hashing with the HMAC-SHA512 algorithm, producing a 512-bit value as its final output. That 512-bit value is the seed.
