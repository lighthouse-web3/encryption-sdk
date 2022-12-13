# Lighthouse Encryption SDK

Build your trustless, decentralized and fault tolerant Applications using distributed key shards with threshold cryptography

## Features

- Randomized key shard generation
- Shard Key support for privateKey and other security keys
- Key Reconstruction from shards
- Fully typed, support in TypeScript
- Lighthouse Encryption Key storage(Optional 5 nodes)


## Install

Just use your favorite package manager to add `lighthouse-encryption-sdk` to your project:

```sh
yarn add lighthouse-encryption-sdk

npm i --save lighthouse-encryption-sdk

```


## Methods

- ### _generate ( threshold?: number, keyCount?: number)_

This method generates randomized key shards 

#### Parameters

| Name                   | Type                                   | Default  | Description                     |
| ---------------------- | -------------------------------------- | -------  |--------------------------------|
| threshold              | number(optional)                       | 3        | minimum amount of key required to recover master key|
| keyCount               | number(optional)                       | 5        | number of shades to be generated (**Note**: *must be greater than or equal to threshold*)|

#### returns

| Name                   | Type                                   | Description                    |
| ---------------------- | -------------------------------------- |--------------------------------|
| masterKey              | string                                 | 32 byte string or key          |
| keyShards              | {key:string,index:string}[]            | key shards                     | 


#### Demo

```javascript

import { generate } from "lighthouse-encryption-sdk";

async function main() {
const { masterKey, keyShards } = await generate();
console.log(`masterKey: ${masterKey}`);
console.log(`keyShards:`, keyShards);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
```


- ### _recoverKey (keyShards: keyShard[])_

This method recovers the master key from the shards generated

#### Parameters

| Name                   | Type                                   | Description                     |
| ---------------------- | -------------------------------------- | --------------------------------|
| keyShard               | {key:string,index:string}[]            | minimum amount of key required to recover master key|

#### returns

| Name                   | Type                                   | Description                    |
| ---------------------- | -------------------------------------- |--------------------------------|
| masterKey              | string                                 | 32 byte string or key          |
| error                  | ErrorValue | null                      | error                          | 


#### Demo

```javascript
import { generate, recoverKey } from "lighthouse-encryption-sdk";

async function main() {
  const { masterKey, keyShards } = await generate();

  const { masterKey: recoveredKey } = await recoverKey(keyShards);
  console.log(masterKey === recoveredKey); //true
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```


- ###  _shardKey (key: string,threshold?: number, keyCount?: number)_

shard existing Key into shards

#### Parameters

| Name                   | Type                                   | Default  | Description                     |
| ---------------------- | -------------------------------------- | -------- | --------------------------------|
| key                    | string                                 |          | 32 byte string or key           |
| threshold              | number(optional)                       | 3        | minimum amount of key required to recover master key|
| keyCount               | number(optional)                       | 5        | number of shades to be generated (**Note**: *must be greater than or equal to threshold*)|

#### returns

| Name                   | Type                                   | Description                    |
| ---------------------- | -------------------------------------- |--------------------------------|
| isShardable            | boolean                                | return true is the key could be sharded |
| keyShards              | keyShard[]                             | shards                              | 


#### Demo

```javascript
import { shardKey, recoverKey } from "../index";
import { v4 as uuidv4 } from "uuid";

async function main() {
  // known key customly generated or from ether random wallet privateKey
  // Note: Not all keys are shardable
  const knownKey =
    "554f886019b74852ab679258eb3cddf72f12f84dd6a946f8afc4283e48cc9467";
  const { isShardable, keyShards } = await shardKey(knownKey);
  console.log(isShardable); // true

  //recover keys from shards
  const { masterKey } = await recoverKey(keyShards);

  //check if the key recovered was recovered
  console.log(masterKey === knownKey); //true
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```

- ###  _saveShards( address: string, cid: string, signature: string, keyShards: keyShard[5], : string[])_

Backup key to lighthouse's Node

#### Parameters


| Name                   | Type                                     | Default  | Description                              |
| ---------------------- | ---------------------------------------- | -------- | -----------------------------------------|
| address                | string                                   |          | address of the owner of the key          |
| cid                    | string                                   |          | unique id or file CID                    |
| signature              | string                                   |          | signed Message gotten from getAuthMessage|
| keyShards              | Array<{key:string; index:string}>        |          | An array of 5 key shards/ element        |
| shareTo                | Array< address >(Options)                |   []     | An array of address                      |



#### returns

| Name                   | Type                                   | Description                             |
| ---------------------- | -------------------------------------- |-----------------------------------------|
| isSuccess              | boolean                                | return true is saved                    |
| error                  | ErrorValue                             | Errors                                  | 


#### Demo

```javascript
import { shardKey, recoverKey, getAuthMessage, saveShards } from "../index";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const provider = ethers.getDefaultProvider();
  let signer = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b"
  );

  const authMessage = await getAuthMessage(signer.address);
  const signedMessage = await signer.signMessage(authMessage.message);

  const { error, isSaved } = await saveShards(
    signer.address,
    "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
    signedMessage,
    [
      { key: "1", index: "1" },
      { key: "2", index: "2" },
      { key: "3", index: "3" },
      { key: "4", index: "4" },
      { key: "5", index: "5" },
    ]
  );

  console.log(error === null) // true;
  console.log(isSaved === true) //true;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```