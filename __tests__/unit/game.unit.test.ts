/**
 * @fileoverview Unit-тест для вспомогательных функций из game.tsx
 */
import { randInt } from "@/app/game";

// Мокаем useCallback и React
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useCallback: (fn: any) => fn,
}));

// Тесты для randInt()
describe("randInt()", () => {
  test("возвращает число в пределах диапазона", () => {
    for (let i = 0; i < 50; i++) {
      const n = randInt(1, 10);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  test("работает при перепутанных границах (min > max)", () => {
    for (let i = 0; i < 20; i++) {
      const n = randInt(10, 1);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  test("возвращает целые числа", () => {
    for (let i = 0; i < 10; i++) {
      const n = randInt(0, 100);
      expect(Number.isInteger(n)).toBe(true);
    }
  });
});
