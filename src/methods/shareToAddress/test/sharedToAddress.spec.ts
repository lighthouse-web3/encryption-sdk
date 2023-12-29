import _package from "../..";
import { ethers } from "ethers";
import { getAuthMessage } from "../../getAuthMessage";

describe("shareFile To address", () => {
  let signer, signer2;

  beforeAll(async () => {
    const provider = ethers.getDefaultProvider("mainnet");
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
      provider
    );

    signer2 = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8a",
      provider
    );
  });

  test("Invalid access", async () => {
    const authMessage = await getAuthMessage(signer2.address);
    const signedMessage = await signer2.signMessage(authMessage.message);
    const { isSuccess, error } = await _package.shareToAddress(
      signer2.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      signedMessage,
      ["0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1"]
    );
    expect(typeof error.message).toBe("string");
    expect(error.message).toMatch(/Denied/);
  }, 20000);

  test("share to address", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const { error, isSuccess } = await _package.shareToAddress(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      signedMessage,
      ["0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1"]
    );
    expect(error).toBe(null);
    expect(isSuccess).toBe(true);
  }, 20000);
});
