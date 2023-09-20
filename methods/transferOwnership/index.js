const axios = require("axios");
const {
  lighthouseBLSNode,
  lighthouseBLSNodeDev,
  isDev,
} = require("../../config");
const { isEqual, isCidReg } = require("../../util/index");


module.exports.transferOwnership = async (
  address,
  cid,
  newOwner,
  auth_token,
  resetSharedTo = true
) => {
  try {
    if (!isCidReg(cid)) {
      throw new Error("Invalid CID");
    }
    const nodeIndexSelected = [1, 2, 3, 4, 5];
    const nodeUrl = nodeIndexSelected.map((elem) =>
      isDev
        ? `${lighthouseBLSNodeDev}:900${elem}/api/transferOwnership/${elem}`
        : `${lighthouseBLSNode}/api/transferOwnership/${elem}`
    );
    // send encryption key
    const data = await Promise.all(
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
            return res?.data;
          });
      })
    );
    return {
      isSuccess: isEqual(...data) && data[0]?.message === "success",
      error: null,
    };
  } catch (err) {
    return {
      isSuccess: false,
      error: err?.response?.data || err.message,
    };
  }
};
