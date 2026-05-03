import { DICTIONARY } from "./dictionary";
import type { Config } from "./types";

export function encodeToMorse(text: string, config: Config = {}): string {
  validateInput(text, config);

  const normalizedText: string = text
    .trim()
    .replaceAll(/\s+/g, " ")
    .toUpperCase();
  const normalizedConfig: Required<Config> = {
    dot: ".",
    dash: "-",
    charDelim: " ",
    wordDelim: "/",
    ignoreUnknown: false,
    ...config,
  };

  const codes: string[] = [];

  for (const letter of normalizedText) {
    if (letter in DICTIONARY) {
      codes.push(getCode(letter, normalizedConfig));
      continue;
    }

    if (!normalizedConfig.ignoreUnknown) {
      throw new Error("Invalid input: unsupported character in text");
    }
  }

  const encodedText: string = codes.join(normalizedConfig.charDelim);

  return encodedText;
}

function getCode(letter: string, normalizedConfig: Required<Config>): string {
  const key = letter as keyof typeof DICTIONARY;

  let code: string = "";

  for (const char of DICTIONARY[key]) {
    switch (char) {
      case ".":
        code += normalizedConfig.dot;
        break;
      case "-":
        code += normalizedConfig.dash;
        break;
      case "/":
        code += normalizedConfig.wordDelim;
        break;
    }
  }

  return code;
}

function validateInput(text: unknown, config: unknown): void {
  if (typeof text !== "string") {
    throw new TypeError("Invalid input: expected 'text' to be a string");
  }

  if (typeof config !== "object" || config === null || Array.isArray(config)) {
    throw new TypeError("Invalid input: expected 'config' to be an object");
  }

  ["dot", "dash", "charDelim", "wordDelim"].forEach((value) => {
    if (
      config &&
      value in config &&
      typeof (config as Record<string, unknown>)[value] !== "string"
    ) {
      throw new TypeError(
        `Invalid input: expected config.${value} to be a string`,
      );
    }
  });

  if (
    config &&
    "ignoreUnknown" in config &&
    typeof config.ignoreUnknown !== "boolean"
  ) {
    throw new TypeError(
      "Invalid input: expected config.ignoreUnknown to be a boolean",
    );
  }
}
