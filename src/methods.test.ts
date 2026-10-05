import { describe, expect, test, afterEach } from "bun:test";
import fs from "fs";
import os from "os";
import path from "path";
import { install } from "./methods.js";
import { SHELL_WRAPPER_MARKER_START } from "./helpers.js";

describe("install", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ntrz-install-"));
  const rcFile = path.join(tmpDir, ".zshrc");

  afterEach(() => {
    if (fs.existsSync(rcFile)) fs.rmSync(rcFile);
  });

  test("errors on unsupported shell", () => {
    const originalExit = process.exit;
    let exitCode: number | undefined;
    // @ts-ignore
    process.exit = (code?: number) => {
      exitCode = code;
      throw new Error("exit");
    };

    try {
      install(undefined, [], { shell: "/bin/fish" });
    } catch (_) {
      // expected, process.exit is mocked to throw
    }

    process.exit = originalExit;
    expect(exitCode).toBe(1);
  });

  test("appends the wrapper snippet to the rc file when not present", () => {
    install(undefined, [], { rcFile });

    const content = fs.readFileSync(rcFile).toString();
    expect(content).toContain(SHELL_WRAPPER_MARKER_START);
    expect(content).toContain("ntrz()");
  });

  test("creates the rc file if it does not exist yet", () => {
    expect(fs.existsSync(rcFile)).toBe(false);
    install(undefined, [], { rcFile });
    expect(fs.existsSync(rcFile)).toBe(true);
  });

  test("is idempotent, it does not duplicate the snippet on a second run", () => {
    install(undefined, [], { rcFile });
    install(undefined, [], { rcFile });

    const content = fs.readFileSync(rcFile).toString();
    const occurrences = content.split(SHELL_WRAPPER_MARKER_START).length - 1;
    expect(occurrences).toBe(1);
  });

  test("preserves existing rc file content", () => {
    fs.writeFileSync(rcFile, "export FOO=bar\n");
    install(undefined, [], { rcFile });

    const content = fs.readFileSync(rcFile).toString();
    expect(content).toContain("export FOO=bar");
    expect(content).toContain(SHELL_WRAPPER_MARKER_START);
  });
});
