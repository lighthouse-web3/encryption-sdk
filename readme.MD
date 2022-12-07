# Lighthouse Encryption SDK

Build your trustless, decentralized and fault resistance Application using distributed key shades with threshold cryptography

## Features

- Randomized key shard generation
- Split supported privateKey and other security keys
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
| isSaved                | boolean                                | return true is saved                    |
| error                  | ErrorValue                             | Errors                                  | 


