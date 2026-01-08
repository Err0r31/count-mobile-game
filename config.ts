/**
 * Конфигурация приложения
 * Все переменные окружения и настройки приложения
 */

import Constants from "expo-constants";
import { Platform } from "react-native";

// Получаем IP адрес из переменных окружения
// В Expo переменные с префиксом EXPO_PUBLIC_ доступны через process.env
// Если не задан в .env, используем значение по умолчанию
const DEV_SERVER_IP = 
  process.env.EXPO_PUBLIC_DEV_SERVER_IP || 
  "192.168.1.71"; // Fallback значение (будет использоваться только если .env не настроен)

// URL продакшен сервера из переменных окружения
const PRODUCTION_API_URL = 
  process.env.EXPO_PUBLIC_API_URL || 
  "https://your-production-server.com/api";

// Настройки API
export const API_CONFIG = {
  // Базовый URL API
  getBaseUrl: (): string => {
    if (__DEV__) {
      // Пытаемся определить, запущено ли на реальном устройстве
      // Expo Go на реальном устройстве обычно имеет hostUri с IP адресом
      const hostUri =
        Constants.expoConfig?.hostUri || Constants.expoConfig?.extra?.hostUri;

      if (
        hostUri &&
        !hostUri.includes("localhost") &&
        !hostUri.includes("127.0.0.1")
      ) {
        // Извлекаем IP из hostUri (формат: "192.168.1.100:8081" или "exp://192.168.1.100:8081")
        const match = hostUri.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (match) {
          // Используем IP из hostUri для API
          return `http://${match[1]}:8000/api`;
        }
      }

      // Если hostUri не содержит IP, но мы на реальном устройстве, используем ручной IP
      // Проверяем, что это не эмулятор/симулятор
      const isEmulator =
        Platform.OS === "android" && Constants.isDevice === false;
      const isSimulator = Platform.OS === "ios" && Constants.isDevice === false;

      if (!isEmulator && !isSimulator && Constants.isDevice) {
        // Реальное устройство - используем ручной IP
        return `http://${DEV_SERVER_IP}:8000/api`;
      }

      // Для Android эмулятора
      if (Platform.OS === "android") {
        return "http://10.0.2.2:8000/api";
      }

      // Для iOS симулятора и веба
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

// Логирование для отладки
if (__DEV__) {
  console.log("🔗 API Base URL:", API_CONFIG.getBaseUrl());
  console.log("📱 Platform:", Platform.OS);
  console.log("🖥️  Is Device:", Constants.isDevice);
  console.log("🌐 DEV_SERVER_IP from .env:", DEV_SERVER_IP);
  if (Constants.expoConfig?.hostUri) {
    console.log("🌐 Host URI:", Constants.expoConfig.hostUri);
  }
}
