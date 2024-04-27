import IdVo from "./uuid.vo";

describe("IdVo", () => {
  test("should create a new instance of IdVo", () => {
    const id = new IdVo();

    expect(id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(id.value).toBeDefined();
  });

  test("should create a new instance of IdVo with a value", () => {
    const value = "a id";
    const id = new IdVo(value);

    expect(id.value).toBe(value);
  });
});
