"use client";

import {
  DropData,
  Position,
  TileDropData,
  tileInfo,
  WalletDropData,
} from "@/types";
import { createContext, ReactNode, useState } from "react";
import letters from "@/defaultLetters";
import { bankSize, bankWithdrawal, isSingleValidComponent } from "@/utils";

interface gameStateContextType {
  state: Record<string, tileInfo>; //TODO rename to boardState
  wallet: string[];
  bank: Record<string, number>;
  spacing: number;
  moveTile: (oldPos: Position, newPos: Position) => void;
  addTile: (letter: string, pos: Position) => void;
  removeTile: (gridPos: Position) => void;
  dump: (dto: DropData) => void;
}

export const GameStateContext = createContext<gameStateContextType | null>(
  null
);

const TileProvider = ({ children }: { children: ReactNode }) => {
  const spacing = 50;
  const initBank = structuredClone(letters);
  const initialWithDrawal = bankWithdrawal(initBank, 3);
  const [wallet, setWallet] = useState<string[]>(initialWithDrawal); // MAYBE make wallet a map kinda like bank
  const [bank, setBank] = useState<Record<string, number>>(initBank);

  // TODO make a state class
  // MAYBE give each tile its own unique ID. Maybe uuid or LetternNumber. So we can delete and add specific tiles
  const [state, setState] = useState<Record<string, tileInfo>>({});

  const moveTile = (oldPos: Position, newPos: Position) => {
    const prevPositionString = `${oldPos.x / spacing},${oldPos.y / spacing}`;
    const targetPositionString = `${newPos.x},${newPos.y}`; // TODO make target math consistent with prev math.

    if (targetPositionString === prevPositionString) return;

    setState((prev) => {
      const newState = { ...prev };

      if (targetPositionString in newState) {
        // Target position is occupied, swap the tiles
        const temp = newState[prevPositionString];
        newState[prevPositionString] = newState[targetPositionString];
        newState[targetPositionString] = temp;
      } else {
        // Target position is empty, just move the tile
        newState[targetPositionString] = newState[prevPositionString];
        delete newState[prevPositionString];
      }

      return newState;
    });
  };

  //TODO enable dump from grid tile
  const dump = (dto: DropData) => {
    if (bankSize(bank) < 3) {
      return console.error("not enough letters in bank to dump");
    }

    const letter = dto.data.letter as string;

    switch (dto.type) {
      case "tile":
        const {
          data: { x, y },
        } = dto as TileDropData;

        removeTile(new Position(x / spacing, y / spacing));
        break;
      case "wallet":
        if (!wallet.includes(letter)) {
          return console.error(
            `letter ${letter} cannot be dumped as it does not exist in wallet`
          );
        }

        const letterIndex = wallet.findIndex((l) => l == letter);
        wallet.splice(letterIndex, 1);
        break;
      default:
        return console.error("unknown drop type");
    }

    const newBank = { ...bank };
    newBank[letter] += 1;
    const newLetters = bankWithdrawal(bank, 3);

    const newWallet = wallet.concat(newLetters);

    setWallet(newWallet);
    setBank(newBank);
  };

  const canPeel = () => isSingleValidComponent(state) && wallet.length == 0;

  const Peel = () => {
    if (!canPeel()) {
      return console.error("Cannot Peel");
    }

    // TODO enable peel for all players
    // If not enough in bank, this player wins

    bankWithdrawal(bank, 1);
    setBank(bank);
  };

  const addTile = (letter: string, gridPos: Position) => {
    //TODO enable swapping grid and wallet tiles
    if (wallet.includes(letter) && !(gridPos.toString() in state)) {
      setState((prev) => {
        return {
          ...prev,
          [gridPos.toString()]: {
            letter,
            valid: {
              vertical: true,
              horizontal: true,
            },
          },
        };
      });
      setWallet((prev) => {
        const prevIndex = prev.findIndex((l) => l == letter);
        return prev.filter((_, index) => index !== prevIndex);
      });
    } else {
      //MAYBE throw an error here
      console.error("letter " + letter + " does not exist in wallet");
    }
  };

  const removeTile = (gridPos: Position) => {
    if (!(gridPos.toString() in state)) {
      //TODO better user flow. we dont j want to crash the game
      return console.error(
        "attempting to remove inexistent position: ",
        gridPos.toString()
      );
    }

    setState((prev) => {
      const newState = { ...prev };
      delete newState[gridPos.toString()];
      return newState;
    });
  };

  return (
    <GameStateContext.Provider
      value={{
        state,
        spacing,
        bank,
        wallet,
        addTile,
        removeTile,
        moveTile,
        dump,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export default TileProvider;
