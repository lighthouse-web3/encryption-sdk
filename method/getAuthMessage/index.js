const axios = require("axios");

module.exports.getAuthMessage = async (address) => {
  try {
    const data = await axios
      .get(
        `https://auth-node2-6dfb3ddm2a-el.a.run.app/api/message/${address}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.data[0].message);
    return { message: data, error: {} };
  } catch (err) {
    return { message: {}, error: err?.response?.data || err.message };
  }
};
