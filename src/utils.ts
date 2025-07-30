import { tileInfo } from "./types";

export function closestMultiple(number: number, multiple: number) {
  return Math.round(number / multiple) * multiple;
}

//TODO make this more efficient (undo recurcsion, find better algorithm, etc) and concise
export function validateState(
  state: Record<string, tileInfo>,
  dictionary: Set<string>
) {
  Object.values(state).forEach((state) => {
    // all tiles by default are valid both vertical and horizontal
    state.valid = {
      horizontal: false,
      vertical: false,
    };
  });

  Object.keys(state).forEach((posString: string) => {
    const [x, y] = posString.split(",").map(Number);

    //retrieve all tiles that start a word vertically
    // if word is valid, mark each tile as valid vertical
    if (!state[`${x},${y - 1}`] && state[`${x},${y + 1}`]) {
      state[posString].valid.vertical = down(
        `${x},${y + 1}`,
        state[posString].letter
      );
    }

    //retrieve all points that start a word horizontally
    // if word is valid, mark each tile as valid horizontal
    if (!state[`${x - 1},${y}`] && state[`${x + 1},${y}`]) {
      state[posString].valid.horizontal = right(
        `${x + 1},${y}`,
        state[posString].letter
      );
    }

    // retrieve all letters without neighbors
    // mark them as invalid both ways
    if (
      !state[`${x - 1},${y}`] &&
      !state[`${x + 1},${y}`] &&
      !state[`${x},${y - 1}`] &&
      !state[`${x},${y + 1}`]
    ) {
      state[posString].valid = {
        vertical: false,
        horizontal: false,
      };
    }
  });

  function down(posString: string, currentWord: string): boolean {
    if (!state[posString]) {
      const ret = dictionary.has(currentWord.toLowerCase());
      return ret;
    }

    const [x, y] = posString.split(",").map(Number);
    const nextPos = `${x},${y + 1}`;

    const isValidDown = down(nextPos, currentWord + state[posString].letter);
    state[posString].valid.vertical = isValidDown;
    return isValidDown;
  }

  function right(posString: string, currentWord: string): boolean {
    if (!state[posString]) {
      const ret = dictionary.has(currentWord.toLowerCase());
      return ret;
    }

    const [x, y] = posString.split(",").map(Number);
    const nextPos = `${x + 1},${y}`;

    const isValidRight = right(nextPos, currentWord + state[posString].letter);
    state[posString].valid.horizontal = isValidRight;
    return isValidRight;
  }
}

// remove from bank and add to wallet
export function bankWithdrawal(
  amount: number,
  bank: Record<string, number>
): string[] {
  const availableLetters: string[] = [];
  let total = 0;
  Object.entries(bank).forEach(([k, v]) => {
    for (let i = v; i > 0; i -= 1) availableLetters.push(k);

    total += v;
  });

  if (total < amount) {
    throw Error("not enough letters in bank");
  } else {
    const picked: string[] = [];
    const letters = [...availableLetters];
    for (let i = 0; i < amount; i++) {
      const idx = Math.floor(Math.random() * letters.length);
      const pick = letters[idx];
      picked.push(pick);
      bank[pick] -= 1;
      letters.splice(idx, 1);
    }
    return picked;
  }
}
// TODO implement and use trie for fun
// export class Trie {
//   constructor(words: string[] = []) {
//     words.forEach((word) => {
//       this.insert(word);
//     });
//   }

//   public insert(word: string) {}
// }
