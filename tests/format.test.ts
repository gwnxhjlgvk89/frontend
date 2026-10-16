import { expect, it } from "vitest";
import { matchOptions, normalizeLabel } from "../src/v2/format";

const options = [
  { name: "大数据与会计（单）", count: 311 },
  { name: "大数据与会计", count: 263 },
  { name: "电子商务", count: 162 },
  { name: "电子商务（2）", count: 220 },
  { name: "大数据与会计（2）", count: 63 },
];

it("normalizes labels like the backend", () => {
  expect(normalizeLabel(" 造价 2511 ")).toBe("造价2511");
  expect(normalizeLabel("大数据与会计(单)")).toBe("大数据与会计（单）");
  expect(normalizeLabel("电子　商务\t")).toBe("电子商务");
  expect(normalizeLabel(undefined)).toBe("");
});

it("suggests existing values containing the typed text", () => {
  expect(matchOptions(options, "大数据").map((o) => o.name)).toEqual([
    "大数据与会计（单）",
    "大数据与会计",
    "大数据与会计（2）",
  ]);
  expect(matchOptions(options, "商务(2)").map((o) => o.name)).toEqual(["电子商务（2）"]);
  expect(matchOptions(options, "电", 1)).toHaveLength(1);
});

it("stays quiet when empty or already an exact value", () => {
  expect(matchOptions(options, "")).toEqual([]);
  expect(matchOptions(options, " 电子商务 ")).toEqual([]);
  expect(matchOptions(options, "工程造价")).toEqual([]);
});
