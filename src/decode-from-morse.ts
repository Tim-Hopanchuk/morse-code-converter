import type { Config } from "./types";

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
      letters.push(getLetter(symbol, dictionary, config.ignoreUnknown));
    }

    const word: string = letters.join("");
    words.push(word);
  }

  const text: string = words.join(" ");
  return text;
}

function validateInput(rawCode: unknown, options: unknown): void {
  // NOT IMPLEMENTED YET
}

function normalize(rawCode: string): string {
  // NOT IMPLEMENTED YET
}

function buildConfig(options: Partial<Config>): Config {
  // NOT IMPLEMENTED YET
}

function buildDictionary(config: Config): Record<string, string> {
  // NOT IMPLEMENTED YET
}

function getLetter(
  symbol: string,
  dictionary: Record<string, string>,
  ignoreUnknown: boolean,
): string {
  // NOT IMPLEMENTED YET
}
