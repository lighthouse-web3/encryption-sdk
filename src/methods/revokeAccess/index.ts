import defaultConfig from "../../config";
import { AuthToken, LightHouseSDKResponse } from "../../types";
import axios from "axios";

const { isEqual, isCidReg } = require("../../util/index");

export const revokeAccess = async (address: string, cid: string, auth_token: AuthToken, revokeTo: Array<string>): Promise<LightHouseSDKResponse> => {
  try {
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
      nodeUrl.map((url) => {
        return axios
          .delete(url, {
            data: {
              address,
              cid,
              revokeTo,
            },
            headers: {
              Authorization: "Bearer " + auth_token,
            },
          })
          .then((res: any) => res.data);
      })
    );
    let temp = data.map((elem, index) => ({ ...elem, data: null }));
    return {
      isSuccess: isEqual(...temp),
      error: null,
    };
  } catch (err: any) {
    return {
      isSuccess: false,
      error: err?.response?.data || err.message,
    };
  }
};
