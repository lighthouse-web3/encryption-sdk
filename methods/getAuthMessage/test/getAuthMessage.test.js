const _package = require("..");

describe("getAuthMessage", () => {
  test("Invalid Address", async () => {
    const { error } = await _package.getAuthMessage(
      "0x9a40b8EE3B8Fe7eB621cd142a651560Fa7dF7C"
    );
    expect(typeof error).toBe("object");
    expect(error?.message).toBe("Invalid address");
  }, 20000);

  test("get message", async () => {
    const { message } = await _package.getAuthMessage(
      "0x9a40b8EE3B8Fe7eB621cd142a651560Fa7dF7CBa"
    );
    expect(message).toMatch(
      /Please sign this message to prove you are owner of this account/i
    );
  }, 20000);
});
