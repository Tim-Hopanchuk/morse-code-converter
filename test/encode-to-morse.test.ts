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
  const testCases: TestCase[] = [];

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
