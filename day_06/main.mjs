// @ts-check
import { log } from "console";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

var loops = 0;
var unique = new Set();

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
  static loops = new Set();
  /**
   * @type {Node|undefined}
   */
  start;

  /**
   * @type {Node|undefined}
   */
  end;

  /**
   * @type {Node|undefined}
   */
  #node;

  /**
   * @type {Vector2D}
   */
  direction = DIRECTION.UP;

  /**
   * @type {Set.<number>}
   */
  visited = new Set();

  /**
   * @type {Map<Vector2D, Set.<number>>}
   */
  paths = new Map([
    [DIRECTION.UP, new Set()],
    [DIRECTION.DOWN, new Set()],
    [DIRECTION.LEFT, new Set()],
    [DIRECTION.RIGHT, new Set()],
  ]);

  /**
   * @type {boolean}
   */
  tracking;

  /**
   * @type {Node[]}
   */
  canonicalPath = [];

  /**
   * @type {Node|undefined}
   */
  get next() {
    const next = this.node?.neighbours.get(this.direction);

    return next;
  }

  /**
   * @param {Node|undefined} node
   */
  set node(node) {
    if (node !== undefined) this.visited.add(node.index);
    this.#node = node;
  }

  /**
   * @type {Node|undefined}
   */
  get node() {
    return this.#node;
  }

  /**
   * @returns {boolean}
   */
  isLooping() {
    const looping = this.paths
      ?.get(this.direction)
      ?.has(this?.next?.index ?? -1);
    // If next exists in path
    if (looping) {
      Guard.loops.add(this.paths.get(this.direction));
    }
    return (
      this.paths?.get(this.direction)?.has(this?.next?.index ?? -1) ?? false
    );
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
    while (this.next?.occupied && !this.isLooping()) {
      this.paths.get(this.direction)?.add(this.next?.index ?? -1);
      this.turnRight();
    }
    this.node = this.next;
    if (this.tracking && this.node) this.canonicalPath.push(this.node);
    this.paths.get(this.direction)?.add(this.node?.index ?? -1);
  }

  reset() {
    this.node = this.start;
    this.direction = DIRECTION.UP;
    this.visited = new Set();
    this.paths = new Map([
      [DIRECTION.UP, new Set()],
      [DIRECTION.DOWN, new Set()],
      [DIRECTION.LEFT, new Set()],
      [DIRECTION.RIGHT, new Set()],
    ]);
  }

  constructor() {}
}

/**
 *
 * @param {Guard} guard
 * @param {boolean} saveEnd
 */
function partOne(guard, saveEnd = false) {
  // if guard.node is undefined, we're oob
  while (guard.next !== undefined && !guard.isLooping()) {
    guard.moveForward();
  }
  if (saveEnd) guard.end = guard.node;
}

function getDirectionCharacter(direction) {
  switch (direction) {
    case DIRECTION.UP:
      return "^";
    case DIRECTION.RIGHT:
      return ">";
    case DIRECTION.DOWN:
      return "v";
    case DIRECTION.LEFT:
      return "<";
    default:
      return " ";
  }
}

/**
 *
 * @param {Grid | undefined} grid
 * @param {Guard} guard
 */
function logGrid(grid, guard) {
  if (!grid) return;
  for (let row = 0; row < grid.height; row++) {
    let str = "";
    for (let col = 0; col < grid.width; col++) {
      const idx = row * grid.width + col;
      str +=
        grid.tiles[idx].index === guard.node?.index
          ? getDirectionCharacter(guard.direction)
          : grid.tiles[idx].occupied
          ? "#"
          : ".";
    }
    console.log(str);
  }
  console.log("\n");
}

/**
 *
 * @param {Guard} guard
 * @param {number} index
 */
function partTwo(guard, index = 1) {
  guard.reset();
  if (guard.node) {
    guard.node.grid.tiles[guard.canonicalPath[index].index].occupied = true;
  }
  // until the guard reaches the end of original path, look for loops.
  while (!guard.isLooping() && guard.next !== undefined) {
    partOne(guard);
    //partOne would loop here
  }
  // A loop has been found, or we've reached the end of the path.
  if (guard.isLooping()) {
    loops += 1;
    if (guard.node)
      guard.node.grid.tiles[guard.canonicalPath[index].index].occupied = false;
    if (index + 1 < guard.canonicalPath.length) {
      partTwo(guard, index + 1);
    }

    // We need to find the loop, and then remove it.
    // We can do this by starting from the end, and moving backwards
  } else {
    if (guard.node)
      guard.node.grid.tiles[guard.canonicalPath[index].index].occupied = false;

    if (index + 1 < guard.canonicalPath.length) {
      partTwo(guard, index + 1);
    }
  }
}

/**
 * @typedef {Map.<number, Set.<number>>} Rules
 */

const file = fs.readFileSync(
  `${fileURLToPath(path.dirname(import.meta.url))}/inputs.txt`,
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
      guard.node = guard.start = grid.tiles[idx];
      console.log(guard.node === grid.tiles[idx]);
    }
  }

  // assuming all lines are same length
}
console.time();
guard.tracking = true;
partOne(guard, true);
console.timeEnd();

console.time();
guard.tracking = false;
partTwo(guard);
console.log(loops);
console.log(unique.size);
console.log(Guard.loops.size);
console.timeEnd();
