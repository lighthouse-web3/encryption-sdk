const _package = require("..");
const { getAuthMessage } = require("../../getAuthMessage");
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
      "testCid",
      "signature",
      5
    );
    expect(typeof error).toBe("object");
    expect(error?.message).toBe("Invalid Signature");
  }, 20000);

  test("recover Key authorized", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, shards } = await _package.recoverShards(
      signer.address,
      "testCid",
      signedMessage,
      5
    );
    expect(error).toBe(null);
    expect(shards).toEqual([
      { index: 1, key: 1 },
      { index: 1, key: 2 },
      { index: 3, key: 3 },
      { index: 4, key: 4 },
      { index: 5, key: 5 },
    ]);
  }, 20000);

  test("recover Key Unauthorized", async () => {
    const provider = new ethers.getDefaultProvider();
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8a",
      provider
    );
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, shards } = await _package.recoverShards(
      signer.address,
      "testCid",
      signedMessage,
      5
    );
    expect(error?.message).toBe("you don't have access");
    expect(shards).toEqual([]);
  }, 20000);
});
