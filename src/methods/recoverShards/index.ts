import { API_NODE_HANDLER } from "../../util";
import { AuthToken } from "../../types";
import { RecoverShards } from "../../types";

function shuffleArray(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function randSelect(k: number, n: number): number[] {
  if (k > n) {
    throw new Error("k cannot be greater than n");
  }

  const numbers = Array.from({ length: n }, (_, i) => i + 1);
  const shuffledNumbers = shuffleArray(numbers);
  return shuffledNumbers.slice(0, k).sort((a, b) => a - b);
}

export const recoverShards = async (
  address: string,
  cid: string,
  auth_token: AuthToken,
  numOfShards = 3,
  dynamicData = {}
): Promise<RecoverShards> => {
  try {
    const nodeIndexSelected = randSelect(numOfShards, 5);
    const nodeUrl = nodeIndexSelected.map(
      (elem) => `/api/retrieveSharedKey/${elem}`
    );
    // send encryption key
    const requestData = async (url: any, index: any) => {
      try {
        const response = await API_NODE_HANDLER(url, "POST", auth_token, {
          address,
          cid,
          dynamicData,
        });
        return response?.payload;
      } catch (error: any) {
        return {
          error,
        };
      }
    };
    const recoveredShards = [];
    for (const [index, url] of nodeUrl.entries()) {
      const response = await requestData(url, index);
      if (response.error) {
        return {
          shards: [],
          error: JSON.parse(response?.error?.message),
        };
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      recoveredShards.push(response);
    }
    return {
      shards: recoveredShards,
      error: null,
    };
  } catch (err: any) {
    if (err.message.includes("null")) {
      return {
        shards: [],
        error: `cid not found`,
      };
    }
    return {
      shards: [],
      error: JSON.parse(err?.message),
    };
  }
};
