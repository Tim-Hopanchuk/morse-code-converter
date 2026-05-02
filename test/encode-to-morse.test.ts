import { encodeToMorse } from "../src/encode-to-morse";
import { describe, expect, it } from "vitest";
import { MorseConfig, TestCase } from "../src/types";

describe("encodeToMorse - Success cases", () => {
  const testCases: TestCase[] = [
    {
      name: "encodes a-z chars",
      text: "abcdefghijklmnopqrstuvwxyz",
      config: undefined,
      expectedMorse:
        ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..",
    },
    {
      name: "encodes A-Z chars",
      text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      config: undefined,
      expectedMorse:
        ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..",
    },
    {
      name: "encodes 0-9 nums",
      text: "0123456789",
      config: undefined,
      expectedMorse:
        "----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.",
    },
    {
      name: "encodes a single character",
      text: "a",
      config: undefined,
      expectedMorse: ".-",
    },
    {
      name: "encodes mixed alphanumeric characters",
      text: "Lor1Em 23 iPSUm do45lor",
      config: undefined,
      expectedMorse:
        ".-.. --- .-. .---- . -- / ..--- ...-- / .. .--. ... ..- -- / -.. --- ....- ..... .-.. --- .-.",
    },
    {
      name: "ignores unknown characters when ignoreUnknown is true",
      text: "Sed soda%les",
      config: {
        dot: ".",
        dash: "-",
        charDelim: " ",
        wordDelim: "/",
        ignoreUnknown: true,
      },
      expectedMorse: "... . -.. / ... --- -.. .- .-.. . ...",
    },
    {
      name: "returns empty string for empty input",
      text: "",
      config: undefined,
      expectedMorse: "",
    },
    {
      name: "uses custom symbols from config",
      text: "Vivamus pulvinar",
      config: {
        dot: "a",
        dash: "_",
        charDelim: "+",
        wordDelim: "t",
        ignoreUnknown: false,
      },
      expectedMorse:
        "aaa_+aa+aaa_+a_+__+aa_+aaa+t+a__a+aa_+a_aa+aaa_+aa+_a+a_+a_a",
    },
    {
      name: "uses custom intersected string sequences from config",
      text: "Fusce erat felis",
      config: {
        dot: "-a",
        dash: "b.",
        charDelim: "//",
        wordDelim: " .-/",
        ignoreUnknown: false,
      },
      expectedMorse:
        "-a-ab.-a//-a-ab.//-a-a-a//b.-ab.-a//-a// .-///-a//-ab.-a//-ab.//b.// .-///-a-ab.-a//-a//-ab.-a-a//-a-a//-a-a-a",
    },
    {
      name: "handles leading, trailing, and multiple consecutive spaces",
      text: "  hello   world  ",
      config: undefined,
      expectedMorse: ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
    },
  ];

  it.for(testCases)("$name", ({ text, config, expectedMorse }) => {
    const actualMorse: string = encodeToMorse(text, config);
    expect(actualMorse).toBe(expectedMorse);
  });
});

describe("encodeToMorse - Error and validation cases", () => {
  const testCases: TestCase[] = [
    {
      name: "throws on unknown character when ignoreUnknown is false",
      text: "Suspendisse# commodo",
      config: {
        dot: ".",
        dash: "-",
        charDelim: " ",
        wordDelim: "/",
        ignoreUnknown: false,
      },
      expectedMorse: "",
    },
    {
      name: "throws when text is a number",
      text: 95 as any,
      config: undefined,
      expectedMorse: "",
    },
    {
      name: "throws when text is a boolean",
      text: true as any,
      config: undefined,
      expectedMorse: "",
    },
    {
      name: "throws when text is null",
      text: null as any,
      config: undefined,
      expectedMorse: "",
    },
    {
      name: "throws when text is undefined",
      text: undefined as any,
      config: undefined,
      expectedMorse: "",
    },
  ];

  it.for(testCases)("$name", ({ text, config }) => {
    expect(() => encodeToMorse(text, config)).toThrow("Invalid input");
  });
});
