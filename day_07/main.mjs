// @ts-check
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const isCombine = (str) => str === "||";

/**
 *
 * @callback operatorCallback
 * @param {...number} responseCode
 * @returns {number}
 */

/**
 * @type {operatorCallback}
 */
function sum(...args) {
  return args.reduce((prev, curr) => prev + curr, 0);
}

/**
 * @type {operatorCallback}
 */
function product(...args) {
  return args.reduce((prev, curr) => prev * curr, 1);
}
/**
 *
 * @type  {operatorCallback}
 */
function combine(...args) {
  return args.reduce((prev, curr) => parseInt(`${prev}` + `${curr}`), 0);
}

const operatorFunc = {
  "+": sum,
  "||": combine,
  "*": product,
};

/**
 * @type {Map.<number, operatorCallback[][]>}
 */
const cache = new Map();

/**
 * @param {operatorCallback[]} operators
 * @param {number} size
 * @returns {operatorCallback[][]}
 */
function cachedCombinations(operators, size) {
  // @ts-ignore
  if (cache.has(size)) return cache.get(size);
  cache.set(size, getCombinations(operators, size));
  // @ts-ignore
  return cache.get(size);
}

/**
 * @param {operatorCallback[]} args
 * @param {number} size
 * @param {number} index
 * @param {operatorCallback[]} combo
 * @param {operatorCallback[][]} result
 */
function getCombinations(args, size, index = 0, combo = [], result = []) {
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
      getCombinations(args, size, index + 1, combo, result);
    }
  }
  return result;
  // Get each character
  // until
}

/**
 *
 */
function getInput() {
  const file = fs.readFileSync(
    `${fileURLToPath(path.dirname(import.meta.url))}/inputs.txt`,
    {
      encoding: "utf-8",
    }
  );

  const lines = file.split("\n");
  /**
   * @type {Array.<number | number[]>}
   */
  // @ts-ignore
  const inputs = lines.reduce(
    // @ts-ignore
    (
      /**
       * @type {Array.<number | number[]>}
       */
      prev,
      /**
       * @type {string}
       */
      curr
    ) => {
      const [result, operands] = curr.split(":");

      return [
        ...prev,
        [
          parseInt(result),
          operands
            .split(" ")
            .map((str) => parseInt(str))
            .filter((num) => num),
        ],
      ];
    },
    []
  );
  return inputs;
}

function partOne() {
  const operators = [sum, product];
  const inputs = getInput();
  let calibrationResult = 0;

  for (let input = 0; input < inputs.length; input++) {
    /**
     * @type {number}
     */
    let result = inputs[input][0];
    /**
     * @type {number[]}
     */
    const operands = inputs[input][1];
    const size = operands.length - 1;
    const combos = getCombinations(operators, size);

    for (let p = 0; p < combos.length; p++) {
      // [sum, product]
      const pattern = combos[p];

      // tracks intermediate total
      let total = 0;
      for (let o = 0; o < pattern.length; o++) {
        const [left, right] = [total ? total : operands[o], operands[o + 1]];

        total = pattern[o](left, right);
        if (total > result) {
          break;
        }
        if (total === result) {
          calibrationResult += result;
          break;
        }
      }
      // Found a combo, don't keep adding
      if (total === result) break;
    }
  }
  return calibrationResult;
}

/**
 * @param {boolean} useCache
 * @returns {number}
 */
function partTwo(useCache = false) {
  const operators = [sum, product, combine];
  const inputs = getInput();
  let calibrationResult = 0;

  for (let input = 0; input < inputs.length; input++) {
    /**
     * @type {number}
     */
    let result = inputs[input][0];
    /**
     * @type {number[]}
     */
    let operands = inputs[input][1];

    const size = operands.length - 1;
    const combos = cachedCombinations(operators, size);

    for (let p = 0; p < combos.length; p++) {
      // [sum, product]
      const pattern = combos[p];

      /**
       * @type {number[]|undefined}
       */
      let _operands = [...operands];

      // Check if || operator present.

      let _o = 0;
      // tracks intermediate total - if pattern is empty, only one item remains in list. take that instead.
      for (let o = 0; o < pattern.length; o++) {
        const [left, right] = [_operands[o], _operands[o + 1]];

        const next = pattern[o](left, right);
        _operands.splice(o + 1, 1, next);
        _o++;
        if (next >= result) {
          break;
        }
      }

      // Found a combo, don't keep adding
      if (_operands[_o] === result) {
        calibrationResult += result;
        break;
      }
    }
  }
  return calibrationResult;
}

partOne();
// console.time();
// console.log(partTwo());
// console.timeEnd();
console.time();
console.log(partTwo(true));
console.timeEnd();
