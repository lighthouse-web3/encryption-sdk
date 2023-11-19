import axios from "axios";
import defaultConfig from "../../config";

export const getJWT = async (address: string, payload: string, useAsRefreshToken = false) => {
  try {
    const data = !useAsRefreshToken ? await axios
      .post(
        `${defaultConfig.isDev ? defaultConfig.lighthouseBLSNodeDev : defaultConfig.lighthouseAuthNode}/api/message/get-jwt`,
        { address, signature: payload },
      )
      .then((res) => res.data) : await axios
        .put(
          `${defaultConfig.isDev ? defaultConfig.lighthouseBLSNodeDev : defaultConfig.lighthouseAuthNode}/api/message/get-jwt`,
          { address, refreshToken: payload },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res.data);
    return { JWT: data.token, refreshToken: data.refreshToken, error: null };
  } catch (err) {
    return { JWT: null, error: "Invalid Signature" };
  }
};
