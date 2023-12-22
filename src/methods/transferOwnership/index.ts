import { API_NODE_HANDLER } from "../../util";
import { AuthToken, LightHouseSDKResponse } from "../../types";
const { isEqual, isCidReg } = require("../../util/index");


export const transferOwnership = async (
  address: string,
  cid: string,
  newOwner: string,
  auth_token: AuthToken,
  resetSharedTo = true
): Promise<LightHouseSDKResponse> => {
  if (!isCidReg(cid)) {
    return {
      isSuccess: false,
      error: "Invalid CID"
    };
  }
  try {
    const nodeIndexSelected = [1, 2, 3, 4, 5];
    const nodeUrl = nodeIndexSelected.map((elem) => `/api/transferOwnership/${elem}`);
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url) => {
        return API_NODE_HANDLER
          (
            url, "POST", auth_token,
            {
              address,
              cid,
              newOwner,
              resetSharedTo
            },
          )
      })
    );
    return {
      isSuccess: isEqual(...data) && data[0]?.message === "success",
      error: null,
    };
  } catch (err: any) {
    console.log({ err })
    return {
      isSuccess: false,
      error: JSON.parse(err.message),
    };
  }
};
