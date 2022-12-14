const axios = require("axios");
const {
  lighthouseBLSNode,
  lighthouseBLSNodeDev,
  isDev,
} = require("../../config");
const { isEqual, isCidReg } = require("../../util/index");

module.exports.saveShards = async (
  address,
  cid,
  signature,
  keyShards,
  shareTo = []
) => {
  try {
    if (!Array.isArray(keyShards) || keyShards.length != 5) {
      throw new Error("keyShards must be an array of 5 objects");
    }
    if (!isCidReg(cid)) {
      throw new Error("Invalid CID");
    }
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map((elem) =>
      isDev
        ? `${lighthouseBLSNodeDev}:900${elem}/api/setSharedKey/${elem}`
        : `${lighthouseBLSNode}/api/setSharedKey/${elem}`
    );
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url, index) => {
        return axios
          .post(
            url,
            shareTo.length > 0
              ? {
                  address,
                  cid,
                  payload: keyShards[index],
                  sharedTo: shareTo,
                }
              : {
                  address,
                  cid,
                  payload: keyShards[index],
                },
            {
              headers: {
                Authorization: "Bearer " + signature,
              },
            }
          )
          .then((res) => res.data);
      })
    );
    let temp = data.map((elem, index) => ({ ...elem, data: null }));
    return {
      isSuccess: isEqual(...temp) && data[0]?.message === "success",
      error: null,
    };
  } catch (err) {
    return {
      isSuccess: false,
      error: err?.response?.data || err.message,
    };
  }
};
