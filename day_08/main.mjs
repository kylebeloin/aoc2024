// @ts-check
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * @param {number[]} args
 * @param {number} size
 * @param {number} index
 * @param {number[]} combo
 * @param {number[][]} result
 */
function combinations(args, size, index = 0, combo = [], result = []) {
  if (index === 0) {
    combo = new Array(size);
  }

  if (index === size) {
    result.unshift([...combo]);
    combo = new Array(size);
  }

  if (index < size) {
    for (let i = 0; i < args.length; i++) {
      combo[index] = args[i];
      combinations(args, size, index + 1, combo, result);
    }
  }
  return result;
  // Get each character
  // until
}

const file = fs.readFileSync(
  `${fileURLToPath(path.dirname(import.meta.url))}/inputs.txt`,
  {
    encoding: "utf-8",
  }
);

const lines = file.split("\n");
const [width, height] = [lines[0].length ?? 0, lines.length];

/**
 * @description Tracks each index and corresponding frequencies or antinodes at that location.
 * @type {Map.<number, Set.<string>>}
 */
const locations = new Map();

/**
 * @description Tracks each frequency and the corresponding indices that have that frequency.
 * @type {Map.<string, Set.<number>>}
 */
const frequenciees = new Map();
frequenciees.set("#", new Set([]));

for (let i = 0; i < width * height; i++) {
  const row = Math.floor(i / width);
  const col = i % width;
  const char = lines[row][col];

  locations.set(i, new Set([]));

  if (char !== ".") {
    locations.get(i)?.add(char);
    if (frequenciees.has(char)) {
      frequenciees.get(char)?.add(i);
    } else {
      frequenciees.set(char, new Set([i]));
    }
  }
}

function toCoord(index) {
  return [index % width, Math.floor(index / width)];
}

function slope(a, b) {
  // get the row and column of each index
  const [rowA, colA] = [Math.floor(a / width), a % width];
  const [rowB, colB] = [Math.floor(b / width), b % width];

  // calculate the slope between the two points
  return (rowB - rowA) / (colB - colA);
}

function anitnodes(a, b) {
  locations.get(a)?.add("#");
  frequenciees.get("#")?.add(a);
  locations.get(b)?.add("#");
  frequenciees.get("#")?.add(b);

  const g = Math.sign(slope(a, b)) * -1;
  const d = Math.abs(a - b);
  const [offsetA, offsetB] = [g > 0 ? d : d * -1, g > 0 ? d * -1 : d];

  let [l, r] = [a + offsetA, b + offsetB];

  while (locations.has(l) && slope(l, a) === slope(a, b)) {
    locations.get(a)?.add("#");
    frequenciees.get("#")?.add(a);
    locations.get(l)?.add("#");
    frequenciees.get("#")?.add(l);
    l += offsetA;
  }
  while (locations.has(r) && slope(r, b) === slope(a, b)) {
    locations.get(r)?.add("#");
    frequenciees.get("#")?.add(r);
    r += offsetB;
  }
}

for (let [frequency, positions] of frequenciees) {
  const pairs = combinations(Array.from(positions), 2);
  for (let pair of pairs) {
    let [a, b] = pair;
    if (toCoord(a)[0] > toCoord(b)[0]) {
      [a, b] = [b, a];
    }

    if (a === b) {
      continue;
    }
    anitnodes(a, b);
  }
}

function draw() {
  for (let i = 0; i < width * height; i++) {
    if (locations.has(i)) {
      const char = Array.from(locations?.get(i) ?? []);
      process.stdout.write(`${char?.at(0) ?? "·"}`);
    } else {
      process.stdout.write("·");
    }

    if (i % width === width - 1) {
      process.stdout.write("\n");
    }
  }
  process.stdout.write("\n");
}

draw();
console.log(frequenciees.get("#")?.size);
