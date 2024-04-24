import { AuthToken, KeyShard } from "../../types";
import { API_NODE_HANDLER } from "../../util";
import { isEqual, isCidReg } from "../../util";

export const saveShards = async (
  address: string,
  cid: string,
  auth_token: AuthToken,
  keyShards: KeyShard[],
  shareTo: string[] = []
) => {
  if (!isCidReg(cid)) {
    return {
      isSuccess: false,
      error: "Invalid CID",
    };
  }
  if (!Array.isArray(keyShards) || keyShards.length != 5) {
    return {
      isSuccess: false,
      error: "keyShards must be an array of 5 objects",
    };
  }
  const nodeId = [1, 2, 3, 4, 5];
  const nodeUrl = nodeId.map((elem) => `/api/setSharedKey/${elem}`);
  const requestData = async (url: any, index: any) => {
    try {
      return await API_NODE_HANDLER(
        url,
        "POST",
        auth_token,
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
            }
      );
    } catch (error) {
      return { error };
    }
  };
  const data = [];
  for (const [index, url] of nodeUrl.entries()) {
    const response = await requestData(url, index);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.push(response);
  }
  const temp = data.map((elem, index) => ({ ...elem, data: null }));
  return {
    isSuccess: isEqual(...temp) && data[0]?.message === "success",
    error: null,
  };
};
