import { API_NODE_HANDLER } from "../../util";
import { AuthToken } from "../../types";
import { RecoverShards } from "../../types";

function randRange(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}
function randSelect(k: number, n: number) {
  const a = [];
  let prev = -1;
  for (let i = 0; i < k; i++) {
    const v = randRange(prev + 1, n - (k - i) + 1);
    a.push(v);
    prev = v;
  }
  return a;
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
    const recoveredShards = await Promise.all(
      nodeUrl.map((url) => {
        return API_NODE_HANDLER(url, "POST", auth_token, {
          address,
          cid,
          dynamicData,
        }).then((data) => {
          return data?.payload;
        });
      })
    );
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
      error: JSON.parse(err.message),
    };
  }
};
