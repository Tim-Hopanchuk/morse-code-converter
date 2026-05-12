import type { Config } from "./types";
import { internationalMorseCode } from "./dictionaries/international-morse-code";

export function encodeToMorse(
  rawText: string,
  options: Partial<Config> = {},
): string {
  validateInput(rawText, options);

  const text = normalize(rawText);
  const config = buildConfig(options);
  const dictionary = buildDictionary(config, "encode");

  const words = text.split(" ");
  const tokens: string[] = [];

  for (const word of words) {
    const symbols: string[] = [];

    for (const letter of word) {
      const symbol = getMappedValue(letter, dictionary, config.ignoreUnknown);

      if (symbol !== "") {
        symbols.push(symbol);
      }
    }

    const token = symbols.join(config.symbolSeparator);
    tokens.push(token);
  }

  return tokens.join(config.tokenSeparator);
}

export function decodeFromMorse(
  code: string,
  options: Partial<Config> = {},
): string {
  validateInput(code, options);

  const config = buildConfig(options);
  const dictionary = buildDictionary(config, "decode");

  const tokens = code.split(config.tokenSeparator);
  const words: string[] = [];

  for (const token of tokens) {
    const symbols = token.split(config.symbolSeparator);
    const letters: string[] = [];

    for (const symbol of symbols) {
      const letter = getMappedValue(symbol, dictionary, config.ignoreUnknown);

      if (letter !== "") {
        letters.push(letter);
      }
    }

    const word = letters.join("");
    words.push(word);
  }

  return words.join(" ");
}

function validateInput(source: unknown, options: unknown): void {
  if (typeof source !== "string") {
    throw new Error("Invalid input: expected source to be a string");
  }

  if (
    typeof options !== "object" ||
    options === null ||
    Array.isArray(options)
  ) {
    throw new Error("Invalid input: expected options to be an object");
  }

  [
    ["dot", "string"],
    ["dash", "string"],
    ["tokenSeparator", "string"],
    ["symbolSeparator", "string"],
    ["ignoreUnknown", "boolean"],
  ].forEach(([key, type]) => {
    if (
      key in options &&
      typeof (options as Record<string, unknown>)[key] !== type
    ) {
      throw new Error(`Invalid input: expected options.${key} to be a ${type}`);
    }
  });
}

function normalize(rawText: string): string {
  return rawText.replaceAll(/\s+/g, " ").trim().toUpperCase();
}

function buildConfig(options: Partial<Config>): Config {
  return {
    dot: ".",
    dash: "-",
    tokenSeparator: " / ",
    symbolSeparator: " ",
    ignoreUnknown: false,
    dictionary: "internationalMorseCode",
    ...options,
  };
}

function buildDictionary(
  config: Config,
  mode: "encode" | "decode",
): Record<string, string> {
  let source: Record<string, string> = {};

  if (config.dictionary === "internationalMorseCode") {
    source = internationalMorseCode;
  }

  const dictionary: Record<string, string> = {};

  for (const letter in source) {
    const chars: string[] = [];

    for (const sourceChar of source[letter]) {
      if (sourceChar === ".") {
        chars.push(config.dot);
      }

      if (sourceChar === "-") {
        chars.push(config.dash);
      }
    }

    const symbol = chars.join("");

    if (mode === "encode") {
      dictionary[letter] = symbol;
    }

    if (mode === "decode") {
      dictionary[symbol] = letter;
    }
  }

  return dictionary;
}

function getMappedValue(
  key: string,
  dictionary: Record<string, string>,
  ignoreUnknown: boolean,
): string {
  if (key === "") {
    return "";
  }

  if (key in dictionary) {
    return dictionary[key];
  }

  if (!ignoreUnknown) {
    throw new Error(`Invalid input: ${key} is not allowed in source`);
  }

  return "";
}
