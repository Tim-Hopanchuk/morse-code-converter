import { DICTIONARY } from "./dictionary";
import type { MorseConfig } from "./types";

export function encodeToMorse(
  text: string,
  config: MorseConfig = {
    dot: ".",
    dash: "-",
    charDelim: " ",
    wordDelim: "/",
    ignoreUnknown: false,
  },
): string {
  if (!isValidInput(text, config)) {
    throw new Error("Invalid input");
  }

  const normalizedText: string = normalizeText(text);
  const updatedDictionary: Record<string, string> = updateDictionary(
    DICTIONARY,
    config,
  );

  let encodedText: string = "";

  for (const char of normalizedText) {
    if (!(char in updatedDictionary)) {
      if (!config.ignoreUnknown) {
        throw new Error("Invalid input");
      }

      continue;
    }

    encodedText += updatedDictionary[char] + config.charDelim;
  }

  encodedText = encodedText.slice(0, encodedText.lastIndexOf(config.charDelim));

  return encodedText;
}

function isValidInput(text: unknown, config: unknown): boolean {
  if (
    typeof text !== "string" ||
    typeof config !== "object" ||
    config === null
  ) {
    return false;
  }

  if (
    !("dot" in config) ||
    !("dash" in config) ||
    !("charDelim" in config) ||
    !("wordDelim" in config) ||
    !("ignoreUnknown" in config)
  ) {
    return false;
  }

  if (
    typeof config.dot !== "string" ||
    typeof config.dash !== "string" ||
    typeof config.charDelim !== "string" ||
    typeof config.wordDelim !== "string" ||
    typeof config.ignoreUnknown !== "boolean"
  ) {
    return false;
  }

  return true;
}

function normalizeText(text: string): string {
  const normalizedText: string = text
    .trim()
    .replaceAll(/\s+/g, " ")
    .toUpperCase();

  return normalizedText;
}

function updateDictionary(
  sourceDictionary: Record<string, string>,
  config: MorseConfig,
): Record<string, string> {
  const updatedDictionary: Record<string, string> = {};

  for (const [letter, sourceCode] of Object.entries(sourceDictionary)) {
    let updatedCode = "";

    for (const char of sourceCode) {
      switch (char) {
        case ".":
          updatedCode += config.dot;
          break;
        case "-":
          updatedCode += config.dash;
          break;
        case " ":
          updatedCode += config.charDelim;
          break;
        case "/":
          updatedCode += config.wordDelim;
          break;
      }
    }

    updatedDictionary[letter] = updatedCode;
  }

  return updatedDictionary;
}
