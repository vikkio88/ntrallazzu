import { describe, expect, test } from "bun:test";
import { Readable, Writable } from "stream";
import { getProjectUrl, promptForProjectChoice } from "./helpers.js";
import {
  getShellRcFileName,
  buildShellWrapperSnippet,
  isShellWrapperInstalled,
  SHELL_WRAPPER_MARKER_START,
  SHELL_WRAPPER_MARKER_END,
} from "./helpers.js";

describe("helper getProjectUrl helper", () => {
  test("can get url from correct git folder", () => {
    expect(getProjectUrl(".")).toBe("https://github.com/vikkio88/ntrallazzu");
  });

  test("returns null if there is no git folder or folder does not exists", () => {
    expect(getProjectUrl("~/non/existing")).toBe(null);
  });
});

describe("shell install helpers", () => {
  const home = "/home/test-user";

  test("getShellRcFileName returns .zshrc for zsh", () => {
    expect(getShellRcFileName("/bin/zsh", home)).toBe(
      "/home/test-user/.zshrc",
    );
    expect(getShellRcFileName("/usr/local/bin/zsh", home)).toBe(
      "/home/test-user/.zshrc",
    );
  });

  test("getShellRcFileName returns .bashrc for bash", () => {
    expect(getShellRcFileName("/bin/bash", home)).toBe(
      "/home/test-user/.bashrc",
    );
  });

  test("getShellRcFileName returns null for unsupported or missing shells", () => {
    expect(getShellRcFileName("/bin/fish", home)).toBe(null);
    expect(getShellRcFileName(undefined, home)).toBe(null);
  });

  test("buildShellWrapperSnippet includes the markers and a ntrz function", () => {
    const snippet = buildShellWrapperSnippet();
    expect(snippet).toContain(SHELL_WRAPPER_MARKER_START);
    expect(snippet).toContain(SHELL_WRAPPER_MARKER_END);
    expect(snippet).toContain("ntrz()");
    expect(snippet).toContain("--raw");
  });

  test("isShellWrapperInstalled detects the marker in existing content", () => {
    expect(isShellWrapperInstalled("some random rc content")).toBe(false);
    expect(
      isShellWrapperInstalled(`stuff\n${SHELL_WRAPPER_MARKER_START}\nntrz(){}\n${SHELL_WRAPPER_MARKER_END}\n`),
    ).toBe(true);
  });
});

describe("promptForProjectChoice", () => {
  const matches: Project[] = [
    {
      name: "webstore-api",
      codeFolder: "/code",
      lastModified: new Date(),
      index: 0,
    },
    {
      name: "webstore-ui",
      codeFolder: "/code",
      lastModified: new Date(),
      index: 1,
    },
  ];

  function mockInput(answer: string): NodeJS.ReadableStream {
    return Readable.from([`${answer}\n`]);
  }

  const sink = new Writable({
    write(_chunk, _enc, callback) {
      callback();
    },
  });

  test("returns the chosen project for valid input", async () => {
    const result = await promptForProjectChoice(
      matches,
      "webstore",
      mockInput("2"),
      sink,
    );
    expect(result?.name).toBe("webstore-ui");
  });

  test("returns null for invalid input", async () => {
    const result = await promptForProjectChoice(
      matches,
      "webstore",
      mockInput("99"),
      sink,
    );
    expect(result).toBe(null);
  });

  test("returns null for non-numeric input", async () => {
    const result = await promptForProjectChoice(
      matches,
      "webstore",
      mockInput("nope"),
      sink,
    );
    expect(result).toBe(null);
  });
});
