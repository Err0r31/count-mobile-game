import AsyncStorage from "@react-native-async-storage/async-storage"; // асинхронное хранилище ключ-значение

// Ключи для изоляции записей и версионирования
const KEYS = {
  SETTINGS: "qs_settings_v1",
  HIGHSCORES: "qs_highscores_v1",
  LEVEL_PROGRESS: "qs_level_progress_v1",
} as const;

// Модель настроек игры
export type Settings = {
  durationSec: number; // длительность раунда
  rangeMin: number; // минимальное число
  rangeMax: number; // максимальное число
  ops: { add: boolean; sub: boolean; mul: boolean; div: boolean }; // включенные операции
  soundEnabled: boolean; // включение/выключение звука
};

// Значения по умолчанию для настроек
export const defaultSettings: Settings = {
  durationSec: 60,
  rangeMin: 1,
  rangeMax: 50,
  ops: { add: true, sub: true, mul: true, div: true },
  soundEnabled: true,
};

// Загрузка настроек из хранилища, или значения по умолчанию
export async function loadSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
  return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
}

// Сохранение настроек в хранилище
export async function saveSettings(s: Settings) {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
}

// Модель записи в таблице рекордов
export type Highscore = { date: string; score: number };

// Добавление новой записи в таблицу рекордов (сортировка и обрезка до топ-20)
export async function addHighscore(entry: Highscore) {
  const raw = await AsyncStorage.getItem(KEYS.HIGHSCORES);
  const list: Highscore[] = raw ? JSON.parse(raw) : [];
  list.push(entry);
  list.sort((a, b) => b.score - a.score);
  await AsyncStorage.setItem(
    KEYS.HIGHSCORES,
    JSON.stringify(list.slice(0, 20))
  ); // храним топ-20
}

// Загрузка таблицы рекордов из хранилища
export async function loadHighscores(): Promise<Highscore[]> {
  const raw = await AsyncStorage.getItem(KEYS.HIGHSCORES);
  return raw ? JSON.parse(raw) : [];
}

// Модель прогресса уровня
export type LevelProgressEntry = {
  bestCorrect: number; // лучший результат (0..10)
  total: number;       // всего вопросов (у нас 10)
  lastPlayedAt: string;
};

export type LevelsProgress = Record<string, LevelProgressEntry>; // key = levelId как строка

export async function loadLevelsProgress(): Promise<LevelsProgress> {
  const raw = await AsyncStorage.getItem(KEYS.LEVEL_PROGRESS);
  return raw ? JSON.parse(raw) : {};
}

export async function saveLevelProgress(levelId: number, correct: number, total: number) {
  const raw = await AsyncStorage.getItem(KEYS.LEVEL_PROGRESS);
  const progress: LevelsProgress = raw ? JSON.parse(raw) : {};

  const key = String(levelId);
  const prev = progress[key];

  const bestCorrect = Math.max(prev?.bestCorrect ?? 0, correct);

  progress[key] = {
    bestCorrect,
    total,
    lastPlayedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(KEYS.LEVEL_PROGRESS, JSON.stringify(progress));
}

export async function resetLevelsProgress() {
  await AsyncStorage.removeItem(KEYS.LEVEL_PROGRESS);
}