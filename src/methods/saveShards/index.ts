import { AuthToken, KeyShard } from "../../types";
import defaultConfig from "../../config";
import { isEqual, isCidReg } from "../../util";
import axios from "axios";


export const saveShards = async (
  address: string,
  cid: string,
  auth_token: AuthToken,
  keyShards: KeyShard[],
  shareTo: string[] = []
) => {
  try {
    if (!Array.isArray(keyShards) || keyShards.length != 5) {
      throw new Error("keyShards must be an array of 5 objects");
    }
    if (!isCidReg(cid)) {
      throw new Error("Invalid CID");
    }
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map((elem) =>
      defaultConfig.isDev
        ? `${defaultConfig.lighthouseBLSNodeDev}:900${elem}/api/setSharedKey/${elem}`
        : `${defaultConfig.lighthouseBLSNode}/api/setSharedKey/${elem}`
    );
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url, index) => {
        return axios
          .post(
            url,
            shareTo.length > 0
              ? {
                address,
                cid,
                payload: keyShards[index],
                sharedTo: shareTo,
              }
              : {
                address,
                cid,
                payload: keyShards[index],
              },
            {
              headers: {
                Authorization: "Bearer " + auth_token,
              },
            }
          )
          .then((res) => res.data);
      })
    );
    let temp = data.map((elem, index) => ({ ...elem, data: null }));
    return {
      isSuccess: isEqual(...temp) && data[0]?.message === "success",
      error: null,
    };
  } catch (err: any) {
    return {
      isSuccess: false,
      error: err?.response?.data || err.message,
    };
  }
};
