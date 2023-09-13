# Kavach <img src="https://img.shields.io/badge/BETA-v0.1-green"/>

Kavach is an encryption SDK that allows you to build your trustless, decentralized and fault-tolerant Applications using distributed key shards with threshold cryptography

## Features

- Randomized key shard generation
- Shard Key support for privateKey and other security keys
- Key Reconstruction from shards
- Fully typed, support in TypeScript
- Lighthouse Encryption Key storage(Optional 5 nodes)

## Install

Just use your favorite package manager to add `lighthouse-kavach to your project:

```sh
yarn add @lighthouse-web3/kavach

npm i @lighthouse-web3/kavach

```

## Methods

- ### _generate ( threshold?: number, keyCount?: number)_

This method generates randomized key shards

#### Parameters

| Name      | Type             | Default | Description                                                                               |
| --------- | ---------------- | ------- | ----------------------------------------------------------------------------------------- |
| threshold | number(optional) | 3       | minimum amount of key required to recover master key                                      |
| keyCount  | number(optional) | 5       | number of shades to be generated (**Note**: _must be greater than or equal to threshold_) |

#### returns

| Name      | Type                        | Description           |
| --------- | --------------------------- | --------------------- |
| masterKey | string                      | 32 byte string or key |
| keyShards | {key:string,index:string}[] | key shards            |

#### Demo

```javascript
import { generate } from "@lighthouse-web3/kavach";

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

| Name     | Type                        | Description                                          |
| -------- | --------------------------- | ---------------------------------------------------- |
| keyShard | {key:string,index:string}[] | minimum amount of key required to recover master key |

#### returns

| Name      | Type       | Description           |
| --------- | ---------- | --------------------- | ----- |
| masterKey | string     | 32 byte string or key |
| error     | ErrorValue | null                  | error |

#### Demo

```javascript
import { generate, recoverKey } from "@lighthouse-web3/kavach";

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

- ### _shardKey (key: string,threshold?: number, keyCount?: number)_

shard existing Key into shards

#### Parameters

| Name      | Type             | Default | Description                                                                               |
| --------- | ---------------- | ------- | ----------------------------------------------------------------------------------------- |
| key       | string           |         | 32 byte string or key                                                                     |
| threshold | number(optional) | 3       | minimum amount of key required to recover master key                                      |
| keyCount  | number(optional) | 5       | number of shades to be generated (**Note**: _must be greater than or equal to threshold_) |

#### returns

| Name        | Type       | Description                             |
| ----------- | ---------- | --------------------------------------- |
| isShardable | boolean    | return true is the key could be sharded |
| keyShards   | keyShard[] | shards                                  |

#### Demo

```javascript
import { shardKey, recoverKey } from "@lighthouse-web3/kavach";

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

- ### _saveShards( address: string, cid: string, auth_payload: string, keyShards: keyShard[5] | any[5], shareTo : string[])_

Backup key to lighthouse's Node

#### Parameters

| Name              | Type                              | Default | Description                                   |
| ----------------- | --------------------------------- | ------- | --------------------------------------------- |
| address           | string                            |         | address of the owner of the key               |
| cid               | string                            |         | unique id or file CID                         |
| auth_payload      | string                            |         | signed Message gotten from getAuthMessage/JWT |
| keyShards         | Array<{key:string; index:string}> |         | An array of 5 key shards/ element             |
| shareTo           | Array< address >(Options)         | []      | An array of address                           |

#### returns

| Name      | Type       | Description          |
| --------- | ---------- | -------------------- |
| isSuccess | boolean    | return true is saved |
| error     | ErrorValue | Errors               |

#### Demo

```javascript
import { getAuthMessage, saveShards, generate } from "@lighthouse-web3/kavach";
import { ethers } from "ethers";

async function main() {
  const signer = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b"
  );

  const { masterKey, keyShards } = await generate();

  const authMessage = await getAuthMessage(signer.address);
  const signedMessage = await signer.signMessage(authMessage.message);

  const { error, isSuccess } = await saveShards(
    signer.address,
    "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
    signedMessage,
    keyShards
  );

  console.log(error === null); // true;
  console.log(isSuccess === true); //true;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

- ### _shareToAddress(address: string, cid: string, auth_payload: string, shareTo: Array<string> )_

Share file Key to address

#### Parameters

| Name              | Type                      | Default | Description                                     |
| ----------------- | ------------------------- | ------- | ----------------------------------------------- |
| address           | string                    |         | address of the owner of the key                 |
| cid               | string                    |         | unique id or file CID                           |
| auth_payload      | string                    |         | signed Message gotten from getAuthMessage/ JWT  |
| shareTo           | Array< address >(Options) | []      | An array of address to share file key shards to |

#### returns

| Name      | Type       | Description               |
| --------- | ---------- | ------------------------- |
| isSuccess | boolean    | return true if successful |
| error     | ErrorValue | Errors                    |

#### Demo

```javascript
import {
  recoverShards,
  getAuthMessage,
  saveShards,
  AuthMessage,
  shareToAddress,
  generate,
} from "@lighthouse-web3/kavach";
import { ethers } from "ethers";

async function main() {
  let signer = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b"
  );
  let signer2 = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c99"
  );
  const cid = "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwAV";
  const { masterKey, keyShards } = await generate();

  //save file
  {
    const authMessage: AuthMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, isSuccess } = await saveShards(
      signer.address,
      cid,
      signedMessage,
      keyShards
    );
    console.log(error == null); //true;
    console.log(isSuccess == true); //true;
  }

  //share file key to address address
  {
    const authMessage: AuthMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const { error, isSuccess } = await shareToAddress(
      signer.address,
      cid,
      signedMessage,
      [signer2.address]
    );

    console.log(error == null); // true;
    console.log(isSuccess == true); //true;
  }

  //recover shared from address shared to

  {
    const authMessage: AuthMessage = await getAuthMessage(signer2.address);
    const signedMessage = await signer2.signMessage(authMessage.message);

    //retrieve 3 keys
    const { error, shards } = await recoverShards(
      signer2.address,
      cid,
      signedMessage,
      3
    );
    console.log(error == null); //true;
    console.log(shards.length === 3); // true;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

- ### _revokeAccess(address: string, cid: string, auth_payload: string, revokeTo: Array<string> )_

revoke access to addresses with direct access

#### Parameters

| Name              | Type                      | Default | Description                                     |
| ----------------- | ------------------------- | ------- | ----------------------------------------------- |
| address           | string                    |         | address of the owner of the key                 |
| cid               | string                    |         | unique id or file CID                           |
| auth_payload      | string                    |         | signed Message gotten from getAuthMessage /JWT  |
| revokeTo          | Array< address >(Options) | []      | An array of address to remove for Direct access |

#### returns

| Name      | Type       | Description               |
| --------- | ---------- | ------------------------- |
| isSuccess | boolean    | return true if successful |
| error     | ErrorValue | Errors                    |

#### Demo

```javascript
import {
  recoverShards,
  getAuthMessage,
  saveShards,
  AuthMessage,
  revokeAccess,
  generate,
} from "@lighthouse-web3/kavach";
import { ethers } from "ethers";

async function main() {
  let signer = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b"
  );
  let signer2 = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c99"
  );
  const cid = "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwVV";
  const { masterKey, keyShards } = await generate();

  //save file
  {
    const authMessage: AuthMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, isSuccess } = await saveShards(
      signer.address,
      cid,
      signedMessage,
      keyShards,
      [
        "0x95CF5354519a6ad2bD7e53fe7763201dfB24bFE4",
        "0xb46D27B3BfC07D27702EBddbe197Fc9276b70581",
        signer2.address,
      ]
    );
    console.log(error == null); //true;
    console.log(isSuccess == true); //true;
  }

  //recover shared from address shared to

  {
    const authMessage: AuthMessage = await getAuthMessage(signer2.address);
    const signedMessage = await signer2.signMessage(authMessage.message);

    //retrieve 3 keys
    const { error, shards } = await recoverShards(
      signer2.address,
      cid,
      signedMessage,
      3
    );
    console.log(error == null); //true;
    console.log(shards.length === 3); // true;
  }

  //revoke access to direct shared address
  {
    const authMessage: AuthMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const { error, isSuccess } = await revokeAccess(
      signer.address,
      cid,
      signedMessage,
      [signer2.address]
    );

    console.log(error == null); // true;
    console.log(isSuccess == true); //true;
  }

  //recover shared from address shared to

  {
    const authMessage: AuthMessage = await getAuthMessage(signer2.address);
    const signedMessage = await signer2.signMessage(authMessage.message);

    //retrieve 3 keys
    const { error, shards } = await recoverShards(
      signer2.address,
      cid,
      signedMessage,
      3
    );
    console.log(error); // { message: "you don't have access", data: {} };
    console.log(shards.length === 0); // true ;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

- ### _accessCondition( address: string, cid: string, auth_payload: string, conditions: Condition[], aggregator?: string,chainType?: ChainType)_

Add more granular access Conditions based on on-Chain Data, this supports custom EVM contracts, block timestamps and so on.
with support for over 15 Ethereum Virtual Machine (EVM) based networks and based Solana RPC calls

- Ethereum
- Rinkeby
- Polygon
- Fantom
- FantomTest
- AVAX
- Fuji
- BSC
- BSCTest
- Optimism
- OptimismGoerli
- OptimismKovan
- Mumbai
- FVM
- Wallaby
- Calibration
- Shardeum
- Goerli
- Hyperspace
- BTTC
- BTTC_Testnet
- Sepolia_PGN
- Arbitrum_Sepolia
- Sepolia: 
- BASE_Goerli

Solana

- DEVNET
- TESTNET
- MAINNET

#### Parameters

| Name              | Type               | Description                                                                     |
| ----------------- | ------------------ | ------------------------------------------------------------------------------- |
| address           | string             | Address of the owner of the key                                                 |
| cid               | string             | Unique id or file CID                                                           |
| auth_payload      | string             | Signed Message gotten from getAuthMessage /JWT                                  |
| conditions        | Array< Condition > | This Array contains a list of conditions to be tested on chain                  |
| aggregator        | string             | This is a template string that structures how the conditions should be computed |
| chainType         | string             | This defaults to EVM and can be set to Solana for Solana conditions             |

#### returns

| Name      | Type       | Description               |
| --------- | ---------- | ------------------------- |
| isSuccess | boolean    | return true if successful |
| error     | ErrorValue | Errors                    |

#### Demo

```javascript
import {
  recoverShards,
  getAuthMessage,
  saveShards,
  AuthMessage,
  accessControl,
  generate,
} from "@lighthouse-web3/kavach";
import { ethers } from "ethers";

async function main() {
  let signer = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b"
  );
  let signer2 = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c99"
  );
  const cid = "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwVM";

  //save file
  {
    const authMessage: AuthMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const { masterKey, keyShards } = await generate();

    const { error, isSuccess } = await saveShards(
      signer.address,
      cid,
      signedMessage,
      keyShards
    );
    console.log(error == null); //true;
    console.log(isSuccess == true); //true;
  }

  // add access control to cid direct shared address
  {
    const authMessage: AuthMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const { error, isSuccess } = await accessControl(
      signer.address,
      cid,
      signedMessage,
      [
        {
          id: 3,
          chain: "Polygon",
          method: "getBlockNumber",
          standardContractType: "",
          returnValueTest: { comparator: ">=", value: "0" },
        },
        {
          id: 2,
          chain: "Optimism",
          method: "getBalance",
          standardContractType: "",
          returnValueTest: { comparator: ">=", value: "0" },
        },
        {
          id: 1,
          chain: "FantomTest",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
      ],
      "([2] and [1]) or [3]"
    );
    console.log(error == null);
    console.log(isSuccess == true);
  }

  // recover shared from an address that matches the above condition
  // that is
  // has a balance equal to or greater than Zero on the Optimism mainnet and has a token balance greater than equal to zero of the token 0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1 on fantom's testnet
  // or if block height is greater than zero

  {
    const authMessage: AuthMessage = await getAuthMessage(signer2.address);
    const signedMessage = await signer2.signMessage(authMessage.message);
    console.log(signer2.address);

    //retrieve 3 keys
    const { error, shards } = await recoverShards(
      signer2.address,
      cid,
      signedMessage,
      3
    );
    console.log(error == null); //true;
    console.log(shards.length === 3); // true;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Auth Methods

- ### _getAuthMessage( address: string)_

Get Consensus Message to Sign

#### Parameters

| Name    | Type   | Default | Description                     |
| ------- | ------ | ------- | ------------------------------- |
| address | string |         | address of the owner of the key |

#### returns

| Name    | Type       | Description              |
| ------- | ---------- | ------------------------ |
| message | string     | return consensus message |
| error   | ErrorValue | Errors                   |

```javascript
import { getAuthMessage, AuthMessage } from "@lighthouse-web3/kavach";
import { ethers } from "ethers";

async function main() {
  let signer = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b"
  );

  // get consensus message
  const authMessage: AuthMessage = await getAuthMessage(signer.address);
  const signedMessage = await signer.signMessage(authMessage.message);

  console.log(typeof authMessage.message == "string"); //true;
  console.log(authMessage.error == null); //true;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

- ### _getJWT(address:string,signedMessage: SignedMessage)_

Get Consensus Message to Sign

#### Parameters

| Name               | Type    | Default | Description                                          |
| ------------------ | ------- | ------- | ---------------------------------------------------- |
| address            | string  |         | address of the owner of the key                      |
| payload            | string  |         | signed consensus message  or refresh Token           |
| useAsRefreshToken  | boolean |  false  | If payload is refreshToken this should be set to true |


#### returns

| Name            | Type       | Description |
| ----------------| ---------- | ----------- |
| JWT             | string     | return JWT  |
| refreshToken    | string     |             |
| error           | ErrorValue | Errors      |

```javascript
import { getAuthMessage, AuthMessage, getJWT } from "@lighthouse-web3/kavach";
import { ethers } from "ethers";

async function main() {
  let signer = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b"
  );

  // get consensus message
  const authMessage: AuthMessage = await getAuthMessage(signer.address);
  const signedMessage = await signer.signMessage(authMessage.message);

  const { JWT, error } = await getJWT(signer.address, signedMessage);
  console.log(typeof JWT == "string"); //true;
  console.log(error == null); //true;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```


- ### _transferOwnership(address: string, cid: string, newOwner: string, auth_payload: string, resetSharedTo: boolean = true)_

Transfer Ownership of a Resource

#### Parameters

| Name             | Type    | Default | Description                                      |
| ---------------- | ------- | ------- | ------------------------------------------------ |
| address          | string  |         | Address of the current owner of the resource    |
| cid              | string  |         | Content ID (CID) of the resource                |
| newOwner         | string  |         | Address of the new owner for the resource       |
| auth_payload     | string  |         | Authentication payload or token                 |
| resetSharedTo    | boolean | true    | Reset shared permissions when ownership changes |

#### Returns

| Name       | Type   | Description                       |
| ---------- | ------ | --------------------------------- |
| result     | string | Result of the ownership transfer  |
| error      | Error  | Any error that occurs             |

#### Example

```javascript
import { transferOwnership } from "@lighthouse-web3/kavach";

// Example usage of transferOwnership function
async function main() {
  const currentOwner = "0x1234567890abcdef";
  const resourceId = "QmXyZAbCdEfGhIjK";
  const newOwner = "0x9876543210fedcba";
  const authPayload = "your-authentication-token";

  const { result, error } = await transferOwnership(
    currentOwner,
    resourceId,
    newOwner,
    authPayload
  );

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Ownership transfer result:", result);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```