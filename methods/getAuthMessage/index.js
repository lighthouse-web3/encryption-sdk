const axios = require("axios");
const {
  lighthouseAuthNode,
  isDev,
  lighthouseBLSNodeDev,
} = require("../../config");

module.exports.getAuthMessage = async (address) => {
  try {
    const data = await axios
      .get(
        `${
          isDev ? lighthouseBLSNodeDev : lighthouseAuthNode
        }/api/message/${address}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.data[0].message);
    return { message: data, error: null };
  } catch (err) {
    return { message: null, error: err?.response?.data || err.message };
  }
};
