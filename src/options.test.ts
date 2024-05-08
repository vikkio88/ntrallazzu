import { expect, test } from "vitest";
import { parseOptions } from "./options.js";

test("Option parser returns correct args", () => {
    expect(parseOptions(['--nothing'])).toEqual({ NO_COPY: false, UPDATE: false });
    expect(parseOptions(['--n'], { NO: { opts: ['--n'] } })).toEqual({ NO: true });
    expect(parseOptions(['--x'], { NO: { opts: ['--n'] } })).toEqual({ NO: false });
    expect(parseOptions(['--x', '--banana'], { NO: { opts: ['--n', '--banana'] } })).toEqual({ NO: true });
    expect(parseOptions([], { NO: { opts: ['--n', '--banana'] } })).toEqual({ NO: false });
});