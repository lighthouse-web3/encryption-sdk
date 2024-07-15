import { API_NODE_HANDLER } from "../../util";
import { AuthToken, LightHouseSDKResponse } from "../../types";
import { isCidReg, isEqual } from "../../util";

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
      error: "Invalid CID",
    };
  }
  try {
    const nodeIndexSelected = [1, 2, 3, 4, 5];
    const nodeUrl = nodeIndexSelected.map(
      (elem) => `/api/transferOwnership/${elem}`
    );
    // send encryption key
    const requestData = async (url: any) => {
      try {
        const response = await API_NODE_HANDLER(url, "POST", auth_token, {
          address,
          cid,
          newOwner,
          resetSharedTo,
        });
        return response;
      } catch (error: any) {
        return {
          error,
        };
      }
    };
    const data = [];
    for (const [index, url] of nodeUrl.entries()) {
      const response = await requestData(url);
      if (response.error) {
        return {
          isSuccess: false,
          error: JSON.parse(response?.error?.message),
        };
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      data.push(response);
    }
    return {
      isSuccess: isEqual(...data) && data[0]?.message === "success",
      error: null,
    };
  } catch (err: any) {
    return {
      isSuccess: false,
      error: err,
    };
  }
};
