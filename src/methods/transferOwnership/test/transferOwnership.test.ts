import _package from "../..";
import { ethers } from "ethers";

describe("Transfer OwnerShip", () => {
  let signer, signer2;

  beforeAll(async () => {
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b"
    );
    signer2 = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8a"
    );
  });

  test("transfer Ownership to address", async () => {
    let authMessage = await _package.getAuthMessage(signer.address);
    let signedMessage = await signer.signMessage(authMessage.message);
    const { error, isSuccess } = await _package.transferOwnership(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      signer2.address,
      signedMessage
    );
    authMessage = await _package.getAuthMessage(signer2.address);
    signedMessage = await signer2.signMessage(authMessage.message);
    const { error: _error, isSuccess: _isSuccess } =
      await _package.transferOwnership(
        signer2.address,
        "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
        signer.address,
        signedMessage
      );
    // expect(error).toBe(null);
    // expect(isSuccess).toBe(true);
    expect(_error).toBe(null);
    expect(_isSuccess).toBe(true);
  }, 80000);
});
