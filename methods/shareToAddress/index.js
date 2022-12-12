const axios = require("axios");
const {
  lighthouseBLSNode,
  isDev,
  lighthouseBLSNodeDev,
} = require("../../config");

const isEqual = (...objects) =>
  objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

module.exports.shareToAddress = async (
  address,
  cid,
  signedMessage,
  shareTo
) => {
  try {
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map((elem) =>
      isDev
        ? `${lighthouseBLSNodeDev}:900${elem}/api/setSharedKey/${elem}`
        : `${lighthouseBLSNode}/api/setSharedKey/${elem}`
    );
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url) => {
        return axios
          .put(
            url,
            {
              address,
              cid: cid,
              shareTo,
            },
            {
              headers: {
                Authorization: "Bearer " + signedMessage,
              },
            }
          )
          .then((res) => res.data);
      })
    );
    let temp = data.map((elem, index) => ({ ...elem, data: null }));
    return {
      isSuccess: isEqual(...temp) && temp[0]?.message === "success",
      error: null,
    };
  } catch (err) {
    return {
      isSuccess: false,
      error: err?.response?.data || err.message,
    };
  }
};
