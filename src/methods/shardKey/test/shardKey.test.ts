import _package from "../..";

describe("isKeyShadable", () => {
  test("check if key is shadable: False", async () => {
    const { isShardable } = await _package.shardKey(
      "0b2acf87909bd1215858e5c0ec99359cadfcf918a4fac539ec28bec80ae"
    );
    expect(isShardable).toBe(false);
  }, 20000);
  test("check if key is shadable: true", async () => {
    const { isShardable, keyShards } = await _package.shardKey(
      "0b2ccf87909bd1215858e5c0ec99359cadfcf918a4fac53e3e88e9ec28bec678"
    );
    expect(isShardable).toBe(true);
    expect(keyShards.length).toBe(5);
  }, 20000);
});
