const axios = require("axios");
const {
  lighthouseBLSNode,
  isDev,
  lighthouseBLSNodeDev,
} = require("../../config");

function randRange(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}
const randSelect = (k, n) => {
  const a = [];
  let prev = -1;
  for (let i = 0; i < k; i++) {
    let v = randRange(prev + 1, n - (k - i) + 1);
    a.push(v + 1);
    prev = v;
  }
  return a;
};

module.exports.recoverShards = async (
  address,
  cid,
  signature,
  numOfShards = 3
) => {
  try {
    const nodeIndexSelected = randSelect(numOfShards, 5);
    const nodeUrl = nodeIndexSelected.map((elem) =>
      isDev
        ? `${lighthouseBLSNodeDev}:900${elem}/api/retrieveSharedKey/${elem}`
        : `${lighthouseBLSNode}/api/retrieveSharedKey/${elem}`
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
            },
            {
              headers: {
                Authorization: "Bearer " + signature,
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
