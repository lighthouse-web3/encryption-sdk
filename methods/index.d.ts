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

export type generateInput = {
  threshold?: number;
  keyCount?: number;
};
export function generate(
  threshold?: number,
  keyCount?: number
): Promise<generatedKey>;

export type AuthMessage = {
  message: string | null;
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

export function revokeAccess(
  address: string,
  cid: string,
  signature: string,
  revokeTo: string[]
): Promise<{ error: ErrorValue; revoked: boolean }>;

export function recoverShards(
  address: string,
  cid: string,
  signature: string,
  numOfShards?: number
): Promise<RecoverShards>;

export function saveShards(
  address: string,
  cid: string,
  signature: string,
  keyShards: keyShard[],
  shareTo: string[]
): Promise<{
  isSaved: boolean;
  error: ErrorValue;
}>;

export function shardKey(key:string,): Promise<{
  isShardable: boolean;
  keyShards: keyShard[] ;
}>;
