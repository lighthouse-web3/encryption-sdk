import { API_NODE_HANDLER } from "../../util";
import { AuthToken, LightHouseSDKResponse } from "../../types";
import { isCidReg, isEqual } from "../../util";

export const revokeAccess = async (
  address: string,
  cid: string,
  auth_token: AuthToken,
  revokeTo: Array<string>
): Promise<LightHouseSDKResponse> => {
  if (!isCidReg(cid)) {
    return {
      isSuccess: false,
      error: "Invalid CID",
    };
  }
  try {
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map((elem) => `/api/setSharedKey/${elem}`);

    // send encryption key
    const requestData = async (url: any) => {
      try {
        const response = await API_NODE_HANDLER(url, "DELETE", auth_token, {
          address,
          cid,
          revokeTo,
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
    const temp = data.map((elem, index) => ({ ...elem, data: null }));
    return {
      isSuccess: isEqual(...temp),
      error: null,
    };
  } catch (err: any) {
    return {
      isSuccess: false,
      error: err,
    };
  }
};
