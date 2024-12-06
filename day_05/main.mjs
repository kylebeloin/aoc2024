// @ts-check

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * @typedef {Map.<number, Set.<number>>} Rules
 */

const file = fs.readFileSync(
  `${fileURLToPath(path.dirname(import.meta.url))}/inputs.txt`,
  {
    encoding: "utf-8",
  }
);

/**
 *
 * @param {string[]} strings
 * @returns {Rules}
 */
function getRules(strings) {
  /**
   * @type {Rules}
   */
  const rules = new Map();

  for (let index = 0; index < strings.length; index++) {
    const [key, value] = strings[index].split("|").map((str) => parseInt(str));
    if (rules.has(key)) {
      rules.get(key)?.add(value);
      continue;
    }
    rules.set(key, new Set([value]));
  }
  return rules;
}

/**
 *
 * @param {string[]} strings
 * @returns {number[][]}
 */
function getOrdering(strings) {
  return strings.map((string) =>
    string.split(",").map((string) => parseInt(string))
  );
}

/**
 * @param {Rules} rules
 * @param {number[]} order
 * @returns {boolean}
 */
function isValidOrder(rules, order) {
  const total = order.length;
  let valid = true;
  order.forEach((num, i) => {
    if (!valid) return;
    for (let idx = 0; idx < total - 1; idx++) {
      // if it's equal or greater, doesn't matter
      if (idx >= i) continue;
      if (idx < i && rules.get(num)?.has(order[idx])) {
        valid = false;
        return;
      }
    }
  });

  return valid;
}

/**
 * @param {Rules} rules
 * @param {number[]} updates
 * @returns {number[]|undefined}
 */
function makeValid(rules, updates) {
  const total = updates.length;
  updates.forEach((page, i) => {
    for (let idx = 0; idx < total - 1; idx++) {
      // if it's equal or greater, doesn't matter
      if (idx >= i) continue;
      if (idx < i && rules.get(page)?.has(updates[idx])) {
        updates.splice(i - 1, 0, updates.splice(i, 1)[0]);
        while (!isValidOrder(rules, updates)) {
          updates = makeValid(rules, updates) ?? [];
        }
      }
    }
  });

  return updates;
}

/**
 * @type {Rules}
 */
let rules = new Map();

/**
 * @type {number[][]}
 */
let ordering = [];

let total = 0;

let invalidTotal = 0;

file.split(/\n\n/).forEach((item, i) => {
  const strings = item.split(/\n/);
  // If it is the ordering
  if (i) {
    ordering = getOrdering(strings);
    return;
  }
  rules = getRules(strings);
});

ordering.forEach((order, i) => {
  if (isValidOrder(rules, order)) {
    total += order[Math.floor(order.length / 2)];
  } else {
    invalidTotal +=
      makeValid(rules, order)?.[Math.floor(order.length / 2)] ?? 0;
  }
});

console.log(total, invalidTotal);
