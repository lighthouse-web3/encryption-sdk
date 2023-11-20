import { GeneratedKey } from "../../types";

let bls: any = null;
////@ts-expect-error
if (typeof window === "undefined") {
  bls = eval("require")("bls-eth-wasm");
} else {
  bls = require("bls-eth-wasm/browser");
}

export const generate = async (threshold = 3, keyCount = 5): Promise<GeneratedKey> => {
  if (threshold > keyCount) {
    throw new Error("keyCount must be greater then threshold");
  }

  let msk: any = [];
  let idVec: any = [];
  let secVec: any = [];

  await bls.init(bls.BLS12_381);

  /*
  setup master secret key
  */

  // other members of the array ingredients used in the algorithm
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

  if (secVec.length !== idVec.length)
    throw new Error("key vector Length don't match");

  //Convert vector in to readable hex values
  return {
    masterKey: msk[0]?.serializeToHexStr(),
    keyShards:
      secVec?.map((sk: any, index: any) => ({
        key: sk.serializeToHexStr(),
        index: idVec[index].serializeToHexStr(),
      })) ?? [],
  };
};