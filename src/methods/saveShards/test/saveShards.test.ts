import _package from "../.."
import { getAuthMessage } from "../../getAuthMessage"
import { ethers } from "ethers"

describe("saveShards", () => {
  let signer;

  beforeAll(async () => {
    const provider = ethers.getDefaultProvider("mainnet");
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
      provider
    );
  });

  test("Invalid Signature", async () => {
    const { error } = await _package.saveShards(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      "signature",
      [
        { key: "1", index: "1" },
        { key: "2", index: "2" },
        { key: "3", index: "3" },
        { key: "4", index: "4" },
        { key: "5", index: "5" },
      ]
    );
    expect(typeof error).toBe("object");
    expect(error?.message).toBe("Invalid Signature");
  }, 20000);

  test("save Key", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, isSuccess } = await _package.saveShards(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      signedMessage,
      [
        { key: "1", index: "1" },
        { key: "2", index: "2" },
        { key: "3", index: "3" },
        { key: "4", index: "4" },
        { key: "5", index: "5" },
      ]
    );
    expect(isSuccess).toBe(true);
    expect(error).toBe(null);
  }, 20000);

  test("save Key", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, isSuccess } = await _package.saveShards(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQJ",
      signedMessage,
      [
        { key: "1", index: "1" },
        { key: "2", index: "2" },
        { key: "3", index: "3" },
      ]
    );
    expect(isSuccess).toBe(false);
    expect(error).toMatch(/keyShards must be an array of 5 objects/i);
  }, 20000);

  test("invalid Cid", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, isSuccess } = await _package.saveShards(
      signer.address,
      "cid",
      signedMessage,
      [
        { key: "1", index: "1" },
        { key: "2", index: "2" },
        { key: "3", index: "3" },
        { key: "4", index: "4" },
        { key: "5", index: "5" },
      ]
    );
    expect(isSuccess).toBe(false);
    expect(error).toMatch(/invalid Cid/i);
  }, 20000);
});
