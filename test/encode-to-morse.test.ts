import { encodeToMorse } from "../src/encode-to-morse";
import { Config } from "../src/types";
import { describe, expect, it } from "vitest";

interface TestCase {
  name: string;
  text: string;
  options?: Partial<Config>;
  expectedCode?: string;
  expectedError?: string;
}

describe("encodeToMorse - Success cases", () => {
  const testCases: TestCase[] = [
    {
      name: "encodes a-z letters",
      text: "abcdeéfghijklmnopqrstuvwxyz",
      expectedCode:
        ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..",
    },

    {
      name: "encodes A-Z letters",
      text: "ABCDEÉFGHIJKLMNOPQRSTUVWXYZ",
      expectedCode:
        ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..",
    },

    {
      name: "encodes 0-9 figures",
      text: "0123456789",
      expectedCode:
        "----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.",
    },

    {
      name: "encodes punctuation marks and miscellaneous signs",
      text: `.,:?'"@=+-/()`,
      expectedCode:
        ".-.-.- --..-- ---... ..--.. .----. .-..-. .--.-. -...- .-.-. -....- -..-. -.--. -.--.-",
    },

    {
      name: "encodes a single letter",
      text: "a",
      expectedCode: ".-",
    },

    {
      name: "encodes mix of letters, figures and miscellaneous signs",
      text: "LoREm, 1p(SUM) 8o+L+oR: 3@it AMET",
      expectedCode:
        ".-.. --- .-. . -- --..-- / .---- .--. -.--. ... ..- -- -.--.- / ---.. --- .-.-. .-.. .-.-. --- .-. ---... / ...-- .--.-. .. - / .- -- . -",
    },

    {
      name: "ignores unknown letter when ignoreUnknown is true",
      text: "Nam vesti%bulum",
      options: {
        ignoreUnknown: true,
      },
      expectedCode: "-. .- -- / ...- . ... - .. -... ..- .-.. ..- --",
    },

    {
      name: "returns empty string for empty text",
      text: "",
      expectedCode: "",
    },

    {
      name: "uses custom chars from config",
      text: "Viverra pulvinar",
      options: {
        dot: "a",
        dash: "+",
        tokenSeparator: "T",
        symbolSeparator: "_",
      },
      expectedCode: "aaa+_aa_aaa+_a_a+a_a+a_a+Ta++a_aa+_a+aa_aaa+_aa_+a_a+_a+a",
    },

    {
      name: "uses custom chars sequences from config",
      text: "Mauris eu erat",
      options: {
        dot: "a-",
        dash: ".b",
        tokenSeparator: " c",
        symbolSeparator: ".- / ",
      },
      expectedCode:
        ".b.b.- / a-.b.- / a-a-.b.- / a-.ba-.- / a-a-.- / a-a-a- ca-.- / a-a-.b ca-.- / a-.ba-.- / a-.b.- / .b",
    },

    {
      name: "handles leading, trailing, and multiple consecutive spaces",
      text: " Aliquam   erat  ",
      expectedCode: ".- .-.. .. --.- ..- .- -- / . .-. .- -",
    },

    {
      name: "returns empty string when text contains only unknown chars and ignoreUnknown is true",
      text: "#$%&",
      options: {
        ignoreUnknown: true,
      },
      expectedCode: "",
    },

    {
      name: "returns empty string when text contains only various whitespaces (tabs, newlines)",
      text: "   \n \t  ",
      options: {
        ignoreUnknown: true,
      },
      expectedCode: "",
    },

    {
      name: "handles empty strings as custom chars",
      text: "Donec arcu",
      options: {
        dot: "",
        dash: "",
        tokenSeparator: "",
        symbolSeparator: "",
      },
      expectedCode: "",
    },

    {
      name: "ignores unknown properties in the options object",
      text: "Tempor quis",
      options: {
        unsupportedField: "some value",
        dot: "a",
      } as any,
      expectedCode: "- a -- a--a --- a-a / --a- aa- aa aaa",
    },
  ];

  it.for(testCases)("$name", ({ text, options, expectedCode }) => {
    const actualCode: string = encodeToMorse(text, options);

    expect(actualCode).toBe(expectedCode);
  });
});

describe("encodeToMorse - Error cases", () => {
  const testCases: TestCase[] = [];

  it.for(testCases)("$name", ({ text, options, expectedError }) => {
    expect(() => encodeToMorse(text, options)).toThrow(expectedError);
  });
});
