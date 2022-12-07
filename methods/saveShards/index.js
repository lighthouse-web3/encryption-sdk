const axios = require("axios");
const { lighthouseBLSNode } = require("../../config");

const isEqual = (...objects) =>
  objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));

module.exports.saveShards = async (
  address,
  cid,
  signature,
  keyShards,
  shareTo = []
) => {
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
      nodeUrl.map((url, index) => {
        return axios
          .post(
            url,
            {
              address,
              cid,
              payload: keyShards[index],
              shareTo,
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
      isSaved: isEqual(...temp) && data[0]?.message === "success",
      error: null,
    };
  } catch (err) {
    return {
      isSaved: false,
      error: err?.response?.data || err.message,
    };
  }
};
