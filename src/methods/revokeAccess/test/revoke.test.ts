import _package from "../.."
import { ethers } from "ethers"
import { getAuthMessage } from "../../getAuthMessage"

describe("revoke file address", () => {
  let signer, signer2;

  beforeAll(async () => {
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
    );
    signer2 = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8a",
    );
  });

  test("revoke to address", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const { error, isSuccess } = await _package.revokeAccess(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      signedMessage,
      [signer2.address]
    );
    expect(error).toBe(null);
    expect(isSuccess).toBe(true);
  }, 20000);

  test("invalid Cid", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { error, isSuccess } = await _package.revokeAccess(
      signer.address,
      "cid",
      signedMessage,
      [signer2.address]
    );
    expect(isSuccess).toBe(false);
    expect(error).toMatch(/invalid Cid/i);
  }, 20000);

  test("invalid Access", async () => {
    const authMessage = await getAuthMessage(signer2.address);
    const signedMessage = await signer2.signMessage(authMessage.message);

    const { error, isSuccess } = await _package.revokeAccess(
      signer2.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      signedMessage,
      [signer2.address]
    );
    expect(isSuccess).toBe(false);
    expect(error.message).toMatch(/Access Denied/i);
  }, 20000);


});
