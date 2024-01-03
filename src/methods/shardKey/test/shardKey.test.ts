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

  test("test MasterKey Recovery: 4/5 part", async () => {
    const knownKey =
      "0a16088df55283663f7fea6c5f315bde968024b7ac5d715af0325a5507700e5e";
    const { isShardable, keyShards } = await _package.shardKey(knownKey, 3, 5);
    //recover keys from shards
    // console.log(keyShards, isShardable, knownKey);
    const { masterKey } = await _package.recoverKey([
      keyShards[2],
      keyShards[0],
      keyShards[1],
      keyShards[4],
    ]);
    expect(masterKey).toBe(knownKey);
  });
  test("test MasterKey Recovery: 5/5 part", async () => {
    const knownKey =
      "0a16088df55283663f7fea6c5f315bde968024b7ac5d715af0325a5507700e5e";
    const { isShardable, keyShards } = await _package.shardKey(knownKey, 3, 5);
    //recover keys from shards
    // console.log(keyShards, isShardable, knownKey);
    const { masterKey } = await _package.recoverKey([
      keyShards[2],
      keyShards[0],
      keyShards[1],
      keyShards[4],
      keyShards[3],
    ]);
    expect(masterKey).toBe(knownKey);
  });
  // test("test MasterKey Recovery: 3/5 part", async () => {
  //   const knownKey =
  //     "0a16088df55283663f7fea6c5f315bde968024b7ac5d715af0325a5507700e5e";
  //   const { isShardable, keyShards } = await _package.shardKey(knownKey, 3, 5);
  //   //recover keys from shards
  //   console.log(keyShards, isShardable, knownKey);
  //   const { masterKey } = await _package.recoverKey([
  //     keyShards[2],
  //     keyShards[3],
  //     keyShards[4],
  //   ]);
  //   expect(masterKey).toBe(knownKey);
  // });
  test("test MasterKey Recovery: 2/5 part", async () => {
    const knownKey =
      "0a16088df55283663f7fea6c5f315bde968024b7ac5d715af0325a5507700e5e";
    const { isShardable, keyShards } = await _package.shardKey(knownKey, 3, 5);
    //recover keys from shards
    // console.log(keyShards, isShardable, knownKey);
    const { masterKey } = await _package.recoverKey([
      keyShards[0],
      keyShards[1],
    ]);
    expect(masterKey).not.toBe(knownKey);
  });
});
