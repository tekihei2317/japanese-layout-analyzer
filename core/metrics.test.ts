import { describe, expect, test } from "bun:test";
import { computeStrokeMetrics } from "./metrics";

describe("computeStrokeMetrics (bigram)", () => {
  // 同指連続の比率を計算できること
  test("有効なビグラムのみでSFB比率を算出する", () => {
    const metrics = computeStrokeMetrics("aaq");
    expect(metrics.bigram.sfb).toBeCloseTo(1);
    expect(metrics.bigram.scissors).toBeCloseTo(0);
  });

  // 同指連続と非同指が混在するケース
  test("SFBとシザーズの比率を算出する", () => {
    const metrics = computeStrokeMetrics("aqw");
    expect(metrics.bigram.sfb).toBeCloseTo(0.5);
    expect(metrics.bigram.scissors).toBeCloseTo(0);
  });

  // シザーズの比率が計算できること
  test("シザーズペアの比率を算出する", () => {
    const metrics = computeStrokeMetrics("cqw");
    expect(metrics.bigram.sfb).toBeCloseTo(0);
    expect(metrics.bigram.scissors).toBeCloseTo(0.5);
  });

  // 対象外キーが含まれる場合はエラーになる
  test("対象外キーが含まれると例外を投げる", () => {
    expect(() => computeStrokeMetrics("1")).toThrow(
      "Unsupported stroke key: 1"
    );
  });
});

describe("computeStrokeMetrics (trigram)", () => {
  // 同指3連続はSFTとして数える
  test("同指3連続をSFTとして数える", () => {
    const metrics = computeStrokeMetrics("qqq");
    expect(metrics.trigram.sft).toBeCloseTo(1);
    expect(metrics.trigram.sfb).toBeCloseTo(0);
  });

  // 同指2連続はSFBとして数える
  test("同指2連続をSFBとして数える", () => {
    const metrics = computeStrokeMetrics("qqw");
    expect(metrics.trigram.sfb).toBeCloseTo(1);
    expect(metrics.trigram.sft).toBeCloseTo(0);
  });

  // 交互打鍵の判定（skipgramなし）
  test("交互打鍵を数える（skipgramなし）", () => {
    const metrics = computeStrokeMetrics("qjv");
    expect(metrics.trigram.alt).toBeCloseTo(1);
    expect(metrics.trigram.altSfs).toBeCloseTo(0);
  });

  // 交互打鍵の判定（skipgramあり）
  test("交互打鍵を数える（skipgramあり）", () => {
    const metrics = computeStrokeMetrics("qjq");
    expect(metrics.trigram.altSfs).toBeCloseTo(1);
    expect(metrics.trigram.alt).toBeCloseTo(0);
  });

  // ロールインの判定（左手内方向）
  test("ロールインを数える", () => {
    const metrics = computeStrokeMetrics("qwy");
    expect(metrics.trigram.rollIn).toBeCloseTo(1);
    expect(metrics.trigram.rollOut).toBeCloseTo(0);
  });

  // ロールアウトの判定（左手外方向）
  test("ロールアウトを数える", () => {
    const metrics = computeStrokeMetrics("wqy");
    expect(metrics.trigram.rollOut).toBeCloseTo(1);
    expect(metrics.trigram.rollIn).toBeCloseTo(0);
  });

  // 片手の内方向打鍵
  test("片手の内方向打鍵を数える", () => {
    const metrics = computeStrokeMetrics("qwe");
    expect(metrics.trigram.oneHandIn).toBeCloseTo(1);
    expect(metrics.trigram.oneHandOut).toBeCloseTo(0);
  });

  // 片手の外方向打鍵
  test("片手の外方向打鍵を数える", () => {
    const metrics = computeStrokeMetrics("ewq");
    expect(metrics.trigram.oneHandOut).toBeCloseTo(1);
    expect(metrics.trigram.oneHandIn).toBeCloseTo(0);
  });

  // 折り返し打鍵（skipgramなし）
  test("折り返し打鍵を数える（skipgramなし）", () => {
    const metrics = computeStrokeMetrics("qew");
    expect(metrics.trigram.redirect).toBeCloseTo(1);
    expect(metrics.trigram.redirectSfs).toBeCloseTo(0);
  });

  // 折り返し打鍵（skipgramあり）
  test("折り返し打鍵を数える（skipgramあり）", () => {
    const metrics = computeStrokeMetrics("qwq");
    expect(metrics.trigram.redirectSfs).toBeCloseTo(1);
    expect(metrics.trigram.redirect).toBeCloseTo(0);
  });
});
