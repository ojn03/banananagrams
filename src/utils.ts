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
    const [x, y] = posString.split(",");

    const intx = Number(x);
    const inty = Number(y);

    //retrieve all tiles that start a word vertically
    // if word is valid, mark each tile as valid vertical
    if (!state[`${intx},${inty - 1}`] && state[`${intx},${inty + 1}`]) {
      state[posString].valid.vertical = down(
        `${intx},${inty + 1}`,
        state[posString].letter
      );
    }

    //retrieve all points that start a word horizontally
    // if word is valid, mark each tile as valid horizontal
    if (!state[`${intx - 1},${inty}`] && state[`${intx + 1},${inty}`]) {
      state[posString].valid.horizontal = right(
        `${intx + 1},${inty}`,
        state[posString].letter
      );
    }

    // retrieve all letters without neighbors
    // mark them as invalid both ways
    if (
      !state[`${intx - 1},${inty}`] &&
      !state[`${intx + 1},${inty}`] &&
      !state[`${intx},${inty - 1}`] &&
      !state[`${intx},${inty + 1}`]
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

    const [x, y] = posString.split(",");
    const nextPos = `${x},${Number(y) + 1}`;

    const isValidDown = down(nextPos, currentWord + state[posString].letter);
    state[posString].valid.vertical = isValidDown;
    return isValidDown;
  }

  function right(posString: string, currentWord: string): boolean {
    if (!state[posString]) {
      const ret = dictionary.has(currentWord.toLowerCase());
      return ret;
    }

    const [x, y] = posString.split(",");
    const nextPos = `${Number(x) + 1},${y}`;

    const isValidRight = right(nextPos, currentWord + state[posString].letter);
    state[posString].valid.horizontal = isValidRight;
    return isValidRight;
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
