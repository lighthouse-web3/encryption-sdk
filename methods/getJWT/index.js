const axios = require("axios");
const {
  lighthouseAuthNode,
  isDev,
  lighthouseBLSNodeDev,
} = require("../../config");

module.exports.getJWT = async (address,signature) => {
  try {
    const data = await axios
      .post(
        `${
          isDev ? lighthouseBLSNodeDev : lighthouseAuthNode
        }/api/message/get-jwt`,
        {address,signature},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.data?.token);
    return { JWT: data, error: null };
  } catch (err) {
    return { JWT: null, error: "Invalid Signature" };
  }
};
