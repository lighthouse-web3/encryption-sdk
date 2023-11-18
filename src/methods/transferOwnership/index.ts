import defaultConfig from "../../config";
import { AuthToken, LightHouseSDKResponse } from "../../types";
import axios from "axios";
const { isEqual, isCidReg } = require("../../util/index");


export const transferOwnership = async (
  address: string,
  cid: string,
  newOwner: string,
  auth_token: AuthToken,
  resetSharedTo = true
): Promise<LightHouseSDKResponse> => {
  try {
    if (!isCidReg(cid)) {
      throw new Error("Invalid CID");
    }
    const nodeIndexSelected = [1, 2, 3, 4, 5];
    const nodeUrl = nodeIndexSelected.map((elem) =>
      defaultConfig.isDev
        ? `${defaultConfig.lighthouseBLSNodeDev}:900${elem}/api/transferOwnership/${elem}`
        : `${defaultConfig.lighthouseBLSNode}/api/transferOwnership/${elem}`
    );
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url) => {
        return axios
          .post(
            url,
            {
              address,
              cid,
              newOwner,
              resetSharedTo
            },
            {
              headers: {
                Authorization: "Bearer " + auth_token,
              },
            }
          )
          .then((res) => {
            return res?.data;
          });
      })
    );
    return {
      isSuccess: isEqual(...data) && data[0]?.message === "success",
      error: null,
    };
  } catch (err: any) {
    return {
      isSuccess: false,
      error: err?.response?.data || err.message,
    };
  }
};
