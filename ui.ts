// Современная минималистичная тема для приложения "Быстрый счет"
export const theme = {
  colors: {
    // Основные цвета
    primary: "#2c3e50",           // Темно-синий
    primaryLight: "#34495e",      // Светлый оттенок основного
    primaryDark: "#1a252f",       // Темный оттенок основного
    
    // Фоновые цвета
    background: "#ecf0f1",        // Светло-серый фон
    backgroundLight: "#ffffff",   // Белый
    backgroundDark: "#bdc3c7",   // Темно-серый
    
    // Акцентные цвета
    accent: "#3498db",            // Синий акцент
    accentLight: "#5dade2",       // Светлый акцент
    accentDark: "#2980b9",       // Темный акцент
    
    // Семантические цвета
    success: "#27ae60",          // Зеленый успех
    warning: "#f39c12",           // Оранжевое предупреждение
    error: "#e74c3c",             // Красная ошибка
    info: "#3498db",              // Синяя информация
    
    // Текст
    textPrimary: "#2c3e50",       // Основной текст
    textSecondary: "#7f8c8d",     // Вторичный текст
    textLight: "#bdc3c7",         // Светлый текст
    textOnPrimary: "#ffffff",     // Текст на основном фоне
    
    // Границы и разделители
    border: "#bdc3c7",            // Основная граница
    borderLight: "#ecf0f1",       // Светлая граница
    borderDark: "#95a5a6",        // Темная граница
  },
  
  // Размеры и отступы
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Радиусы скругления
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
  
  // Тени
  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Типографика
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold" as const,
      lineHeight: 40,
      color: "#2c3e50",
    },
    h2: {
      fontSize: 28,
      fontWeight: "bold" as const,
      lineHeight: 36,
      color: "#2c3e50",
    },
    h3: {
      fontSize: 24,
      fontWeight: "600" as const,
      lineHeight: 32,
      color: "#2c3e50",
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 24,
      color: "#2c3e50",
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: "400" as const,
      lineHeight: 28,
      color: "#2c3e50",
    },
    caption: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 20,
      color: "#7f8c8d",
    },
    button: {
      fontSize: 16,
      fontWeight: "600" as const,
      lineHeight: 24,
      color: "#ffffff",
    },
  },
};
