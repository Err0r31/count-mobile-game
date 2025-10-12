import AsyncStorage from '@react-native-async-storage/async-storage';   // асинхронное хранилище ключ-значение

// Ключи для изоляции записей и версионирования
const KEYS = {
  SETTINGS: 'qs_settings_v1',
  HIGHSCORES: 'qs_highscores_v1',
} as const;

// Модель настроек игры
export type Settings = {
  durationSec: number;       // длительность раунда
  rangeMin: number;          // минимальное число
  rangeMax: number;          // максимальное число
  ops: { add: boolean; sub: boolean; mul: boolean; div: boolean };  // включенные операции
};

// Значения по умолчанию для настроек
export const defaultSettings: Settings = {
  durationSec: 60,
  rangeMin: 1,
  rangeMax: 50,
  ops: { add: true, sub: true, mul: true, div: true },
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
  await AsyncStorage.setItem(KEYS.HIGHSCORES, JSON.stringify(list.slice(0, 20))); // храним топ-20
}

// Загрузка таблицы рекордов из хранилища
export async function loadHighscores(): Promise<Highscore[]> {
  const raw = await AsyncStorage.getItem(KEYS.HIGHSCORES);
  return raw ? JSON.parse(raw) : [];
}
