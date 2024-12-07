// @ts-check
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class Vector2D {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

const DIRECTION = {
  UP: new Vector2D(0, -1),
  RIGHT: new Vector2D(1, 0),
  DOWN: new Vector2D(0, 1),
  LEFT: new Vector2D(-1, 0),
};

class Node {
  /**
   * @type {Grid}
   */
  #grid;

  /**
   * @type {Vector2D}
   */
  #position;

  /**
   * @type {Grid}
   */
  get grid() {
    return this.#grid;
  }

  /**
   * @type {Vector2D}
   */
  get position() {
    return this.#position;
  }

  /**
   * @type {boolean}
   */
  occupied = false;

  /**
   * @returns {number}
   */
  get index() {
    return this.position.y * this.grid.width + this.position.x;
  }

  /**
   * @type {Map.<Vector2D, Node>}
   */
  neighbours = new Map();
  /**
   *
   * @param {Vector2D} position
   * @param {Grid} grid
   */
  constructor(position, grid) {
    this.#grid = grid;
    this.#position = position;
  }
}

class Grid {
  /**
   * @type {number}
   */
  width = 0;

  /**
   * @type {number}
   */
  height = 0;

  /**
   * @type {Node[]}
   */
  nodes = [];

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.height = height;
    this.width = width;
    this.tiles = Array.from(
      { length: width * height },
      (_, i) => new Node(new Vector2D(i % width, Math.floor(i / height)), this)
    );
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const top =
        tile.position.y > 0 ? this.tiles.at(tile.index - this.width) : null;
      const left = tile.position.x > 0 ? this.tiles.at(tile.index - 1) : null;

      if (top) {
        tile.neighbours.set(DIRECTION.UP, top);
        top.neighbours.set(DIRECTION.DOWN, tile);
      }

      if (left) {
        tile.neighbours.set(DIRECTION.LEFT, left);
        left.neighbours.set(DIRECTION.RIGHT, tile);
      }
    }
  }
}

class Guard {
  /**
   * @type {Node|undefined}
   */
  #node;
  /**
   * @type {Vector2D}
   */
  direction = DIRECTION.UP;

  /**
   * @type {Set.<Node>}
   */
  visited = new Set();

  /**
   * @param {Node|undefined} node
   */
  set node(node) {
    if (node !== undefined) this.visited.add(node);

    this.#node = node;
  }

  /**
   * @type {Node|undefined}
   */
  get node() {
    return this.#node;
  }

  turnRight() {
    switch (this.direction) {
      case DIRECTION.UP:
        this.direction = DIRECTION.RIGHT;
        return;
      case DIRECTION.RIGHT:
        this.direction = DIRECTION.DOWN;
        return;
      case DIRECTION.DOWN:
        this.direction = DIRECTION.LEFT;
        return;
      case DIRECTION.LEFT:
        this.direction = DIRECTION.UP;
        return;
      default:
        throw new Error("No valid direction.");
    }
  }

  moveForward() {
    while (this.node?.neighbours.get(this.direction)?.occupied) {
      this.turnRight();
    }
    this.node = this.#node?.neighbours.get(this.direction);
  }

  constructor() {}
}

/**
 *
 * @param {Guard} guard
 */
function partOne(guard) {
  while (guard.node !== undefined) {
    guard.moveForward();
  }
  console.log(guard.visited.size);
}

/**
 * @typedef {Map.<number, Set.<number>>} Rules
 */

const file = fs.readFileSync(
  `${fileURLToPath(path.dirname(import.meta.url))}/test.txt`,
  {
    encoding: "utf-8",
  }
);

const lines = file.split("\n");
const grid = new Grid(lines[0].length, lines.length);
const guard = new Guard();

for (let row = 0; row < grid.height; row++) {
  for (let col = 0; col < grid.width; col++) {
    const str = lines[row][col];
    const idx = row * grid.width + col;
    if (str === "#") {
      grid.tiles[idx].occupied = true;
    }
    if (str === "^") {
      guard.node = grid.tiles[idx];
      console.log(guard.node === grid.tiles[idx]);
    }
  }

  // assuming all lines are same length
}

partOne(guard);
