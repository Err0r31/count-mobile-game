/**
 * @fileoverview Unit-тест для логики таймера createTimerLogic()
 */

import { createTimerLogic } from "@/app/game";

describe("createTimerLogic()", () => {
  test("начинается с заданного времени и не запущен", () => {
    const timer = createTimerLogic(10);
    expect(timer.getTime()).toBe(10);
    expect(timer.isRunning()).toBe(false);
  });

  test("запускается корректно методом start()", () => {
    const timer = createTimerLogic(5);
    timer.start();
    expect(timer.isRunning()).toBe(true);
  });

  test("уменьшает время при каждом tick()", () => {
    const timer = createTimerLogic(3);
    timer.start();
    timer.tick();
    expect(timer.getTime()).toBe(2);
    timer.tick();
    expect(timer.getTime()).toBe(1);
  });

  test("останавливается, когда время достигает нуля", () => {
    const timer = createTimerLogic(2);
    timer.start();
    timer.tick(); // 1
    timer.tick(); // 0
    expect(timer.getTime()).toBe(0);
    expect(timer.isRunning()).toBe(false);
  });

  test("reset() возвращает таймер в исходное состояние", () => {
    const timer = createTimerLogic(4);
    timer.start();
    timer.tick();
    timer.reset();
    expect(timer.getTime()).toBe(4);
    expect(timer.isRunning()).toBe(false);
  });
});
