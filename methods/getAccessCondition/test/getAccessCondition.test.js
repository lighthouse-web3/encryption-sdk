const _package = require("../..");
const { ethers } = require("ethers");
jest.setTimeout(60000);


describe("get AccessCondition", () => {
  let signer, signer2;

  beforeAll(async () => {
    const provider = new ethers.getDefaultProvider();
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
      provider
    );
    signer2 = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8a",
      provider
    );
  });

  test("transfer Ownership to address", async () => {
    const { data } = await _package.getAccessCondition(
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
    );
    expect(data.aggregator).toBe("([2] and [1])");
    expect(data.owner).toBe("0xeaf4e24ffc1a2f53c07839a74966a6611b8cb8a1");
  }, 20000);


});
