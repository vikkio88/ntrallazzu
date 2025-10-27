import { describe, expect, test } from "bun:test";
import { getProjectUrl } from "./helpers.js";

describe("helper getProjectUrl helper", () => {
  test("can get url from correct git folder", () => {
    expect(getProjectUrl(".")).toBe("https://github.com/vikkio88/ntrallazzu");
  });

  test("returns null if there is no git folder or folder does not exists", () => {
    expect(getProjectUrl("~/non/existing")).toBe(null);
  });
});
