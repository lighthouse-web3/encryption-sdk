const axios = require("axios");

module.exports.transferOwnership = async (
  address,
  cid,
  newOwner,
  auth_token,
  resetSharedTo = true
) => {
  try {
    const nodeIndexSelected = [1, 2, 3, 4, 5];
    const nodeUrl = nodeIndexSelected.map((elem) =>
      isDev
        ? `${lighthouseBLSNodeDev}:900${elem}/api/transferOwnership/${elem}`
        : `${lighthouseBLSNode}/api/transferOwnership/${elem}`
    );
    // send encryption key
    const recoveredShards = await Promise.all(
      nodeUrl.map((url) => {
        return axios
          .post(
            url,
            {
              address,
              cid,
              newOwner,
              resetSharedTo
            },
            {
              headers: {
                Authorization: "Bearer " + auth_token,
              },
            }
          )
          .then((res) => {
            return res?.data?.payload;
          });
      })
    );
    return {
      shards: recoveredShards,
      error: null,
    };
  } catch (err) {
    if (err?.response?.data?.message.includes("null")) {
      return {
        shards: [],
        error: `cid not found`,
      };
    }
    return {
      shards: [],
      error: err?.response?.data || err.message,
    };
  }
};
