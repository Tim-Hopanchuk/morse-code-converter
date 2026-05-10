import { decodeFromMorse } from "../src/decode-from-morse";
import { Config } from "../src/types";
import { describe, expect, it } from "vitest";

interface TestCase {
  name: string;
  code: string;
  options?: Partial<Config>;
  expectedText?: string;
  expectedError?: string;
}

describe("decodeFromMorse - Success cases", () => {
  const testCases: TestCase[] = [
    {
      name: "decodes A-Z letters",
      code: ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..",
      expectedText: "ABCDEÉFGHIJKLMNOPQRSTUVWXYZ",
    },
    {
      name: "decodes 0-9 figures",
      code: "----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.",
      expectedText: "0123456789",
    },
    {
      name: "decodes punctuation marks and miscellaneous signs",
      code: ".-.-.- --..-- ---... ..--.. .----. .-..-. .--.-. -...- .-.-. -....- -..-. -.--. -.--.-",
      expectedText: `.,:?'"@=+-/()`,
    },
    {
      name: "decodes a single letter",
      code: ".-",
      expectedText: "A",
    },
    {
      name: "decodes mix of letters, figures and miscellaneous signs",
      code: ".-.. --- .-. . -- --..-- / .---- .--. -.--. ... ..- -- -.--.- / ---.. --- .-.-. .-.. .-.-. --- .-. ---... / ...-- .--.-. .. - / .- -- . -",
      expectedText: "LOREM, 1P(SUM) 8O+L+OR: 3@IT AMET",
    },
    {
      name: "ignores unknown symbol when ignoreUnknown is true",
      code: "-. .- -- / ...- % . ... - .. -... ..- .-.. ..- --",
      options: {
        ignoreUnknown: true,
      },
      expectedText: "NAM VESTIBULUM",
    },
    {
      name: "returns empty string for empty code",
      code: "",
      expectedText: "",
    },
    {
      name: "uses custom chars from config",
      code: "aaa+_aa_aaa+_a_a+a_a+a_a+Ta++a_aa+_a+aa_aaa+_aa_+a_a+_a+a",
      options: {
        dot: "a",
        dash: "+",
        tokenSeparator: "T",
        symbolSeparator: "_",
      },
      expectedText: "VIVERRA PULVINAR",
    },
    {
      name: "uses custom chars sequences from config",
      code: ".b.b.- / a-.b.- / a-a-.b.- / a-.ba-.- / a-a-.- / a-a-a- ca-.- / a-a-.b ca-.- / a-.ba-.- / a-.b.- / .b",
      options: {
        dot: "a-",
        dash: ".b",
        tokenSeparator: " c",
        symbolSeparator: ".- / ",
      },
      expectedText: "MAURIS EU ERAT",
    },
    {
      name: "returns empty string when code contains only unknown chars and ignoreUnknown is true",
      code: "#$%&",
      options: {
        ignoreUnknown: true,
      },
      expectedText: "",
    },
    {
      name: "ignores unknown properties in the options object",
      code: "- a -- a--a --- a-a / --a- aa- aa aaa",
      options: {
        unsupportedField: "some value",
        dot: "a",
      } as any,
      expectedText: "TEMPOR QUIS",
    },
  ];

  it.for(testCases)("$name", ({ code, options, expectedText }) => {
    const actualText: string = decodeFromMorse(code, options);

    expect(actualText).toBe(expectedText);
  });
});

describe("decodeFromMorse - Error cases", () => {
  const testCases: TestCase[] = [
    {
      name: "throws on unknown symbol when ignoreUnknown is false",
      code: "-.. --- -. . -.-. / .%- / -.. --- .-.. --- .-.",
      options: {
        ignoreUnknown: false,
      },
      expectedError: "Invalid input: symbol .%- is not allowed in code",
    },
    {
      name: "throws when code is not a string",
      code: false as any,
      expectedError: "Invalid input: expected code to be a string",
    },
    {
      name: "throws when options is a string",
      code: ".- . -. . .- -. / ..-. .- -.-. .. .-.. .. ... .. ...",
      options: "not an object",
      expectedError: "Invalid input: expected options to be an object",
    } as any,
    {
      name: "throws when options is a null",
      code: "..-. ..- ... -.-. . / ... . -- .--. . .-.",
      options: null,
      expectedError: "Invalid input: expected options to be an object",
    } as any,
    {
      name: "throws when options is an array",
      code: ".- .-.. .. --.- ..- .- -- / . --. . -",
      options: ["not", "an", "object"],
      expectedError: "Invalid input: expected options to be an object",
    } as any,
    {
      name: "throws when options.dot is not a string",
      code: ".- . -. . .- -. / .- -.-.",
      options: {
        dot: NaN,
      } as any,
      expectedError: "Invalid input: expected options.dot to be a string",
    },
    {
      name: "throws when options.dash is not a string",
      code: "-.. --- -. . -.-. / - .-. .. ... - .. --.- ..- .",
      options: {
        dash: true,
      } as any,
      expectedError: "Invalid input: expected options.dash to be a string",
    },
    {
      name: "throws when options.tokenSeparator is not a string",
      code: ".. -. - . --. . .-. / ...- . .-..",
      options: {
        tokenSeparator: 95,
      } as any,
      expectedError:
        "Invalid input: expected options.tokenSeparator to be a string",
    },
    {
      name: "throws when options.symbolSeparator is not a string",
      code: ".- . -. . .- -. / . -",
      options: {
        symbolSeparator: ["array"],
      } as any,
      expectedError:
        "Invalid input: expected options.symbolSeparator to be a string",
    },
    {
      name: "throws when options.ignoreUnknown is not a boolean",
      code: "... ..- ... .--. . -. -.. .. ... ... . / -- .- .-.. . ... ..- .- -.. .-",
      options: {
        ignoreUnknown: 0,
      } as any,
      expectedError:
        "Invalid input: expected options.ignoreUnknown to be a boolean",
    },
  ];

  it.for(testCases)("$name", ({ code, options, expectedError }) => {
    expect(() => decodeFromMorse(code, options)).toThrow(expectedError);
  });
});
