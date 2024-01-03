import { KeyShard } from "../../types";

let bls: any = null;
if (typeof window === "undefined") {
  bls = eval("require")("bls-eth-wasm");
} else {
  bls = require("bls-eth-wasm/browser");
}

export const recoverKey = async (keyShards: KeyShard[]) => {
  if (
    !Array.isArray(keyShards) ||
    !(typeof keyShards[0].index == "string") ||
    !(typeof keyShards[0].key == "string")
  ) {
    throw new Error(
      "keyShards must be an array of objects containing these keys [index, key]"
    );
  }
  try {
    const idVec: any[] = [];
    const secVec: any[] = [];
    await bls.init(bls.BLS12_381).then(() => bls.getCurveOrder());

    keyShards.map((keyShard) => {
      const sk = new bls.SecretKey();
      //convert readable string into secretKey vectors
      sk.deserializeHexStr(keyShard.key);
      secVec.push(sk);

      //convert readable string into Id vectors
      const id = new bls.Id();
      id.deserializeHexStr(keyShard.index);
      idVec.push(id);
    });
    const sec = new bls.SecretKey();

    //recover key
    sec.recover(secVec, idVec);
    const s = sec.serializeToHexStr();
    return { masterKey: s, error: null };
  } catch (err) {
    return { masterKey: null, error: "can't recover Key" };
  }
};
