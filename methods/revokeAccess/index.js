const axios = require("axios");
const { lighthouseBLSNode } = require("../../config");

const isEqual = (...objects) =>
  objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

module.exports.revokeAccess = async (address, cid, signature, revokeTo) => {
  if (!Array.isArray(keyShards) || keyShards.length != 5) {
    throw new Error("keyShards must be an array of 5 objects");
  }
  try {
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map(
      (elem) => `${lighthouseBLSNode}:900${elem}/api/setSharedKey/${elem}`
    );
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url) => {
        return axios.delete(url, {
          data: {
            address,
            cid,
            revokeTo,
          },
          headers: {
            Authorization: "Bearer " + signature,
          },
        });
      })
    );
    return {
      revoked: isEqual(data) && data[0]?.message === "success",
      error: null,
    };
  } catch (err) {
    return {
      revoked: false,
      error: err?.response?.data || err.message,
    };
  }
};
