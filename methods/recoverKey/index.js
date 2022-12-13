let bls = null;
if (typeof window === "undefined") {
  bls = eval("require")("bls-eth-wasm");
} else {
  bls = require("bls-eth-wasm/browser");
}


module.exports.recoverKey = async (keyShards) => {
  if (
    !Array.isArray(keyShards) ||
    !"index" in keyShards[0] ||
    !"key" in keyShards[0]
  ) {
    throw new Error(
      "keyShards must be an array of objects containing these keys [index, key]"
    );
  }
  try {
    let idVec = [];
    let secVec = [];
    await bls.init(bls.BLS12_381);

    keyShards.map((keyShard) => {
      let sk = new bls.SecretKey();
      //convert readable string into secretKey vectors
      sk.deserializeHexStr(keyShard.key);
      secVec.push(sk);

      //convert readable string into Id vectors
      let id = new bls.Id();
      id.deserializeHexStr(keyShard.index);
      idVec.push(id);
    });
    const sec = new bls.SecretKey();

    //recover key
    sec.recover(secVec, idVec);
    let s = sec.serializeToHexStr();
    return { masterKey: s, error: null };
  } catch (err) {
    return { masterKey: null, error: "can't recover Key" };
  }
};
