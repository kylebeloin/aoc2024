import { Vector2D } from "./main.mjs";

describe("Vector2D", () => {
  it("should create a vector with default values", () => {
    const vector = new Vector2D();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
  });

  it("should create a vector with custom values", () => {
    const vector = new Vector2D(1, 2);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
  });

  it("should calculate the slope between two vectors", () => {
    const v1 = new Vector2D(0, 0);
    const v2 = new Vector2D(1, 1);
    expect(Vector2D.slope(v1, v2)).toBe(1);
  });

  it("should calculate the antinode between two vectors", () => {
    const v1 = new Vector2D(0, 0);
    const v2 = new Vector2D(1, 1);
    expect(Vector2D.antinodes(v1, v2)).toEqual({
      left: new Vector2D(1, 0),
      right: new Vector2D(1, 2),
    });
  });
});
