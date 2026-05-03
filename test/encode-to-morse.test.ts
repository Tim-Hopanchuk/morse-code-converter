import { encodeToMorse } from "../src/encode-to-morse";
import { describe, expect, it } from "vitest";
import { Config } from "../src/types";

export interface TestCase {
  name: string;
  text: string;
  config?: Config;
  expectedMorse?: string;
  expectedError?: string;
}

describe("encodeToMorse - Success cases", () => {
  const testCases: TestCase[] = [
    {
      name: "encodes a-z chars",
      text: "abcdefghijklmnopqrstuvwxyz",
      expectedMorse:
        ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..",
    },
    {
      name: "encodes A-Z chars",
      text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      expectedMorse:
        ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..",
    },
    {
      name: "encodes 0-9 nums",
      text: "0123456789",
      expectedMorse:
        "----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.",
    },
    {
      name: "encodes a single character",
      text: "a",
      expectedMorse: ".-",
    },
    {
      name: "encodes mixed alphanumeric characters",
      text: "Lor1Em 23 iPSUm do45lor",
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
      expectedMorse: ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
    },
    {
      name: "returns empty string when text contains only unknown chars and ignoreUnknown is true",
      text: "@#$%^&*",
      config: { ignoreUnknown: true },
      expectedMorse: "",
    },
    {
      name: "returns empty string when text contains only various whitespaces (tabs, newlines)",
      text: "   \n \t  ",
      expectedMorse: "",
    },
    {
      name: "handles empty strings as custom delimiters and symbols without crashing",
      text: "SOS",
      config: {
        dot: "",
        dash: "",
        charDelim: "",
        wordDelim: "",
      },
      expectedMorse: "",
    },
    {
      name: "ignores unknown properties in the config object",
      text: "a",
      config: {
        unsupportedField: "some value",
        dot: "*",
      } as any,
      expectedMorse: "*-",
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
      expectedError: "Invalid input: unsupported character in text",
    },
    {
      name: "throws when text is a number",
      text: 95 as any,
      config: undefined,
      expectedError: "Invalid input: expected 'text' to be a string",
    },
    {
      name: "throws when text is null",
      text: null as any,
      config: undefined,
      expectedError: "Invalid input: expected 'text' to be a string",
    },
    {
      name: "throws when text is undefined",
      text: undefined as any,
      config: undefined,
      expectedError: "Invalid input: expected 'text' to be a string",
    },

    {
      name: "throws when text is an object",
      text: {} as any,
      config: undefined,
      expectedError: "Invalid input: expected 'text' to be a string",
    },
    {
      name: "throws when config is a number",
      text: "hello",
      config: 123 as any,
      expectedError: "Invalid input: expected 'config' to be an object",
    },
    {
      name: "throws when config is an array",
      text: "hello",
      config: [] as any,
      expectedError: "Invalid input: expected 'config' to be an object",
    },
    {
      name: "throws when config.dot is not a string",
      text: "hello",
      config: { dot: 42 },
      expectedError: "Invalid input: expected config.dot to be a string",
    },
    {
      name: "throws when config.dash is not a string",
      text: "hello",
      config: { dash: true },
      expectedError: "Invalid input: expected config.dash to be a string",
    },
    {
      name: "throws when config.charDelim is not a string",
      text: "hello",
      config: { charDelim: null },
      expectedError: "Invalid input: expected config.charDelim to be a string",
    },
    {
      name: "throws when config.wordDelim is not a string",
      text: "hello",
      config: { wordDelim: {} },
      expectedError: "Invalid input: expected config.wordDelim to be a string",
    },
    {
      name: "throws when config.ignoreUnknown is not a boolean",
      text: "hello",
      config: { ignoreUnknown: "yes" },
      expectedError:
        "Invalid input: expected config.ignoreUnknown to be a boolean",
    },
    {
      name: "throws when dot is explicitly undefined",
      text: "a",
      config: { dot: undefined },
      expectedError: "Invalid input: expected config.dot to be a string",
    },
    {
      name: "throws when ignoreUnknown is explicitly undefined",
      text: "a",
      config: { ignoreUnknown: undefined },
      expectedError:
        "Invalid input: expected config.ignoreUnknown to be a boolean",
    },
  ];

  it.for(testCases)("$name", ({ text, config, expectedError }) => {
    expect(() => encodeToMorse(text, config)).toThrow(expectedError);
  });
});

it("encodes long text", () => {
  const text =
    "Lorem ipsum dolor sit amet consectetur adipiscing elit In id nunc mauris Curabitur bibendum sit amet dolor dignissim facilisis Duis varius accumsan dapibus In hac habitasse platea dictumst Vestibulum aliquet auctor diam sit amet maximus turpis fermentum id Orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus Duis sodales ipsum non magna convallis venenatis In sodales euismod porta Pellentesque metus dolor luctus sit amet quam nec pharetra vehicula sem Etiam dignissim mauris quis erat blandit id sagittis lacus dictum Donec pellentesque orci id lectus lacinia ut congue felis tempor Sed blandit risus sollicitudin commodo porta sem eros efficitur ipsum sit amet vehicula lorem ex non purus Nulla sit amet tristique nisi Integer varius at lacus in gravidaIn imperdiet varius mauris vitae rhoncus mauris convallis ut Sed eget mauris elit Curabitur ac volutpat quam Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae Aenean sempervulputate massa Duis vel tincidunt lacus Nunc vel massa sit amet leo rhoncus euismod laoreet eget lacus Aliquam ante libero sollicitudin ut risus sed condimentum pretium lectus Nulla luctus sapien vel turpis egestas nec scelerisque urna accumsan Donec consequat sem a ligula lacinia sed pulvinar mi fringilla In feugiat mi sit amet tincidunt ornare ipsum lectus tincidunt risus et ornare massa odio a tellus Aenean sed volutpat nisi Phasellus mauris sem molestie ac ante et vulputate venenatis enim Cras blandit metus et enim ullamcorper posuere Nunc pellentesque nisl a augue accumsan a volutpat lorem molestie Sed semper vulputate leoPhasellus consequat laoreet accumsan Suspendisse aliquam scelerisque nulla ut iaculis libero eleifend et Nam mollis vehicula erat non commodo lorem luctus varius Curabitur nisl sapien porttitor ut vulputate sed porttitor id ligula Cras eleifend elit eu ultrices congue tellus magna pellentesque dui eget lacinia tortor eros in ante Vestibulum placerat lacus metus uis lobortis purus pharetra vel Fusce dictum orci in cursus malesuada quam magna sagittis elit vel dignissim ante urna vel loremNunc fringilla convallis ex a cursus leo tristique sit amet Quisque sit amet pretium turpis et laoreet nunc Vivamus nec lorem ut nisl vulputate feugiat Mauris sit amet lorem et metus dictum posuere nec et diam Mauris quis faucibus libero sed sollicitudin diam Ut non turpis quis mauris consectetur semper Proin sem felis sagittis at aliquet non consequat ac est Praesent a turpis lectusAliquam nec justo lectus Vivamus egestas nulla vel orci mollis id porttitor odio ultricies Aliquam eu tempor ligula Nullam quis efficitur urna Ut felis dolor rutrum id enim nec commodo ultricies eros Proin bibendum tempus felis sit amet porttitor Nulla eros felis venenatis a rhoncus in lacinia eget mauris Nam cursus justo in nulla porta in placerat elit volutpatMaecenas interdum sapien leo sed aliquet enim efficitur eget Fusce turpis ipsum placerat eu neque elementum lacinia sempernunc Fusce at lectus id eros elementum euismod Aliquam vitae augue leo Nam tempor nisl sed mauris rutrum eu eleifend neque ultrices Praesent erat dolor posuere at neque sollicitudin congue consequat arcu Donec dignissim tortor quis cursus interdum nibh augue vulputate metus eget pellentesque dolor turpis a mauris Donec eu nunc quam Donec efficitur imperdiet erat eu pretium justo vehicula non Curabitur sed arcu non ante aliquam aliquam Ut sed dolor eget nunc ullamcorper laoreet Ut elementum felis eget viverra posuere justo enim hendrerit lectus ac efficitur dui nunc placerat tellus Integer semper sed arcu sed pellentesquePraesent posuere tellus nec dolor lacinia elementum Ut fringilla finibus tincidunt Pellentesque nisl massa pretium vitae neque ut maximus aliquam leo In hac habitasse platea dictumst Aliquam erat volutpat Sed et lorem et nibh dignissim eleifend Ut sit amet tortor diam Ut consectetur ligula id magna vestibulum eu facilisis augue condimentum Nulla et vehicula massa luctusiaculis mi Quisque vulputate vitae nibh ac molestie Mauris blandit condimentum sem auctor malesuada lectus dictum a Nulla at dui elit Suspendisse et nibh aliquam tincidunt libero at sollicitudin purus Nam sagittis ut dui at pharetra Donec bibendum arcu id tincidunt facilisis Nam finibus aliquam consecteturInteger sed suscipit nisl quis imperdiet dolor Nunc malesuada odio elit Morbi elementum tellus nec est faucibus at molestie quam congue Cras ut ex eget urna gravida luctus dapibus vel enim Nunc eu consequat ipsum Maecenas volutpat sapien vel hendrerit tincidunt sapien diam luctus enim eget tristique metus quam scelerisque diam Phasellus dignissim sagittis lorem in suscipit eros faucibus non Quisque vel massa congue euismod magna eget interdum neque Pellentesque eget mollis velit non suscipit arcu Duis sed ipsum tincidunt maximus nulla at blandit risus Vestibulum at consequat libero quis vehicula massa Quisque suscipit massa lacinia finibus posuere neque lorem vulputate sapien quis elefend ante est ut leo Nam sit amet feugiat nisl ac viverra nisi Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas Etiam nec maximus elit In egestas tempor nisi a sodales diam dignissim utFusce fermentum lectus non purus rhoncus quis egestas justo aliquam Nam a tellus vehicula eleifend dolor nec sagittis turpis Nam vitae rutrum tellus eget luctus velit Quisque a orci feugiat rutrum nunc sit amet iaculis nulla Lorem ipsum dolor sit amet consectetur adipiscing elit Pellentesque at hendrerit metus Aliquam at luctus nulla nec fermentum elitUt sit amet neque ut mi sagittis tristique Nam porttitor sem a ligula imperdiet cursus ac id massa Nullam tristique sapien diam nec tincidunt erat tempus facilisis Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae Quisque augue neque consequat in tortor id malesuada tempus est Vestibulum a rhoncus quam eget vulputate mauris Nullam sed eros leo Phasellus enim tortor egestas nonorci sodales eleifend vulputate eros Sed vestibulum placerat est in viverra Integer ultricies metus leo non consectetur ante egestas et Praesent et augue nec tellus facilisis eleifend";
  const expectedMorse =
    ".-.. --- .-. . -- / .. .--. ... ..- -- / -.. --- .-.. --- .-. / ... .. - / .- -- . - / -.-. --- -. ... . -.-. - . - ..- .-. / .- -.. .. .--. .. ... -.-. .. -. --. / . .-.. .. - / .. -. / .. -.. / -. ..- -. -.-. / -- .- ..- .-. .. ... / -.-. ..- .-. .- -... .. - ..- .-. / -... .. -... . -. -.. ..- -- / ... .. - / .- -- . - / -.. --- .-.. --- .-. / -.. .. --. -. .. ... ... .. -- / ..-. .- -.-. .. .-.. .. ... .. ... / -.. ..- .. ... / ...- .- .-. .. ..- ... / .- -.-. -.-. ..- -- ... .- -. / -.. .- .--. .. -... ..- ... / .. -. / .... .- -.-. / .... .- -... .. - .- ... ... . / .--. .-.. .- - . .- / -.. .. -.-. - ..- -- ... - / ...- . ... - .. -... ..- .-.. ..- -- / .- .-.. .. --.- ..- . - / .- ..- -.-. - --- .-. / -.. .. .- -- / ... .. - / .- -- . - / -- .- -..- .. -- ..- ... / - ..- .-. .--. .. ... / ..-. . .-. -- . -. - ..- -- / .. -.. / --- .-. -.-. .. / ...- .- .-. .. ..- ... / -. .- - --- --.- ..- . / .--. . -. .- - .. -... ..- ... / . - / -- .- --. -. .. ... / -.. .. ... / .--. .- .-. - ..- .-. .. . -. - / -- --- -. - . ... / -. .- ... -.-. . - ..- .-. / .-. .. -.. .. -.-. ..- .-.. ..- ... / -- ..- ... / -.. ..- .. ... / ... --- -.. .- .-.. . ... / .. .--. ... ..- -- / -. --- -. / -- .- --. -. .- / -.-. --- -. ...- .- .-.. .-.. .. ... / ...- . -. . -. .- - .. ... / .. -. / ... --- -.. .- .-.. . ... / . ..- .. ... -- --- -.. / .--. --- .-. - .- / .--. . .-.. .-.. . -. - . ... --.- ..- . / -- . - ..- ... / -.. --- .-.. --- .-. / .-.. ..- -.-. - ..- ... / ... .. - / .- -- . - / --.- ..- .- -- / -. . -.-. / .--. .... .- .-. . - .-. .- / ...- . .... .. -.-. ..- .-.. .- / ... . -- / . - .. .- -- / -.. .. --. -. .. ... ... .. -- / -- .- ..- .-. .. ... / --.- ..- .. ... / . .-. .- - / -... .-.. .- -. -.. .. - / .. -.. / ... .- --. .. - - .. ... / .-.. .- -.-. ..- ... / -.. .. -.-. - ..- -- / -.. --- -. . -.-. / .--. . .-.. .-.. . -. - . ... --.- ..- . / --- .-. -.-. .. / .. -.. / .-.. . -.-. - ..- ... / .-.. .- -.-. .. -. .. .- / ..- - / -.-. --- -. --. ..- . / ..-. . .-.. .. ... / - . -- .--. --- .-. / ... . -.. / -... .-.. .- -. -.. .. - / .-. .. ... ..- ... / ... --- .-.. .-.. .. -.-. .. - ..- -.. .. -. / -.-. --- -- -- --- -.. --- / .--. --- .-. - .- / ... . -- / . .-. --- ... / . ..-. ..-. .. -.-. .. - ..- .-. / .. .--. ... ..- -- / ... .. - / .- -- . - / ...- . .... .. -.-. ..- .-.. .- / .-.. --- .-. . -- / . -..- / -. --- -. / .--. ..- .-. ..- ... / -. ..- .-.. .-.. .- / ... .. - / .- -- . - / - .-. .. ... - .. --.- ..- . / -. .. ... .. / .. -. - . --. . .-. / ...- .- .-. .. ..- ... / .- - / .-.. .- -.-. ..- ... / .. -. / --. .-. .- ...- .. -.. .- .. -. / .. -- .--. . .-. -.. .. . - / ...- .- .-. .. ..- ... / -- .- ..- .-. .. ... / ...- .. - .- . / .-. .... --- -. -.-. ..- ... / -- .- ..- .-. .. ... / -.-. --- -. ...- .- .-.. .-.. .. ... / ..- - / ... . -.. / . --. . - / -- .- ..- .-. .. ... / . .-.. .. - / -.-. ..- .-. .- -... .. - ..- .-. / .- -.-. / ...- --- .-.. ..- - .--. .- - / --.- ..- .- -- / ...- . ... - .. -... ..- .-.. ..- -- / .- -. - . / .. .--. ... ..- -- / .--. .-. .. -- .. ... / .. -. / ..-. .- ..- -.-. .. -... ..- ... / --- .-. -.-. .. / .-.. ..- -.-. - ..- ... / . - / ..- .-.. - .-. .. -.-. . ... / .--. --- ... ..- . .-. . / -.-. ..- -... .. .-.. .. .- / -.-. ..- .-. .- . / .- . -. . .- -. / ... . -- .--. . .-. ...- ..- .-.. .--. ..- - .- - . / -- .- ... ... .- / -.. ..- .. ... / ...- . .-.. / - .. -. -.-. .. -.. ..- -. - / .-.. .- -.-. ..- ... / -. ..- -. -.-. / ...- . .-.. / -- .- ... ... .- / ... .. - / .- -- . - / .-.. . --- / .-. .... --- -. -.-. ..- ... / . ..- .. ... -- --- -.. / .-.. .- --- .-. . . - / . --. . - / .-.. .- -.-. ..- ... / .- .-.. .. --.- ..- .- -- / .- -. - . / .-.. .. -... . .-. --- / ... --- .-.. .-.. .. -.-. .. - ..- -.. .. -. / ..- - / .-. .. ... ..- ... / ... . -.. / -.-. --- -. -.. .. -- . -. - ..- -- / .--. .-. . - .. ..- -- / .-.. . -.-. - ..- ... / -. ..- .-.. .-.. .- / .-.. ..- -.-. - ..- ... / ... .- .--. .. . -. / ...- . .-.. / - ..- .-. .--. .. ... / . --. . ... - .- ... / -. . -.-. / ... -.-. . .-.. . .-. .. ... --.- ..- . / ..- .-. -. .- / .- -.-. -.-. ..- -- ... .- -. / -.. --- -. . -.-. / -.-. --- -. ... . --.- ..- .- - / ... . -- / .- / .-.. .. --. ..- .-.. .- / .-.. .- -.-. .. -. .. .- / ... . -.. / .--. ..- .-.. ...- .. -. .- .-. / -- .. / ..-. .-. .. -. --. .. .-.. .-.. .- / .. -. / ..-. . ..- --. .. .- - / -- .. / ... .. - / .- -- . - / - .. -. -.-. .. -.. ..- -. - / --- .-. -. .- .-. . / .. .--. ... ..- -- / .-.. . -.-. - ..- ... / - .. -. -.-. .. -.. ..- -. - / .-. .. ... ..- ... / . - / --- .-. -. .- .-. . / -- .- ... ... .- / --- -.. .. --- / .- / - . .-.. .-.. ..- ... / .- . -. . .- -. / ... . -.. / ...- --- .-.. ..- - .--. .- - / -. .. ... .. / .--. .... .- ... . .-.. .-.. ..- ... / -- .- ..- .-. .. ... / ... . -- / -- --- .-.. . ... - .. . / .- -.-. / .- -. - . / . - / ...- ..- .-.. .--. ..- - .- - . / ...- . -. . -. .- - .. ... / . -. .. -- / -.-. .-. .- ... / -... .-.. .- -. -.. .. - / -- . - ..- ... / . - / . -. .. -- / ..- .-.. .-.. .- -- -.-. --- .-. .--. . .-. / .--. --- ... ..- . .-. . / -. ..- -. -.-. / .--. . .-.. .-.. . -. - . ... --.- ..- . / -. .. ... .-.. / .- / .- ..- --. ..- . / .- -.-. -.-. ..- -- ... .- -. / .- / ...- --- .-.. ..- - .--. .- - / .-.. --- .-. . -- / -- --- .-.. . ... - .. . / ... . -.. / ... . -- .--. . .-. / ...- ..- .-.. .--. ..- - .- - . / .-.. . --- .--. .... .- ... . .-.. .-.. ..- ... / -.-. --- -. ... . --.- ..- .- - / .-.. .- --- .-. . . - / .- -.-. -.-. ..- -- ... .- -. / ... ..- ... .--. . -. -.. .. ... ... . / .- .-.. .. --.- ..- .- -- / ... -.-. . .-.. . .-. .. ... --.- ..- . / -. ..- .-.. .-.. .- / ..- - / .. .- -.-. ..- .-.. .. ... / .-.. .. -... . .-. --- / . .-.. . .. ..-. . -. -.. / . - / -. .- -- / -- --- .-.. .-.. .. ... / ...- . .... .. -.-. ..- .-.. .- / . .-. .- - / -. --- -. / -.-. --- -- -- --- -.. --- / .-.. --- .-. . -- / .-.. ..- -.-. - ..- ... / ...- .- .-. .. ..- ... / -.-. ..- .-. .- -... .. - ..- .-. / -. .. ... .-.. / ... .- .--. .. . -. / .--. --- .-. - - .. - --- .-. / ..- - / ...- ..- .-.. .--. ..- - .- - . / ... . -.. / .--. --- .-. - - .. - --- .-. / .. -.. / .-.. .. --. ..- .-.. .- / -.-. .-. .- ... / . .-.. . .. ..-. . -. -.. / . .-.. .. - / . ..- / ..- .-.. - .-. .. -.-. . ... / -.-. --- -. --. ..- . / - . .-.. .-.. ..- ... / -- .- --. -. .- / .--. . .-.. .-.. . -. - . ... --.- ..- . / -.. ..- .. / . --. . - / .-.. .- -.-. .. -. .. .- / - --- .-. - --- .-. / . .-. --- ... / .. -. / .- -. - . / ...- . ... - .. -... ..- .-.. ..- -- / .--. .-.. .- -.-. . .-. .- - / .-.. .- -.-. ..- ... / -- . - ..- ... / ..- .. ... / .-.. --- -... --- .-. - .. ... / .--. ..- .-. ..- ... / .--. .... .- .-. . - .-. .- / ...- . .-.. / ..-. ..- ... -.-. . / -.. .. -.-. - ..- -- / --- .-. -.-. .. / .. -. / -.-. ..- .-. ... ..- ... / -- .- .-.. . ... ..- .- -.. .- / --.- ..- .- -- / -- .- --. -. .- / ... .- --. .. - - .. ... / . .-.. .. - / ...- . .-.. / -.. .. --. -. .. ... ... .. -- / .- -. - . / ..- .-. -. .- / ...- . .-.. / .-.. --- .-. . -- -. ..- -. -.-. / ..-. .-. .. -. --. .. .-.. .-.. .- / -.-. --- -. ...- .- .-.. .-.. .. ... / . -..- / .- / -.-. ..- .-. ... ..- ... / .-.. . --- / - .-. .. ... - .. --.- ..- . / ... .. - / .- -- . - / --.- ..- .. ... --.- ..- . / ... .. - / .- -- . - / .--. .-. . - .. ..- -- / - ..- .-. .--. .. ... / . - / .-.. .- --- .-. . . - / -. ..- -. -.-. / ...- .. ...- .- -- ..- ... / -. . -.-. / .-.. --- .-. . -- / ..- - / -. .. ... .-.. / ...- ..- .-.. .--. ..- - .- - . / ..-. . ..- --. .. .- - / -- .- ..- .-. .. ... / ... .. - / .- -- . - / .-.. --- .-. . -- / . - / -- . - ..- ... / -.. .. -.-. - ..- -- / .--. --- ... ..- . .-. . / -. . -.-. / . - / -.. .. .- -- / -- .- ..- .-. .. ... / --.- ..- .. ... / ..-. .- ..- -.-. .. -... ..- ... / .-.. .. -... . .-. --- / ... . -.. / ... --- .-.. .-.. .. -.-. .. - ..- -.. .. -. / -.. .. .- -- / ..- - / -. --- -. / - ..- .-. .--. .. ... / --.- ..- .. ... / -- .- ..- .-. .. ... / -.-. --- -. ... . -.-. - . - ..- .-. / ... . -- .--. . .-. / .--. .-. --- .. -. / ... . -- / ..-. . .-.. .. ... / ... .- --. .. - - .. ... / .- - / .- .-.. .. --.- ..- . - / -. --- -. / -.-. --- -. ... . --.- ..- .- - / .- -.-. / . ... - / .--. .-. .- . ... . -. - / .- / - ..- .-. .--. .. ... / .-.. . -.-. - ..- ... .- .-.. .. --.- ..- .- -- / -. . -.-. / .--- ..- ... - --- / .-.. . -.-. - ..- ... / ...- .. ...- .- -- ..- ... / . --. . ... - .- ... / -. ..- .-.. .-.. .- / ...- . .-.. / --- .-. -.-. .. / -- --- .-.. .-.. .. ... / .. -.. / .--. --- .-. - - .. - --- .-. / --- -.. .. --- / ..- .-.. - .-. .. -.-. .. . ... / .- .-.. .. --.- ..- .- -- / . ..- / - . -- .--. --- .-. / .-.. .. --. ..- .-.. .- / -. ..- .-.. .-.. .- -- / --.- ..- .. ... / . ..-. ..-. .. -.-. .. - ..- .-. / ..- .-. -. .- / ..- - / ..-. . .-.. .. ... / -.. --- .-.. --- .-. / .-. ..- - .-. ..- -- / .. -.. / . -. .. -- / -. . -.-. / -.-. --- -- -- --- -.. --- / ..- .-.. - .-. .. -.-. .. . ... / . .-. --- ... / .--. .-. --- .. -. / -... .. -... . -. -.. ..- -- / - . -- .--. ..- ... / ..-. . .-.. .. ... / ... .. - / .- -- . - / .--. --- .-. - - .. - --- .-. / -. ..- .-.. .-.. .- / . .-. --- ... / ..-. . .-.. .. ... / ...- . -. . -. .- - .. ... / .- / .-. .... --- -. -.-. ..- ... / .. -. / .-.. .- -.-. .. -. .. .- / . --. . - / -- .- ..- .-. .. ... / -. .- -- / -.-. ..- .-. ... ..- ... / .--- ..- ... - --- / .. -. / -. ..- .-.. .-.. .- / .--. --- .-. - .- / .. -. / .--. .-.. .- -.-. . .-. .- - / . .-.. .. - / ...- --- .-.. ..- - .--. .- - -- .- . -.-. . -. .- ... / .. -. - . .-. -.. ..- -- / ... .- .--. .. . -. / .-.. . --- / ... . -.. / .- .-.. .. --.- ..- . - / . -. .. -- / . ..-. ..-. .. -.-. .. - ..- .-. / . --. . - / ..-. ..- ... -.-. . / - ..- .-. .--. .. ... / .. .--. ... ..- -- / .--. .-.. .- -.-. . .-. .- - / . ..- / -. . --.- ..- . / . .-.. . -- . -. - ..- -- / .-.. .- -.-. .. -. .. .- / ... . -- .--. . .-. -. ..- -. -.-. / ..-. ..- ... -.-. . / .- - / .-.. . -.-. - ..- ... / .. -.. / . .-. --- ... / . .-.. . -- . -. - ..- -- / . ..- .. ... -- --- -.. / .- .-.. .. --.- ..- .- -- / ...- .. - .- . / .- ..- --. ..- . / .-.. . --- / -. .- -- / - . -- .--. --- .-. / -. .. ... .-.. / ... . -.. / -- .- ..- .-. .. ... / .-. ..- - .-. ..- -- / . ..- / . .-.. . .. ..-. . -. -.. / -. . --.- ..- . / ..- .-.. - .-. .. -.-. . ... / .--. .-. .- . ... . -. - / . .-. .- - / -.. --- .-.. --- .-. / .--. --- ... ..- . .-. . / .- - / -. . --.- ..- . / ... --- .-.. .-.. .. -.-. .. - ..- -.. .. -. / -.-. --- -. --. ..- . / -.-. --- -. ... . --.- ..- .- - / .- .-. -.-. ..- / -.. --- -. . -.-. / -.. .. --. -. .. ... ... .. -- / - --- .-. - --- .-. / --.- ..- .. ... / -.-. ..- .-. ... ..- ... / .. -. - . .-. -.. ..- -- / -. .. -... .... / .- ..- --. ..- . / ...- ..- .-.. .--. ..- - .- - . / -- . - ..- ... / . --. . - / .--. . .-.. .-.. . -. - . ... --.- ..- . / -.. --- .-.. --- .-. / - ..- .-. .--. .. ... / .- / -- .- ..- .-. .. ... / -.. --- -. . -.-. / . ..- / -. ..- -. -.-. / --.- ..- .- -- / -.. --- -. . -.-. / . ..-. ..-. .. -.-. .. - ..- .-. / .. -- .--. . .-. -.. .. . - / . .-. .- - / . ..- / .--. .-. . - .. ..- -- / .--- ..- ... - --- / ...- . .... .. -.-. ..- .-.. .- / -. --- -. / -.-. ..- .-. .- -... .. - ..- .-. / ... . -.. / .- .-. -.-. ..- / -. --- -. / .- -. - . / .- .-.. .. --.- ..- .- -- / .- .-.. .. --.- ..- .- -- / ..- - / ... . -.. / -.. --- .-.. --- .-. / . --. . - / -. ..- -. -.-. / ..- .-.. .-.. .- -- -.-. --- .-. .--. . .-. / .-.. .- --- .-. . . - / ..- - / . .-.. . -- . -. - ..- -- / ..-. . .-.. .. ... / . --. . - / ...- .. ...- . .-. .-. .- / .--. --- ... ..- . .-. . / .--- ..- ... - --- / . -. .. -- / .... . -. -.. .-. . .-. .. - / .-.. . -.-. - ..- ... / .- -.-. / . ..-. ..-. .. -.-. .. - ..- .-. / -.. ..- .. / -. ..- -. -.-. / .--. .-.. .- -.-. . .-. .- - / - . .-.. .-.. ..- ... / .. -. - . --. . .-. / ... . -- .--. . .-. / ... . -.. / .- .-. -.-. ..- / ... . -.. / .--. . .-.. .-.. . -. - . ... --.- ..- . .--. .-. .- . ... . -. - / .--. --- ... ..- . .-. . / - . .-.. .-.. ..- ... / -. . -.-. / -.. --- .-.. --- .-. / .-.. .- -.-. .. -. .. .- / . .-.. . -- . -. - ..- -- / ..- - / ..-. .-. .. -. --. .. .-.. .-.. .- / ..-. .. -. .. -... ..- ... / - .. -. -.-. .. -.. ..- -. - / .--. . .-.. .-.. . -. - . ... --.- ..- . / -. .. ... .-.. / -- .- ... ... .- / .--. .-. . - .. ..- -- / ...- .. - .- . / -. . --.- ..- . / ..- - / -- .- -..- .. -- ..- ... / .- .-.. .. --.- ..- .- -- / .-.. . --- / .. -. / .... .- -.-. / .... .- -... .. - .- ... ... . / .--. .-.. .- - . .- / -.. .. -.-. - ..- -- ... - / .- .-.. .. --.- ..- .- -- / . .-. .- - / ...- --- .-.. ..- - .--. .- - / ... . -.. / . - / .-.. --- .-. . -- / . - / -. .. -... .... / -.. .. --. -. .. ... ... .. -- / . .-.. . .. ..-. . -. -.. / ..- - / ... .. - / .- -- . - / - --- .-. - --- .-. / -.. .. .- -- / ..- - / -.-. --- -. ... . -.-. - . - ..- .-. / .-.. .. --. ..- .-.. .- / .. -.. / -- .- --. -. .- / ...- . ... - .. -... ..- .-.. ..- -- / . ..- / ..-. .- -.-. .. .-.. .. ... .. ... / .- ..- --. ..- . / -.-. --- -. -.. .. -- . -. - ..- -- / -. ..- .-.. .-.. .- / . - / ...- . .... .. -.-. ..- .-.. .- / -- .- ... ... .- / .-.. ..- -.-. - ..- ... .. .- -.-. ..- .-.. .. ... / -- .. / --.- ..- .. ... --.- ..- . / ...- ..- .-.. .--. ..- - .- - . / ...- .. - .- . / -. .. -... .... / .- -.-. / -- --- .-.. . ... - .. . / -- .- ..- .-. .. ... / -... .-.. .- -. -.. .. - / -.-. --- -. -.. .. -- . -. - ..- -- / ... . -- / .- ..- -.-. - --- .-. / -- .- .-.. . ... ..- .- -.. .- / .-.. . -.-. - ..- ... / -.. .. -.-. - ..- -- / .- / -. ..- .-.. .-.. .- / .- - / -.. ..- .. / . .-.. .. - / ... ..- ... .--. . -. -.. .. ... ... . / . - / -. .. -... .... / .- .-.. .. --.- ..- .- -- / - .. -. -.-. .. -.. ..- -. - / .-.. .. -... . .-. --- / .- - / ... --- .-.. .-.. .. -.-. .. - ..- -.. .. -. / .--. ..- .-. ..- ... / -. .- -- / ... .- --. .. - - .. ... / ..- - / -.. ..- .. / .- - / .--. .... .- .-. . - .-. .- / -.. --- -. . -.-. / -... .. -... . -. -.. ..- -- / .- .-. -.-. ..- / .. -.. / - .. -. -.-. .. -.. ..- -. - / ..-. .- -.-. .. .-.. .. ... .. ... / -. .- -- / ..-. .. -. .. -... ..- ... / .- .-.. .. --.- ..- .- -- / -.-. --- -. ... . -.-. - . - ..- .-. .. -. - . --. . .-. / ... . -.. / ... ..- ... -.-. .. .--. .. - / -. .. ... .-.. / --.- ..- .. ... / .. -- .--. . .-. -.. .. . - / -.. --- .-.. --- .-. / -. ..- -. -.-. / -- .- .-.. . ... ..- .- -.. .- / --- -.. .. --- / . .-.. .. - / -- --- .-. -... .. / . .-.. . -- . -. - ..- -- / - . .-.. .-.. ..- ... / -. . -.-. / . ... - / ..-. .- ..- -.-. .. -... ..- ... / .- - / -- --- .-.. . ... - .. . / --.- ..- .- -- / -.-. --- -. --. ..- . / -.-. .-. .- ... / ..- - / . -..- / . --. . - / ..- .-. -. .- / --. .-. .- ...- .. -.. .- / .-.. ..- -.-. - ..- ... / -.. .- .--. .. -... ..- ... / ...- . .-.. / . -. .. -- / -. ..- -. -.-. / . ..- / -.-. --- -. ... . --.- ..- .- - / .. .--. ... ..- -- / -- .- . -.-. . -. .- ... / ...- --- .-.. ..- - .--. .- - / ... .- .--. .. . -. / ...- . .-.. / .... . -. -.. .-. . .-. .. - / - .. -. -.-. .. -.. ..- -. - / ... .- .--. .. . -. / -.. .. .- -- / .-.. ..- -.-. - ..- ... / . -. .. -- / . --. . - / - .-. .. ... - .. --.- ..- . / -- . - ..- ... / --.- ..- .- -- / ... -.-. . .-.. . .-. .. ... --.- ..- . / -.. .. .- -- / .--. .... .- ... . .-.. .-.. ..- ... / -.. .. --. -. .. ... ... .. -- / ... .- --. .. - - .. ... / .-.. --- .-. . -- / .. -. / ... ..- ... -.-. .. .--. .. - / . .-. --- ... / ..-. .- ..- -.-. .. -... ..- ... / -. --- -. / --.- ..- .. ... --.- ..- . / ...- . .-.. / -- .- ... ... .- / -.-. --- -. --. ..- . / . ..- .. ... -- --- -.. / -- .- --. -. .- / . --. . - / .. -. - . .-. -.. ..- -- / -. . --.- ..- . / .--. . .-.. .-.. . -. - . ... --.- ..- . / . --. . - / -- --- .-.. .-.. .. ... / ...- . .-.. .. - / -. --- -. / ... ..- ... -.-. .. .--. .. - / .- .-. -.-. ..- / -.. ..- .. ... / ... . -.. / .. .--. ... ..- -- / - .. -. -.-. .. -.. ..- -. - / -- .- -..- .. -- ..- ... / -. ..- .-.. .-.. .- / .- - / -... .-.. .- -. -.. .. - / .-. .. ... ..- ... / ...- . ... - .. -... ..- .-.. ..- -- / .- - / -.-. --- -. ... . --.- ..- .- - / .-.. .. -... . .-. --- / --.- ..- .. ... / ...- . .... .. -.-. ..- .-.. .- / -- .- ... ... .- / --.- ..- .. ... --.- ..- . / ... ..- ... -.-. .. .--. .. - / -- .- ... ... .- / .-.. .- -.-. .. -. .. .- / ..-. .. -. .. -... ..- ... / .--. --- ... ..- . .-. . / -. . --.- ..- . / .-.. --- .-. . -- / ...- ..- .-.. .--. ..- - .- - . / ... .- .--. .. . -. / --.- ..- .. ... / . .-.. . ..-. . -. -.. / .- -. - . / . ... - / ..- - / .-.. . --- / -. .- -- / ... .. - / .- -- . - / ..-. . ..- --. .. .- - / -. .. ... .-.. / .- -.-. / ...- .. ...- . .-. .-. .- / -. .. ... .. / .--. . .-.. .-.. . -. - . ... --.- ..- . / .... .- -... .. - .- -. - / -- --- .-. -... .. / - .-. .. ... - .. --.- ..- . / ... . -. . -.-. - ..- ... / . - / -. . - ..- ... / . - / -- .- .-.. . ... ..- .- -.. .- / ..-. .- -- . ... / .- -.-. / - ..- .-. .--. .. ... / . --. . ... - .- ... / . - .. .- -- / -. . -.-. / -- .- -..- .. -- ..- ... / . .-.. .. - / .. -. / . --. . ... - .- ... / - . -- .--. --- .-. / -. .. ... .. / .- / ... --- -.. .- .-.. . ... / -.. .. .- -- / -.. .. --. -. .. ... ... .. -- / ..- - ..-. ..- ... -.-. . / ..-. . .-. -- . -. - ..- -- / .-.. . -.-. - ..- ... / -. --- -. / .--. ..- .-. ..- ... / .-. .... --- -. -.-. ..- ... / --.- ..- .. ... / . --. . ... - .- ... / .--- ..- ... - --- / .- .-.. .. --.- ..- .- -- / -. .- -- / .- / - . .-.. .-.. ..- ... / ...- . .... .. -.-. ..- .-.. .- / . .-.. . .. ..-. . -. -.. / -.. --- .-.. --- .-. / -. . -.-. / ... .- --. .. - - .. ... / - ..- .-. .--. .. ... / -. .- -- / ...- .. - .- . / .-. ..- - .-. ..- -- / - . .-.. .-.. ..- ... / . --. . - / .-.. ..- -.-. - ..- ... / ...- . .-.. .. - / --.- ..- .. ... --.- ..- . / .- / --- .-. -.-. .. / ..-. . ..- --. .. .- - / .-. ..- - .-. ..- -- / -. ..- -. -.-. / ... .. - / .- -- . - / .. .- -.-. ..- .-.. .. ... / -. ..- .-.. .-.. .- / .-.. --- .-. . -- / .. .--. ... ..- -- / -.. --- .-.. --- .-. / ... .. - / .- -- . - / -.-. --- -. ... . -.-. - . - ..- .-. / .- -.. .. .--. .. ... -.-. .. -. --. / . .-.. .. - / .--. . .-.. .-.. . -. - . ... --.- ..- . / .- - / .... . -. -.. .-. . .-. .. - / -- . - ..- ... / .- .-.. .. --.- ..- .- -- / .- - / .-.. ..- -.-. - ..- ... / -. ..- .-.. .-.. .- / -. . -.-. / ..-. . .-. -- . -. - ..- -- / . .-.. .. - ..- - / ... .. - / .- -- . - / -. . --.- ..- . / ..- - / -- .. / ... .- --. .. - - .. ... / - .-. .. ... - .. --.- ..- . / -. .- -- / .--. --- .-. - - .. - --- .-. / ... . -- / .- / .-.. .. --. ..- .-.. .- / .. -- .--. . .-. -.. .. . - / -.-. ..- .-. ... ..- ... / .- -.-. / .. -.. / -- .- ... ... .- / -. ..- .-.. .-.. .- -- / - .-. .. ... - .. --.- ..- . / ... .- .--. .. . -. / -.. .. .- -- / -. . -.-. / - .. -. -.-. .. -.. ..- -. - / . .-. .- - / - . -- .--. ..- ... / ..-. .- -.-. .. .-.. .. ... .. ... / ...- . ... - .. -... ..- .-.. ..- -- / .- -. - . / .. .--. ... ..- -- / .--. .-. .. -- .. ... / .. -. / ..-. .- ..- -.-. .. -... ..- ... / --- .-. -.-. .. / .-.. ..- -.-. - ..- ... / . - / ..- .-.. - .-. .. -.-. . ... / .--. --- ... ..- . .-. . / -.-. ..- -... .. .-.. .. .- / -.-. ..- .-. .- . / --.- ..- .. ... --.- ..- . / .- ..- --. ..- . / -. . --.- ..- . / -.-. --- -. ... . --.- ..- .- - / .. -. / - --- .-. - --- .-. / .. -.. / -- .- .-.. . ... ..- .- -.. .- / - . -- .--. ..- ... / . ... - / ...- . ... - .. -... ..- .-.. ..- -- / .- / .-. .... --- -. -.-. ..- ... / --.- ..- .- -- / . --. . - / ...- ..- .-.. .--. ..- - .- - . / -- .- ..- .-. .. ... / -. ..- .-.. .-.. .- -- / ... . -.. / . .-. --- ... / .-.. . --- / .--. .... .- ... . .-.. .-.. ..- ... / . -. .. -- / - --- .-. - --- .-. / . --. . ... - .- ... / -. --- -. --- .-. -.-. .. / ... --- -.. .- .-.. . ... / . .-.. . .. ..-. . -. -.. / ...- ..- .-.. .--. ..- - .- - . / . .-. --- ... / ... . -.. / ...- . ... - .. -... ..- .-.. ..- -- / .--. .-.. .- -.-. . .-. .- - / . ... - / .. -. / ...- .. ...- . .-. .-. .- / .. -. - . --. . .-. / ..- .-.. - .-. .. -.-. .. . ... / -- . - ..- ... / .-.. . --- / -. --- -. / -.-. --- -. ... . -.-. - . - ..- .-. / .- -. - . / . --. . ... - .- ... / . - / .--. .-. .- . ... . -. - / . - / .- ..- --. ..- . / -. . -.-. / - . .-.. .-.. ..- ... / ..-. .- -.-. .. .-.. .. ... .. ... / . .-.. . .. ..-. . -. -..";

  const actualMorse: string = encodeToMorse(text);

  expect(actualMorse).toBe(expectedMorse);
});
