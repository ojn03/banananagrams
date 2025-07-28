import { readFileSync } from "fs";
import path from "path";

export function loadDictionary(filePath: string = 'dictionary.txt') {
  const dictionary = new Set<string>();
  const fullPath = path.resolve(filePath);
  const content = readFileSync(fullPath, "utf-8");
  content.split("\n").forEach((word) => dictionary.add(word.trim().toLowerCase()));

  return dictionary;
}