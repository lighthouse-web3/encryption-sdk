import _package from "../.."
import {ethers} from "ethers"


describe("get AccessCondition", () => {
  let signer, signer2;
  jest.setTimeout(60000);

  beforeAll(async () => {
    // const provider = ethers.getDefaultProvider("mainnet");
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
    );
    signer2 = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8a",
    );
  });

  test("verify Access", async () => {
    const { data } = await _package.getAccessCondition(
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
    );
    expect(data.aggregator).toBe("([2] and [1])");
    expect(data.owner).toBe("0xeaf4e24ffc1a2f53c07839a74966a6611b8cb8a1");
  }, 20000);


});
