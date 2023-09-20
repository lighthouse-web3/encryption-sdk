const axios = require("axios");
const {
    lighthouseBLSNode,
    lighthouseBLSNodeDev,
    isDev,
} = require("../../config");
const { isEqual, isCidReg } = require("../../util/index");


module.exports.getAccessCondition = async (cid) => {
    try {
        const conditions = await axios.get((
            isDev
                ? `${lighthouseBLSNodeDev}:9001`
                : `${lighthouseBLSNode}`
        ) +
            `/api/fileAccessConditions/get/${cid}`
        )

        return { data: conditions.data }
    } catch (error) {
        throw new Error(error.message)
    }
}
