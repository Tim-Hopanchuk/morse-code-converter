import type { Config } from "./types";
import { internationalMorseCode } from "./dictionaries/international-morse-code";

export function encodeToMorse(
  rawText: string,
  options: Partial<Config> = {},
): string {
  validateInput(rawText, options);

  const text: string = normalize(rawText);
  const config: Config = buildConfig(options);
  const dictionary: Record<string, string> = buildDictionary(config);

  const words: string[] = text.split(" ");
  const tokens: string[] = [];

  for (const word of words) {
    const letters: string[] = word.split("");
    const symbols: string[] = [];

    for (const letter of letters) {
      const symbol: string = getSymbol(
        letter,
        dictionary,
        config.ignoreUnknown,
      );

      if (symbol !== "") {
        symbols.push(symbol);
      }
    }

    const token: string = symbols.join(config.symbolSeparator);
    tokens.push(token);
  }

  const code: string = tokens.join(config.tokenSeparator);
  return code;
}

function validateInput(rawText: unknown, options: unknown): void {
  if (typeof rawText !== "string") {
    throw new Error("Invalid input: expected rawText to be a string");
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

function normalize(rawText: string): string {
  const text: string = rawText.replaceAll(/\s+/g, " ").trim().toUpperCase();
  return text;
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

    dictionary[letter] = chars.join("");
  }

  return dictionary;
}

function getSymbol(
  letter: string,
  dictionary: Record<string, string>,
  ignoreUnknown: boolean,
): string {
  if (letter === "") {
    return "";
  }

  if (letter in dictionary) {
    return dictionary[letter];
  }

  if (!ignoreUnknown) {
    throw new Error(`Invalid input: letter ${letter} is not allowed in text`);
  }

  return "";
}
