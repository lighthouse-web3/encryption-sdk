import _package from "../../../index";
import { ethers } from "ethers";
import { getAuthMessage } from "../../getAuthMessage";

describe("AccessControl", () => {
  let signer;

  beforeAll(async () => {
    signer = new ethers.Wallet(
      "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
    );
  });

  test("Invalid Condition", async () => {
    const { error } = await _package.accessControl(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      "swrwwr",
      [
        {
          id: 1,
          chain: "FantomTes",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
        {
          id: 1,
          chain: "FantomTest",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
      ],
      "([2] and [1])"
    );
    expect(typeof error).toBe("string");
    expect(error).toMatch(/Condition validation error:/);
  }, 20000);

  test("Invalid Signature", async () => {
    const { error } = await _package.accessControl(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      "swrwwr",
      [
        {
          id: 1,
          chain: "FantomTest",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
        {
          id: 2,
          chain: "FantomTest",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
      ],
      "([2] and [1])"
    );
    expect(typeof error?.message).toBe("string");
    expect(error?.message).toMatch(/invalid signature/i);
  }, 20000);

  test("data Conditions", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const { error, isSuccess } = await _package.accessControl(
      signer.address,
      "QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH",
      signedMessage,
      [
        {
          id: 1,
          chain: "FantomTest",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
        {
          id: 2,
          chain: "FantomTest",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
      ],
      "([2] and [1])"
    );
    expect(error).toBe(null);
    expect(isSuccess).toBe(true);
  }, 20000);

  test("Add new cid access Conditions", async () => {
    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const { masterKey, keyShards } = await _package.generate(3, 5)
    const { error, isSuccess } = await _package.accessControl(
      signer.address,
      "QmPzhJDbMgoxXH7JoRc1roXqkLGtngLiGVhegiDEmmTnbM",
      signedMessage,
      [
        {
          id: 1,
          chain: "FantomTest",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
        {
          id: 2,
          chain: "FantomTest",
          method: "balanceOf",
          standardContractType: "ERC20",
          contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
          returnValueTest: { comparator: ">=", value: "0" },
          parameters: [":userAddress"],
        },
      ],
      "([2] and [1])",
      "EVM",
      keyShards,
      "ADDRESS",
    );
    expect(error).toBe(null);
    expect(isSuccess).toBe(true);
  }, 20000);
});
