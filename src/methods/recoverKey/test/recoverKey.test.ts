import _package from "../..";
import { generate } from "../../generate";

describe("recover key", () => {
  test("generate and Recover Key", async () => {
    const { masterKey, keyShards } = await generate();
    const { masterKey: msk, error } = await _package.recoverKey(keyShards);
    expect(msk).toEqual(masterKey);
  }, 20000);
});
