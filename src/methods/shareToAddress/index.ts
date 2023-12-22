import { API_NODE_HANDLER } from "../../util";
import { AuthToken, LightHouseSDKResponse } from "../../types";
const { isEqual, isCidReg } = require("../../util/index");

export const shareToAddress = async (
  address: string,
  cid: string,
  auth_token: AuthToken,
  shareTo: Array<string>
): Promise<LightHouseSDKResponse> => {
  if (!isCidReg(cid)) {
    return {
      isSuccess: false,
      error: "Invalid CID"
    };
  }
  try {
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map((elem) => `/api/setSharedKey/${elem}`);
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url) => {
        return API_NODE_HANDLER
          (
            url, "PUT", auth_token,
            {
              address,
              cid: cid,
              shareTo,
            },
          )
      })
    );
    let temp = data.map((elem, index) => ({ ...elem, data: null }));
    return {
      isSuccess: isEqual(...temp) && temp[0]?.message === "success",
      error: null,
    };
  } catch (err: any) {
    return {
      isSuccess: false,
      error: JSON.parse(err.message),
    };
  }
};
