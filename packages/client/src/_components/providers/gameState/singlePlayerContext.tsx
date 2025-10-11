"use client";

import { DropData, Position, TileDropData, TileInfo } from "@/types";
import { useState } from "react";
import letters from "@/defaultLetters";
import {
  bankSize,
  bankWithdrawal,
  isSingleValidComponent,
} from "@/utils/gameUtils";
import { GameStateContextType } from "@/types";

//TODO toast notis for errors, peel, dump, etc
//TODO add multiselect

export const CreateSinglePlayerContext = (): GameStateContextType => {
  const initBank = structuredClone(letters);
  const initialWithDrawal = bankWithdrawal(initBank, 15);
  const [wallet, setWallet] = useState<string[]>(initialWithDrawal); // MAYBE make wallet a map kinda like bank
  const [bank, setBank] = useState<Record<string, number>>(initBank);

  // TODO give each tile its own unique ID. Maybe uuid or LetterNumber. So we can delete and add specific tiles
  const [board, setBoard] = useState<Record<string, TileInfo>>({});

  const moveTile = (oldPos: Position, newPos: Position) => {
    const prevPositionString = `${oldPos.x},${oldPos.y}`;
    const targetPositionString = `${newPos.x},${newPos.y}`;

    if (targetPositionString === prevPositionString) return;

    setBoard((prev) => {
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

        removeTile(new Position(x, y));
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

    bank[letter] += 1;
    const newLetters = bankWithdrawal(bank, 3);

    const newWallet = wallet.concat(newLetters);

    setWallet(newWallet);
    setBank(bank);
  };

  const peel = () => {
    if (isSingleValidComponent(board) && wallet.length == 0) {
      const newletters = bankWithdrawal(bank, 1);
      setWallet(wallet.concat(newletters));
      setBank(bank);
    } else {
      console.error("cannot peel yet");
    }
  };

  //Adds a tile from wallet to board
  const addTile = (letter: string, gridPos: Position) => {
    if (wallet.includes(letter) && !(gridPos.toString() in board)) {
      setBoard((prev) => {
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
      console.error("letter " + letter + " does not exist in wallet");
    }
  };

  // TODO DRY
  const removeTile = (gridPos: Position) => {
    if (!(gridPos.toString() in board)) {
      return console.error(
        "attempting to remove inexistent position: ",
        gridPos.toString()
      );
    }

    setBoard((prev) => {
      delete prev[gridPos.toString()];
      return prev;
    });
  };

  return {
    board,
    spacing: 50,
    wallet,
    peel,
    addTile,
    moveTile,
    dump,
  };
};
