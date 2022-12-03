let bls = null;
if (typeof window === "undefined") {
  bls = eval("require")("bls-eth-wasm");
} else {
  bls = require("bls-eth-wasm/browser");
}

module.exports.shadKey = async (key, k = 5, n = 3) => {
  try {
    let msk = [];
    let idVec = [];
    let secVec = [];
    await bls.init(bls.BLS12_381);
    let masterKey = new bls.SecretKey();
    masterKey.deserializeHexStr(key);
    msk.push(masterKey);

    for (let i = 0; i < k; i++) {
      let sk = new bls.SecretKey();
      sk.setByCSPRNG();
      msk.push(sk);
    }

    /*
    key sharing
    */
    for (let i = 0; i < n; i++) {
      //create random Vector ID(points on the ECC)
      let id = new bls.Id();
      id.setByCSPRNG();
      idVec.push(id);

      //Create a secKey Shade
      let sk = new bls.SecretKey();
      sk.share(msk, idVec[i]);
      secVec.push(sk);
    }

    //Convert vector in to readable hex values
    var secData = secVec.map((sk) => sk.serializeToHexStr());
    var idData = idVec.map((id) => id.serializeToHexStr());
    return {
      isKeyShadable: true,
      keyShades: secData,
      idData: idData,
    };
  } catch (e) {
    return { isKeyShadable: false, keyShades: [], idData: [] };
  }
};
