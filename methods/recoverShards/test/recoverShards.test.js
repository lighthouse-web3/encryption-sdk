const _package = require("..");
const { getAuthMessage } = require("../../getAuthMessage");
const { saveShards } = require("../../saveShards");
const ethers = require("ethers");

describe("recover Shards", () => {
  let signer;

  beforeAll(async () => {
    const provider = new ethers.getDefaultProvider();
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
      provider
    );
  });

  test("Invalid Signature", async () => {
    const { error } = await _package.recoverShards(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQA",
      "signature",
      5
    );
    expect(typeof error).toBe("object");
    expect(error?.message).toBe("Invalid Signature");
  }, 20000);

  test("save Key", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, isSuccess } = await saveShards(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQA",
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

  test("recover Key authorized", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, shards } = await _package.recoverShards(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQA",
      signedMessage,
      5
    );

    expect(error).toBe(null);
    expect(shards).toEqual([
      { index: "1", key: "1" },
      { index: "2", key: "2" },
      { index: "3", key: "3" },
      { index: "4", key: "4" },
      { index: "5", key: "5" },
    ]);
  }, 20000);

  test("missing Cid", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, shards } = await _package.recoverShards(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQZ",
      signedMessage
    );

    expect(error).toMatch(/cid not found/i);
    expect(shards).toEqual([]);
  }, 20000);

  test("recover Key Unauthorized", async () => {
    const provider = new ethers.getDefaultProvider();
    let signer2 = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8f",
      provider
    );
    const authMessage = await getAuthMessage(signer2.address);
    const signedMessage2 = await signer2.signMessage(authMessage.message);

    const { error, shards } = await _package.recoverShards(
      signer2.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQA",
      signedMessage2,
      5
    );
    expect(shards).toEqual([]);
    expect(error?.message).toBe("you don't have access");
  }, 20000);
});
