/**
 * @fileoverview Unit-тест для функции generateProblem() из game.tsx
 */

import { randInt } from "@/app/game";
import React from "react";

// Чтобы иметь доступ к generateProblem, мокнем React.useCallback
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useCallback: (fn: any) => fn,
}));

// Мокаем зависимости, которые вызываются внутри game.tsx
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));
jest.mock("@/storage", () => ({
  loadSettings: jest.fn(),
  addHighscore: jest.fn(),
}));
jest.mock("expo-av", () => ({
  Audio: { Sound: { createAsync: jest.fn() } },
}));
jest.mock("expo-haptics", () => ({}));
jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  Vibration: { vibrate: jest.fn() },
}));

// Мокаем React Native, чтобы не вызывался StyleSheet.create
jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  StyleSheet: { create: (s: any) => s },
  View: "View",
  Text: "Text",
  TouchableOpacity: "TouchableOpacity",
  ScrollView: "ScrollView",
  KeyboardAvoidingView: "KeyboardAvoidingView",
  Vibration: { vibrate: jest.fn() },
}));


// Импортируем саму функцию из game.tsx
import { generateProblem } from "@/app/game";

// Настройки по умолчанию
const defaultSettings = {
  rangeMin: 1,
  rangeMax: 20,
  durationSec: 60,
  ops: { add: true, sub: true, mul: true, div: true },
  soundEnabled: false,
};

describe("generateProblem()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("генерирует корректную задачу для сложения", () => {
    const s = { ...defaultSettings, ops: { add: true, sub: false, mul: false, div: false } };
    const result = generateProblem(s);
    expect(result.problem).toMatch(/^\d+ \+ \d+$/);
    expect(result.correct).toBe(eval(result.problem));
  });

  test("генерирует корректную задачу для вычитания (результат неотрицательный)", () => {
    const s = { ...defaultSettings, ops: { add: false, sub: true, mul: false, div: false } };
    const result = generateProblem(s);
    expect(result.problem).toMatch(/^\d+ - \d+$/);
    const [a, , b] = result.problem.split(" ").map(Number);
    expect(a - b).toBeGreaterThanOrEqual(0);
  });

  test("генерирует корректную задачу для умножения", () => {
    const s = { ...defaultSettings, ops: { add: false, sub: false, mul: true, div: false } };
    const result = generateProblem(s);
    expect(result.problem).toMatch(/^\d+ \* \d+$/);
    const [a, , b] = result.problem.split(" ").map(Number);
    expect(result.correct).toBe(a * b);
  });

  test("генерирует корректную задачу для деления (результат целый)", () => {
    const s = { ...defaultSettings, ops: { add: false, sub: false, mul: false, div: true } };
    const result = generateProblem(s);
    expect(result.problem).toMatch(/^\d+ \/ \d+$/);
    const [a, , b] = result.problem.split(" ").map(Number);
    expect(a % b).toBe(0);
    expect(result.correct).toBe(a / b);
  });

  test("значения чисел находятся в пределах диапазона rangeMin..rangeMax", () => {
    const s = { ...defaultSettings, rangeMin: 5, rangeMax: 15 };
    const result = generateProblem(s);
    const [a, , b] = result.problem.split(" ").map(Number);
    expect(a).toBeGreaterThanOrEqual(s.rangeMin);
    expect(a).toBeLessThanOrEqual(s.rangeMax);
    expect(b).toBeGreaterThanOrEqual(s.rangeMin);
    expect(b).toBeLessThanOrEqual(s.rangeMax);
  });
});
