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

- generate ( threshold?: number, keyCount?: number)

This method generates randomized key shards 

### Parameters

| Name                   | Type                                   | Default  | Description                     |
| ---------------------- | -------------------------------------- | -------  |--------------------------------|
| threshold              | number(optional)                       | 3        | minimum amount of key required to recover master key|
| keyCount               | number(optional)                       | 5        | number of shades to be generated (**Note**: *must be greater than or equal to threshold*)|

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


- recoverKey (keyShards: keyShard[])

This method recovers the master key from the shards generated

### Parameters

| Name                   | Type                                   | Description                     |
| ---------------------- | -------------------------------------- | --------------------------------|
| keyShard               | {key:string,index:string}[]            | minimum amount of key required to recover master key|


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
