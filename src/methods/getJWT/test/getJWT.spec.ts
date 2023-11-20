import _package from "../..";
import { getAuthMessage } from "../../getAuthMessage";
import { ethers } from "ethers";

describe("getJWT", () => {
  let signer;

  beforeAll(async () => {
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
    );
  });


  test("Invalid Signature", async () => {
    const { error } = await _package.getJWT(
      signer.address,
      "signature",
    );
    expect(error).toBe("Invalid Signature");
  }, 20000);

  test("get jwt", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);

    const { JWT, error, refreshToken } = await _package.getJWT(
      signer.address,
      signedMessage,
    );
    expect(error).toBe(null);
    expect(JWT).toMatch(/jwt:/i);
    expect(refreshToken).toMatch(/r:/i);

    let secound_res = await _package.getJWT(
      signer.address,
      refreshToken,
      true
    );
    expect(secound_res.JWT).toMatch(/jwt:/i);
    expect(secound_res.refreshToken).toMatch(/r:/i);
  }, 20000);
})