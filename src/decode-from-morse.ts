import type { Config } from "./types";
import { internationalMorseCode } from "./dictionaries/international-morse-code";

export function decodeFromMorse(
  rawCode: string,
  options: Partial<Config> = {},
): string {
  validateInput(rawCode, options);

  const code: string = normalize(rawCode);
  const config: Config = buildConfig(options);
  const dictionary: Record<string, string> = buildDictionary(config);

  const tokens: string[] = code.split(config.tokenSeparator);
  const words: string[] = [];

  for (const token of tokens) {
    const symbols: string[] = token.split(config.symbolSeparator);
    const letters: string[] = [];

    for (const symbol of symbols) {
      const letter: string = getLetter(
        symbol,
        dictionary,
        config.ignoreUnknown,
      );

      if (letter !== "") {
        letters.push(letter);
      }
    }

    const word: string = letters.join("");
    words.push(word);
  }

  const text: string = words.join(" ");
  return text;
}

function validateInput(rawCode: unknown, options: unknown): void {
  if (typeof rawCode !== "string") {
    throw new Error("Invalid input: expected rawCode to be a string");
  }

  if (
    typeof options !== "object" ||
    options === null ||
    Array.isArray(options)
  ) {
    throw new Error("Invalid input: expected options to be an object");
  }

  if ("dot" in options && typeof options.dot !== "string") {
    throw new Error("Invalid input: expected options.dot to be a string");
  }

  if ("dash" in options && typeof options.dash !== "string") {
    throw new Error("Invalid input: expected options.dash to be a string");
  }

  if (
    "tokenSeparator" in options &&
    typeof options.tokenSeparator !== "string"
  ) {
    throw new Error(
      "Invalid input: expected options.tokenSeparator to be a string",
    );
  }

  if (
    "symbolSeparator" in options &&
    typeof options.symbolSeparator !== "string"
  ) {
    throw new Error(
      "Invalid input: expected options.symbolSeparator to be a string",
    );
  }

  if (
    "ignoreUnknown" in options &&
    typeof options.ignoreUnknown !== "boolean"
  ) {
    throw new Error(
      "Invalid input: expected options.ignoreUnknown to be a boolean",
    );
  }
}

function normalize(rawCode: string): string {
  // NOT IMPLEMENTED YET
  return rawCode;
}

function buildConfig(options: Partial<Config>): Config {
  const config: Config = {
    dot: ".",
    dash: "-",
    tokenSeparator: " / ",
    symbolSeparator: " ",
    ignoreUnknown: false,
    dictionary: "internationalMorseCode",
    ...options,
  };
  return config;
}

function buildDictionary(config: Config): Record<string, string> {
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

    dictionary[chars.join("")] = letter;
  }

  return dictionary;
}

function getLetter(
  symbol: string,
  dictionary: Record<string, string>,
  ignoreUnknown: boolean,
): string {
  if (symbol === "") {
    return "";
  }

  if (symbol in dictionary) {
    return dictionary[symbol];
  }

  if (!ignoreUnknown) {
    throw new Error(`Invalid input: symbol ${symbol} is not allowed in code`);
  }

  return "";
}
