import defaultConfig from "../../config";
import { AuthToken } from "../../types";
import axios from "axios";
import { RecoverShards } from "../../types"


function randRange(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}
const randSelect = (k: number, n: number) => {
  const a = [];
  let prev = -1;
  for (let i = 0; i < k; i++) {
    let v = randRange(prev + 1, n - (k - i) + 1);
    a.push(v + 1);
    prev = v;
  }
  return a;
};

export const recoverShards = async (
  address: string,
  cid: string,
  auth_token: AuthToken,
  numOfShards = 3,
  dynamicData = {}
): Promise<RecoverShards> => {
  try {
    const nodeIndexSelected = randSelect(numOfShards, 5);
    const nodeUrl = nodeIndexSelected.map((elem) =>
      defaultConfig.isDev
        ? `${defaultConfig.lighthouseBLSNodeDev}:900${elem}/api/retrieveSharedKey/${elem}`
        : `${defaultConfig.lighthouseBLSNode}/api/retrieveSharedKey/${elem}`
    );
    // send encryption key
    const recoveredShards = await Promise.all(
      nodeUrl.map((url) => {
        return axios
          .post(
            url,
            {
              address,
              cid,
              dynamicData
            },
            {
              headers: {
                Authorization: "Bearer " + auth_token,
              },
            }
          )
          .then((res) => {
            return res?.data?.payload;
          });
      })
    );
    return {
      shards: recoveredShards,
      error: null,
    };
  } catch (err: any) {
    if (err?.response?.data?.message.includes("null")) {
      return {
        shards: [],
        error: `cid not found`,
      };
    }
    return {
      shards: [],
      error: err?.response?.data || err.message,
    };
  }
};
