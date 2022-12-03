const _package = require("..");

test("Generate Key", async () => {
  const { masterKey } = await _package.generateKey();
  expect(typeof masterKey).toBe("string");
}, 20000);
