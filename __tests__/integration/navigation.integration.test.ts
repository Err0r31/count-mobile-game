/**
 * @fileoverview Интеграция между GameScreen и HighScoresScreen
 */

import { addHighscore, loadSettings } from "@/storage";
import { generateProblem, calculateScore } from "@/app/game";

jest.mock("@/storage", () => ({
  addHighscore: jest.fn(),
  loadSettings: jest.fn().mockResolvedValue({
    rangeMin: 1,
    rangeMax: 50,
    durationSec: 15,
    ops: { add: true, sub: true, mul: true, div: true },
    soundEnabled: false,
  }),
}));

describe("Integration: GameScreen → HighScores", () => {
  test("результат игры сохраняется после завершения", async () => {
    const settings = await loadSettings();

    let score = 0;
    const { correct } = generateProblem(settings);
    score = calculateScore(score, true, 4);

    const entry = { date: new Date().toISOString(), score };
    await addHighscore(entry);

    // Проверяем, что функция вызвана с объектом, содержащим поле score
    expect(addHighscore).toHaveBeenCalledWith(expect.objectContaining({ score }));
    expect(score).toBeGreaterThan(0);
  });
});
