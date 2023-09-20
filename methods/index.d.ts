type keyShard = {
  key: string;
  index: string;
};

// TypeScript Version: 4.7
type ErrorValue = string | string[] | number | boolean | null | object;

export type generatedKey = {
  masterKey: string | null;
  keyShards: Array<keyShard>;
};

export type GenerateInput = {
  threshold?: number;
  keyCount?: number;
};
export function generate(
  threshold?: number,
  keyCount?: number
): Promise<generatedKey>;

export type AuthMessage = {
  message: string;
  error: string | ErrorValue | null;
};

export function getAuthMessage(address: string): Promise<AuthMessage>;

export type RecoveredKey = {
  masterKey: string | null;
  error: string | ErrorValue | null;
};

export function recoverKey(keyShards: keyShard[]): Promise<RecoveredKey>;

type RecoverShards = {
  shards: keyShard[];
  error: ErrorValue;
};

type WithPrefix<T extends string> = `${T}${string}`;

export type SignedMessage = string;
export type JWT = WithPrefix<'jwt:'>;

export function recoverShards(
  address: string,
  cid: string,
  auth_token: SignedMessage | JWT,
  numOfShards?: number,
  dynamicData?: object
): Promise<RecoverShards>;

export type LightHouseSDKResponse = {
  isSuccess: boolean;
  error: ErrorValue;
};

export function saveShards(
  address: string,
  cid: string,
  auth_token: SignedMessage | JWT,
  keyShards: keyShard[] | Array<any>,
  shareTo?: string[]
): Promise<LightHouseSDKResponse>;

export function shardKey(key: string): Promise<{
  isShardable: boolean;
  keyShards: keyShard[];
}>;

export function revokeAccess(
  address: string,
  cid: string,
  auth_token: SignedMessage | JWT,
  revokeTo: Array<string>
): Promise<LightHouseSDKResponse>;

export type ChainType = "EVM" | "evm" | "solana" | "SOLANA";
export type DecryptionType = "ADDRESS" | "ACCESS_CONDITIONS";

export function accessControl(
  address: string,
  cid: string,
  auth_token: SignedMessage | JWT,
  conditions: { [key: string]: any },
  aggregator?: string,
  chainType?: ChainType,
  keyShards?: keyShard[],
  decryptionType?: DecryptionType
): Promise<LightHouseSDKResponse>;

export function shareToAddress(
  address: string,
  cid: string,
  auth_token: SignedMessage | JWT,
  shareTo: Array<string>
): Promise<LightHouseSDKResponse>;

export function getJWT(
  address: string,
  signedMessage: SignedMessage,
): Promise<{ JWT: string | null, error: ErrorValue }>

export function transferOwnership(
  address: string,
  cid: string,
  newOwner: string,
  auth_token: SignedMessage | JWT,
  resetSharedTo: boolean
): Promise<LightHouseSDKResponse>;

interface IGetAccessCondition {
  aggregator: string;
  conditions?: {
    id: number;
    chain: string;
    method: string;
    standardContractType: string;
    contractAddress: string;
    returnValueTest: {
      comparator: string;
      value: number;
    };
    parameters: string[];
  }[];
  conditionsSolana: any[]; // You can replace 'any' with a specific type if needed.
  sharedTo: any[]; // You can replace 'any' with a specific type if needed.
  owner: string;
  cid: string;
}


export function getAccessCondition(
  cid: string
): Promise<{ data: IGetAccessCondition }>;