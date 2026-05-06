import type { Config } from "./types";

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
      symbols.push(getSymbol(letter, dictionary, config.ignoreUnknown));
    }

    const token: string = symbols.join(config.symbolSeparator);
    tokens.push(token);
  }

  const code: string = tokens.join(config.tokenSeparator);
  return code;
}

function validateInput(rawText: unknown, options: unknown): void {
  // NOT IMPLEMENTED YET
}

function normalize(rawText: string): string {
  // NOT IMPLEMENTED YET
}

function buildConfig(options: Partial<Config>): Config {
  // NOT IMPLEMENTED YET
}

function buildDictionary(config: Config): Record<string, string> {
  // NOT IMPLEMENTED YET
}

function getSymbol(
  letter: string,
  dictionary: Record<string, string>,
  ignoreUnknown: boolean,
): string {
  // NOT IMPLEMENTED YET
}
