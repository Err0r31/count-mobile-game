/**
 * Пример файла конфигурации
 * 
 * ВАЖНО: Теперь конфиденциальные данные хранятся в .env файле!
 * 
 * Создайте файл .env в корне проекта и добавьте:
 * EXPO_PUBLIC_DEV_SERVER_IP=ваш_ip_адрес
 * EXPO_PUBLIC_API_URL=https://your-production-server.com/api
 * 
 * См. .env.example для примера
 */

import Constants from "expo-constants";
import { Platform } from "react-native";

// Получаем IP адрес из переменных окружения
const DEV_SERVER_IP = 
  Constants.expoConfig?.extra?.devServerIp || 
  process.env.EXPO_PUBLIC_DEV_SERVER_IP || 
  "YOUR_LOCAL_IP_HERE"; // Fallback значение

// URL продакшен сервера из переменных окружения
const PRODUCTION_API_URL = 
  Constants.expoConfig?.extra?.apiUrl || 
  process.env.EXPO_PUBLIC_API_URL || 
  "https://your-production-server.com/api"; // ⚠️ ЗАМЕНИТЕ НА IP ВАШЕГО КОМПЬЮТЕРА

// Настройки API
export const API_CONFIG = {
  // Базовый URL API
  getBaseUrl: (): string => {
    if (__DEV__) {
      // Пытаемся определить, запущено ли на реальном устройстве
      const hostUri =
        Constants.expoConfig?.hostUri || Constants.expoConfig?.extra?.hostUri;

      if (
        hostUri &&
        !hostUri.includes("localhost") &&
        !hostUri.includes("127.0.0.1")
      ) {
        const match = hostUri.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (match) {
          return `http://${match[1]}:8000/api`;
        }
      }

      const isEmulator =
        Platform.OS === "android" && Constants.isDevice === false;
      const isSimulator = Platform.OS === "ios" && Constants.isDevice === false;

      if (!isEmulator && !isSimulator && Constants.isDevice) {
        return `http://${DEV_SERVER_IP}:8000/api`;
      }

      if (Platform.OS === "android") {
        return "http://10.0.2.2:8000/api";
      }

      return "http://localhost:8000/api";
    }
    // Для продакшена используем URL из переменных окружения
    return PRODUCTION_API_URL;
  },

  // Таймаут запросов (в миллисекундах)
  TIMEOUT: 30000,

  // Ключи для хранения в AsyncStorage
  STORAGE_KEYS: {
    AUTH_TOKEN: "auth_token",
    PENDING_HIGHSCORES: "pending_highscores",
  },
} as const;

// Настройки приложения
export const APP_CONFIG = {
  NAME: "Быстрый счет",
  VERSION: "1.0.0",
  DESCRIPTION: "Развивайте математические навыки",
} as const;

// Настройки игры
export const GAME_CONFIG = {
  DEFAULT_DURATION_SEC: 60,
  DEFAULT_RANGE_MIN: 1,
  DEFAULT_RANGE_MAX: 50,
  MAX_HIGHSCORES: 20,
} as const;
