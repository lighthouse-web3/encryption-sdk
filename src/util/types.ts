// Key Shard Interface
export interface KeyShard {
    key: string;
    index: string;
}

// Error Value Type
export type ErrorValue = string | string[] | number | boolean | null | object | any;

// Generated Key Interface
export interface GeneratedKey {
    masterKey: string | null;
    keyShards: Array<KeyShard>;
}

// Generate Input Interface
export interface GenerateInput {
    threshold?: number;
    keyCount?: number;
}

// Auth Message Interface
export interface AuthMessage {
    message: string | null;
    error: string | ErrorValue | null;
}

// Recovered Key Interface
export interface RecoveredKey {
    masterKey: string | null;
    error: string | ErrorValue | null;
}

// Recover Shards Interface
export interface RecoverShards {
    shards: KeyShard[];
    error: ErrorValue;
}

// WithPrefix Type
type WithPrefix<T extends string> = `${T}${string}`;

export type SignedMessage = string;
export type JWT = WithPrefix<'jwt:'>;

export type AuthToken = SignedMessage | JWT
// LightHouse SDK Response Interface
export interface LightHouseSDKResponse {
    isSuccess: boolean;
    error: ErrorValue;
}

// ChainType and DecryptionType Types
export type ChainType = "EVM" | "evm" | "solana" | "SOLANA";
export type DecryptionType = "ADDRESS" | "ACCESS_CONDITIONS";

export interface ReturnValueTest {
    comparator: '==' | '>=' | '<=' | '!=' | '>' | '<';
    value: number | string | Array<any>;
}

export interface EVMCondition {
    id: number;
    standardContractType: 'ERC20' | 'ERC721' | 'ERC1155' | 'Custom' | '';
    contractAddress?: string;
    chain: string;
    method: string;
    parameters?: Array<any>;
    returnValueTest: ReturnValueTest;
    inputArrayType?: Array<string>;
    outputType?: string;
}

export interface SolanaCondition {
    id: number;
    contractAddress?: string;
    chain: string;
    method: string;
    standardContractType: 'spl-token' | '';
    parameters?: Array<any>;
    pdaInterface: {
        offset?: number;
        selector?: string;
    };
    returnValueTest: ReturnValueTest;
}

export type Condition = EVMCondition | SolanaCondition;

export interface UpdateConditionSchema {
    chainType: 'EVM' | 'SOLANA';
    conditions: Condition[];
    decryptionType: 'ADDRESS' | 'ACCESS_CONDITIONS';
    address: string;
    cid: string;
    aggregator?: string;
}

export interface AccessConditionSchema extends UpdateConditionSchema {
    keyShards: Array<any>; // Define the structure of key shards if available
}


// Get Access Condition Interface
export interface IGetAccessCondition {
    aggregator: string;
    conditions?: Condition[];
    conditionsSolana: any[]; // Replace 'any' with a specific type if needed.
    sharedTo: any[]; // Replace 'any' with a specific type if needed.
    owner: string;
    cid: string;
}
