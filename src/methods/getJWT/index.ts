import { API_NODE_HANDLER } from "../../util";

export const getJWT = async (address: string, payload: string, useAsRefreshToken = false, chain = "ALL") => {
  try {
    const data = !useAsRefreshToken ? await API_NODE_HANDLER
      (
        `/api/message/get-jwt`, "POST", "",
        { address, signature: payload, chain },

      ) : await API_NODE_HANDLER
        (
          `/api/message/get-jwt`, "PUT", "",
          { address, refreshToken: payload },
        );
    return { JWT: data.token, refreshToken: data.refreshToken, error: null };
  } catch (err) {
    return { JWT: null, error: "Invalid Signature" };
  }
};
