const axios = require("axios");
const {
  lighthouseBLSNode,
  isDev,
  lighthouseBLSNodeDev,
} = require("../../config");
const { updateConditionSchema } = require("./validator");
const { isEqual, isCidReg } = require("../../util/index");

module.exports.accessControl = async (
  address,
  cid,
  signedMessage,
  conditions,
  aggregator = null,
  chainType = "evm"
) => {
  try {
    if (!isCidReg) {
      throw new Error("Invalid CID");
    }
    const { error } = updateConditionSchema.validate({
      address,
      cid,
      conditions,
      aggregator,
      chainType,
    });

    if (error) {
      throw new Error(`Condition validation error: ${error.message}`);
    }
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map((elem) =>
      isDev
        ? `${lighthouseBLSNodeDev}:900${elem}/api/fileAccessConditions/${elem}`
        : `${lighthouseBLSNode}/api/fileAccessConditions/${elem}`
    );
    // send encryption key
    const data = await Promise.all(
      nodeUrl.map((url) => {
        return axios
          .put(
            url,
            {
              address,
              cid,
              conditions,
              aggregator,
              chainType,
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
