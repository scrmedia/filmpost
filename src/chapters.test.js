import { toSecs, chaptersText } from "./chapters";

test("toSecs parses MM:SS and H:MM:SS", () => {
  expect(toSecs("01:30")).toBe(90);
  expect(toSecs("1:02:03")).toBe(3723);
  expect(toSecs("abc")).toBeNaN();
});

test("chaptersText forces 0:00 start, drops chapters under 10 s, sorts", () => {
  expect(chaptersText([
    { time: "03:14", title: "Ceremony" },
    { time: "00:02", title: "Intro" },
    { time: "01:55", title: "Speeches" },
    { time: "02:00", title: "Too close" },
    { time: "06:47", title: "Dancing" },
  ])).toBe("0:00 Intro\n1:55 Speeches\n3:14 Ceremony\n6:47 Dancing");
});

test("chaptersText returns nothing when fewer than 3 valid chapters", () => {
  expect(chaptersText([{ time: "00:00", title: "A" }, { time: "00:05", title: "B" }])).toBe("");
  expect(chaptersText([])).toBe("");
});
