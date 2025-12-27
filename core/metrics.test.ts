import { describe, expect, test } from "bun:test";
import { computeStrokeMetrics } from "./metrics";

describe("computeStrokeMetrics (bigram)", () => {
  test("有効な2-gramのみでSFB比率を算出する", () => {
    const metrics = computeStrokeMetrics("aaq");
    expect(metrics.bigram.sfb).toBeCloseTo(1);
    expect(metrics.bigram.scissors).toBeCloseTo(0);
  });

  test("SFBとシザーズの比率を算出する", () => {
    const metrics = computeStrokeMetrics("aqw");
    expect(metrics.bigram.sfb).toBeCloseTo(0.5);
    expect(metrics.bigram.scissors).toBeCloseTo(0);
  });

  test("シザーズペアの比率を算出する", () => {
    const metrics = computeStrokeMetrics("cqw");
    expect(metrics.bigram.sfb).toBeCloseTo(0);
    expect(metrics.bigram.scissors).toBeCloseTo(0.5);
  });

  test("対象外キーが含まれると例外を投げる", () => {
    expect(() => computeStrokeMetrics("!")).toThrow(
      "Unsupported stroke key: !"
    );
  });
});

describe("computeStrokeMetrics (trigram)", () => {
  test("同指3連続をSFTとして数える", () => {
    const metrics = computeStrokeMetrics("qqq");
    expect(metrics.trigram.sft).toBeCloseTo(1);
    expect(metrics.trigram.sfb).toBeCloseTo(0);
  });

  test("同指2連続をSFBとして数える", () => {
    const metrics = computeStrokeMetrics("qqw");
    expect(metrics.trigram.sfb).toBeCloseTo(1);
    expect(metrics.trigram.sft).toBeCloseTo(0);
  });

  test("交互打鍵を数える（skipgramなし）", () => {
    const metrics = computeStrokeMetrics("qjv");
    expect(metrics.trigram.alt).toBeCloseTo(1);
    expect(metrics.trigram.altSfs).toBeCloseTo(0);
  });

  test("交互打鍵を数える（skipgramあり）", () => {
    const metrics = computeStrokeMetrics("qjq");
    expect(metrics.trigram.altSfs).toBeCloseTo(1);
    expect(metrics.trigram.alt).toBeCloseTo(0);
  });

  test("ロールインを数える", () => {
    const metrics = computeStrokeMetrics("qwy");
    expect(metrics.trigram.rollIn).toBeCloseTo(1);
    expect(metrics.trigram.rollOut).toBeCloseTo(0);
  });

  test("ロールアウトを数える", () => {
    const metrics = computeStrokeMetrics("wqy");
    expect(metrics.trigram.rollOut).toBeCloseTo(1);
    expect(metrics.trigram.rollIn).toBeCloseTo(0);
  });

  test("片手の内方向打鍵を数える", () => {
    const metrics = computeStrokeMetrics("qwe");
    expect(metrics.trigram.oneHandIn).toBeCloseTo(1);
    expect(metrics.trigram.oneHandOut).toBeCloseTo(0);
  });

  test("片手の外方向打鍵を数える", () => {
    const metrics = computeStrokeMetrics("ewq");
    expect(metrics.trigram.oneHandOut).toBeCloseTo(1);
    expect(metrics.trigram.oneHandIn).toBeCloseTo(0);
  });

  test("折り返し打鍵を数える（skipgramなし）", () => {
    const metrics = computeStrokeMetrics("qew");
    expect(metrics.trigram.redirect).toBeCloseTo(1);
    expect(metrics.trigram.redirectSfs).toBeCloseTo(0);
  });

  test("折り返し打鍵を数える（skipgramあり）", () => {
    const metrics = computeStrokeMetrics("qwq");
    expect(metrics.trigram.redirectSfs).toBeCloseTo(1);
    expect(metrics.trigram.redirect).toBeCloseTo(0);
  });
});
