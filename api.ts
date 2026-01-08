// API клиент для связи с бэкендом
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "./config";

const API_BASE_URL = API_CONFIG.getBaseUrl();
const TOKEN_KEY = API_CONFIG.STORAGE_KEYS.AUTH_TOKEN;
const PENDING_HIGHSCORES_KEY = API_CONFIG.STORAGE_KEYS.PENDING_HIGHSCORES;

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Highscore {
  id?: number;
  user_id?: number;
  score: number;
  date: string;
  username?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// Хранение токена
export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

const setToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

// Базовая функция для запросов
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

// API для аутентификации
export const authAPI = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await apiRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    const headers: HeadersInit = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers,
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    const result: AuthResponse = await response.json();
    await setToken(result.access_token);
    return result;
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>("/auth/me");
  },

  logout: async (): Promise<void> => {
    await clearToken();
  },
};

// API для результатов
export const highscoresAPI = {
  create: async (highscore: Highscore): Promise<Highscore> => {
    return apiRequest<Highscore>("/highscores", {
      method: "POST",
      body: JSON.stringify({
        score: highscore.score,
        date: highscore.date,
      }),
    });
  },

  getMyHighscores: async (skip: number = 0, limit: number = 20): Promise<Highscore[]> => {
    return apiRequest<Highscore[]>(`/highscores?skip=${skip}&limit=${limit}`);
  },

  getLeaderboard: async (skip: number = 0, limit: number = 20): Promise<Highscore[]> => {
    return apiRequest<Highscore[]>(`/highscores/leaderboard?skip=${skip}&limit=${limit}`);
  },

  getById: async (id: number): Promise<Highscore> => {
    return apiRequest<Highscore>(`/highscores/${id}`);
  },

  update: async (id: number, highscore: Highscore): Promise<Highscore> => {
    return apiRequest<Highscore>(`/highscores/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        score: highscore.score,
        date: highscore.date,
      }),
    });
  },

  delete: async (id: number): Promise<void> => {
    return apiRequest<void>(`/highscores/${id}`, {
      method: "DELETE",
    });
  },
};

// Функции для оффлайн режима
export const offlineAPI = {
  // Сохранение результата в очередь для отправки
  addPendingHighscore: async (highscore: Highscore): Promise<void> => {
    const raw = await AsyncStorage.getItem(PENDING_HIGHSCORES_KEY);
    const pending: Highscore[] = raw ? JSON.parse(raw) : [];
    pending.push(highscore);
    await AsyncStorage.setItem(PENDING_HIGHSCORES_KEY, JSON.stringify(pending));
  },

  // Получение очереди неотправленных результатов
  getPendingHighscores: async (): Promise<Highscore[]> => {
    const raw = await AsyncStorage.getItem(PENDING_HIGHSCORES_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  // Очистка очереди после успешной отправки
  clearPendingHighscores: async (): Promise<void> => {
    await AsyncStorage.removeItem(PENDING_HIGHSCORES_KEY);
  },

  // Отправка всех неотправленных результатов
  syncPendingHighscores: async (): Promise<{ success: number; failed: number }> => {
    const pending = await offlineAPI.getPendingHighscores();
    if (pending.length === 0) {
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;
    const remaining: Highscore[] = [];

    for (const highscore of pending) {
      try {
        await highscoresAPI.create(highscore);
        success++;
      } catch (error) {
        console.error("Failed to sync highscore:", error);
        remaining.push(highscore);
        failed++;
      }
    }

    if (remaining.length > 0) {
      await AsyncStorage.setItem(PENDING_HIGHSCORES_KEY, JSON.stringify(remaining));
    } else {
      await offlineAPI.clearPendingHighscores();
    }

    return { success, failed };
  },
};
