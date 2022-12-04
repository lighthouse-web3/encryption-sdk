const _package = require("..");

test("Generate Key", async () => {
  const { masterKey, keyShards } = await _package.generateKey();
  expect(typeof masterKey).toBe("string");
  expect(keyShards.length).toBe(5);
}, 20000);
