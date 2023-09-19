const axios = require("axios");
const {
  lighthouseBLSNode,
  isDev,
  lighthouseBLSNodeDev,
} = require("../../config");
const { updateConditionSchema, accessConditionSchema } = require("./validator");
const { isEqual, isCidReg } = require("../../util/index");

module.exports.accessControl = async (
  address,
  cid,
  auth_token,
  conditions,
  aggregator = null,
  chainType = "evm",
  keyShards = [],
  decryptionType = "ADDRESS",
) => {
  try {
    if (!Array.isArray(keyShards) || (keyShards.length != 5 && keyShards.length != 0)) {
      throw new Error("keyShards must be an array of 5 objects");
    }
    if (!isCidReg(cid)) {
      throw new Error("Invalid CID");
    }
    const { error } = keyShards.length == 5 ? accessConditionSchema.validate({
      address,
      cid,
      conditions,
      aggregator,
      decryptionType,
      chainType,
      keyShards
    }) : updateConditionSchema.validate({
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
    const data = keyShards.length == 5 ? await Promise.all(
      nodeUrl.map((url, index) => {
        return axios
          .post(
            url,
            {
              address,
              cid,
              conditions,
              aggregator,
              decryptionType,
              chainType,
              payload: keyShards[index],
            },
            {
              headers: {
                Authorization: "Bearer " + auth_token,
              },
            }
          )
          .then((res) => res.data);
      })
    ) :
      await Promise.all(
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
                  Authorization: "Bearer " + auth_token,
                },
              }
            )
            .then((res) => res.data);
        })
      );
    return {
      isSuccess: isEqual(...data.map(e => e.message)) && data[0]?.message === "success",
      error: null,
    };
  } catch (err) {
    return {
      isSuccess: false,
      error: err?.response?.data || err.message,
    };
  }
};
