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
  const testCases: TestCase[] = [];

  it.for(testCases)("$name", ({ code, options, expectedText }) => {
    const actualText: string = decodeFromMorse(code, options);

    expect(actualText).toBe(expectedText);
  });
});

describe("decodeFromMorse - Error cases", () => {
  const testCases: TestCase[] = [];

  it.for(testCases)("$name", ({ code, options, expectedError }) => {
    expect(() => decodeFromMorse(code, options)).toThrow(expectedError);
  });
});
