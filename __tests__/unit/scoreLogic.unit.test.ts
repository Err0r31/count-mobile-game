/**
 * @fileoverview Unit-тест для логики начисления очков
 * Проверяем корректное изменение счёта в зависимости от результата ответа игрока
 */

import { calculateScore } from "@/app/game"; // добавим эту функцию чуть ниже

describe("calculateScore()", () => {
  const base = 10; // базовые очки за правильный ответ
  const bonusFast = 5; // бонус за скорость
  const penaltyWrong = -5; // штраф за ошибку

  test("добавляет очки за правильный ответ", () => {
    const result = calculateScore(100, true, 8);
    expect(result).toBe(110);
  });

  test("добавляет бонус за быстрый ответ (<5 секунд)", () => {
    const result = calculateScore(100, true, 3);
    expect(result).toBe(115);
  });

  test("вычитает штраф за неправильный ответ", () => {
    const result = calculateScore(100, false, 7);
    expect(result).toBe(95);
  });

  test("не изменяет счёт при пропуске вопроса", () => {
    const result = calculateScore(100, null, 0);
    expect(result).toBe(100);
  });

  test("не даёт счёту опускаться ниже 0", () => {
    const result = calculateScore(2, false, 6);
    expect(result).toBe(0);
  });
});
