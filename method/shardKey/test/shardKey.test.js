const _package = require("../index");

describe("isKeyShadable", () => {
  test("check if key is shadable: False", async () => {
    const { isShardable: status } = await _package.ShardKey(
      "0b2acf87909bd1215858e5c0ec99359cadfcf918a4fac539ec28bec80ae"
    );
    expect(status).toBe(false);
  }, 20000);
  test("check if key is shadable: true", async () => {
    const { isShardable: status } = await _package.ShardKey(
      "0b2acf87909bd1215858e5c0ec99359cadfcf918a4fac53e3e88e9ec28bec678"
    );
    expect(status).toBe(true);
  }, 20000);
});
