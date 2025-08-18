export interface tileInfo {
  letter: string;
  valid: {
    vertical: boolean;
    horizontal: boolean;
  };
}

export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }
}

export class State {}

export class TileInfo {
  letter: string;
  valid: {
    horizontal: boolean;
    vertical: boolean;
  };

  constructor(letter: string) {
    this.letter = letter;
    this.valid = {
      horizontal: true,
      vertical: true,
    };
  }
}
