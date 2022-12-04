const _package = require("..");
const { getAuthMessage } = require("../../getAuthMessage");
const ethers = require("ethers");

describe("saveShards", () => {
  let signer;

  beforeAll(async () => {
    const provider = new ethers.getDefaultProvider();
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
      provider
    );
  });

  test("Invalid Signature", async () => {
    const { error } = await _package.saveShards(
      signer.address,
      "testCid",
      "signature",
      [
        { key: 1, index: 1 },
        { key: 2, index: 1 },
        { key: 3, index: 3 },
        { key: 4, index: 4 },
        { key: 5, index: 5 },
      ]
    );
    expect(typeof error).toBe("object");
    expect(error?.message).toBe("Invalid Signature");
  }, 20000);

  test("save Key", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, isSaved } = await _package.saveShards(
      signer.address,
      "testCid",
      signedMessage,
      [
        { key: 1, index: 1 },
        { key: 2, index: 1 },
        { key: 3, index: 3 },
        { key: 4, index: 4 },
        { key: 5, index: 5 },
      ]
    );
    expect(isSaved).toBe(true);
    expect(error).toBe(null);
  }, 20000);
});
