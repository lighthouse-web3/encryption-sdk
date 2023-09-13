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

export type SignedMessage=string;
export type JWT=WithPrefix<'jwt:'>;

export function recoverShards(
  address: string,
  cid: string,
  authSignedMessage: SignedMessage|JWT,
  numOfShards?: number
): Promise<RecoverShards>;

export type LightHouseSDKResponse = {
  isSuccess: boolean;
  error: ErrorValue;
};

export function saveShards(
  address: string,
  cid: string,
  authSignedMessage: SignedMessage|JWT,
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
  authSignedMessage: SignedMessage|JWT,
  revokeTo: Array<string>
): Promise<LightHouseSDKResponse>;

export type ChainType = "EVM" | "evm" | "solana" | "SOLANA";
export type DecryptionType = "ADDRESS"| "ACCESS_CONDITIONS";

export function accessControl(
  address: string,
  cid: string,
  authSignedMessage: SignedMessage|JWT,
  conditions: { [key: string]: any },
  aggregator?: string,
  chainType?: ChainType,
  keyShards?: keyShard[],
  decryptionType?: DecryptionType
): Promise<LightHouseSDKResponse>;

export function shareToAddress(
  address: string,
  cid: string,
  authSignedMessage: SignedMessage|JWT,
  shareTo: Array<string>
): Promise<LightHouseSDKResponse>;

export function getJWT(
address:string,
signedMessage: SignedMessage,
):Promise<{JWT:string|null,error:ErrorValue}>
