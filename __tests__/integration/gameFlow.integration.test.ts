/**
 * @fileoverview Интеграционный тест всей игровой логики:
 * таймер, генерация задач, подсчёт очков, завершение игры
 */

import {
  createTimerLogic,
  calculateScore,
  generateProblem,
} from "@/app/game";

describe("game flow logic", () => {
  test("эмуляция полной игровой сессии", () => {
    // начальные условия
    let score = 0;
    const timer = createTimerLogic(10);
    timer.start();

    // Проверяем начальное состояние
    expect(timer.getTime()).toBe(10);
    expect(timer.isRunning()).toBe(true);
    expect(score).toBe(0);

    // игрок отвечает на 3 правильных примера
    for (let i = 0; i < 3; i++) {
      const { problem, correct } = generateProblem({
        rangeMin: 1,
        rangeMax: 10,
        durationSec: 60,
        soundEnabled: false,
        ops: { add: true, sub: true, mul: true, div: true },
    });

      // эмуляция времени ответа
      const timeTaken = i === 0 ? 3 : 6; // первый быстрый
      const isCorrect = true;

      score = calculateScore(score, isCorrect, timeTaken);

      // уменьшаем время таймера
      timer.tick();

      expect(problem).toMatch(/\d+ [+\-*/] \d+/);
      expect(score).toBeGreaterThan(0);
      expect(timer.getTime()).toBe(10 - (i + 1));
    }

    // игрок ошибается
    const prevScore = score;
    score = calculateScore(score, false, 7);
    expect(score).toBeLessThan(prevScore);

    // время истекает
    for (let i = 0; i < 20; i++) timer.tick();
    expect(timer.getTime()).toBe(0);
    expect(timer.isRunning()).toBe(false);

    // финальная проверка
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test("игра сбрасывается после reset()", () => {
    const timer = createTimerLogic(5);
    timer.start();
    timer.tick();
    timer.tick();
    timer.reset();

    expect(timer.getTime()).toBe(5);
    expect(timer.isRunning()).toBe(false);

    let score = 100;
    score = calculateScore(score, null, 0);
    expect(score).toBe(100); // при сбросе очки не меняются
  });
});
