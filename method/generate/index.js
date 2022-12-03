let bls = null;
if (typeof window === "undefined") {
  bls = eval("require")("bls-eth-wasm");
} else {
  bls = require("bls-eth-wasm/browser");
}

module.exports.generateKey = async (k = 5, n = 3) => {
  let msk = [];
  let idVec = [];
  let secVec = [];

  await bls.init(bls.BLS12_381);

  /*
  setup master secret key
  */

  // other members of the array ingredients used in the algorithm
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
    masterKey: msk[0].serializeToHexStr(),
    keyShades: secData,
    idData: idData,
  };
};
