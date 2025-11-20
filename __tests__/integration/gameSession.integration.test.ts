/**
 * @fileoverview Интеграционный тест: полная игровая сессия
 * Проверяет взаимодействие таймера, счёта и генерации примеров
 */

import {
  createTimerLogic,
  calculateScore,
  generateProblem,
} from "@/app/game";

describe("Integration: full game session", () => {
  test("игрок проходит 3 примера, таймер работает, счёт корректный", () => {
    // Инициализация логики
    const timer = createTimerLogic(15);
    let score = 0;

    // Запуск таймера
    timer.start();
    expect(timer.isRunning()).toBe(true);

    // Симуляция 3 примеров
    for (let i = 0; i < 3; i++) {
      const { problem, correct } = generateProblem({
        rangeMin: 1,
        rangeMax: 10,
        ops: { add: true, sub: true, mul: true, div: true },
        durationSec: 15,
        soundEnabled: false,
      });

      // игрок всегда отвечает верно
      const playerAnswer = correct;
      const timeTaken = i === 0 ? 3 : 6; // первый — быстрый
      score = calculateScore(score, playerAnswer === correct, timeTaken);
      timer.tick();
    }

    // Проверяем итог
    expect(timer.isRunning()).toBe(true);
    expect(timer.getTime()).toBeGreaterThan(0);
    expect(score).toBeGreaterThan(0);
  });
});
