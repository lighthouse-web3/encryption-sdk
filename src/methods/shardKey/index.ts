let bls: any = null;
////@ts-expect-error
if (typeof window === "undefined") {
  bls = eval("require")("bls-eth-wasm");
} else {
  bls = require("bls-eth-wasm/browser");
}

export const shardKey = async (key: string, threshold = 3, keyCount = 5) => {
  try {
    let msk = [];
    let idVec: any[] = [];
    let secVec = [];
    await bls.init(bls.BLS12_381);
    let masterKey = new bls.SecretKey();
    masterKey.deserializeHexStr(key);
    msk.push(masterKey);

    for (let i = 0; i < threshold; i++) {
      let sk = new bls.SecretKey();
      sk.setByCSPRNG();
      msk.push(sk);
    }

    /*
    key sharing
    */
    for (let i = 0; i < keyCount; i++) {
      //create random Vector ID(points on the ECC)
      let id = new bls.Id();
      id.setByCSPRNG();
      idVec.push(id);

      //Create a secKey Shard
      let sk = new bls.SecretKey();
      sk.share(msk, idVec[i]);
      secVec.push(sk);
    }

    //Convert vector in to readable hex values
    return {
      isShardable: true,
      keyShards:
        secVec?.map((sk, index) => ({
          key: sk.serializeToHexStr(),
          index: idVec[index].serializeToHexStr(),
        })) ?? [],
    };
  } catch (e) {
    return { isShardable: false, keyShards: [] };
  }
};
