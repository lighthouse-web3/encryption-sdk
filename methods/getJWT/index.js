const axios = require("axios");
const {
  lighthouseAuthNode,
  isDev,
  lighthouseBLSNodeDev,
} = require("../../config");

module.exports.getJWT = async (address, payload, useAsRefreshToken = false) => {
  try {
    const data = !useAsRefreshToken ? await axios
      .post(
        `${isDev ? lighthouseBLSNodeDev : lighthouseAuthNode
        }/api/message/get-jwt`,
        { address, signature: payload },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.data) : await axios
        .put(
          `${isDev ? lighthouseBLSNodeDev : lighthouseAuthNode
          }/api/message/get-jwt`,
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
