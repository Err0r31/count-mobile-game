import StyledButton from "@/components/StyledButton"; // единый стиль кнопок проекта
import StyledText from "@/components/StyledText"; // единый стиль текста проекта
import { authAPI, getToken } from "@/api"; // API для проверки авторизации
import { theme } from "@/ui"; // тема
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // иконки из библиотеки FontAwesome
import { useRouter, useFocusEffect } from "expo-router"; // хук для переходов между экранами
import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { BounceIn, FadeInDown, FadeInUp } from "react-native-reanimated";

export default function MainScreen() {
  const router = useRouter(); // переходы между экранами
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Обновляем статус авторизации при возврате на экран
  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [])
  );

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        // Проверяем, что токен валидный
        await authAPI.getCurrentUser();
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Заголовочная секция */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.headerSection}>
        <Animated.View entering={BounceIn.duration(800).delay(200)} style={styles.iconContainer}>
          <FontAwesome5
            name="calculator"
            size={60}
            color={theme.colors.textOnPrimary}
            style={styles.headerIcon}
          />
        </Animated.View>
        
        <StyledText variant="title" style={styles.title}>
          Быстрый счет
        </StyledText>
        <StyledText variant="regular" style={styles.subtitle}>
          Развивайте математические навыки
        </StyledText>
      </Animated.View>

      {/* Основная секция с кнопками */}
      <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.mainSection}>
        <View style={styles.buttonContainer}>
          <StyledButton
            variant="primary"
            label="Играть"
            iconName="play-circle"
            onPress={() => router.push("/modeSelect")}
            style={styles.navigationButton}
          />
          
          <StyledButton
            variant="primary"
            label="Правила"
            iconName="book"
            onPress={() => router.push("/rules")}
            style={styles.navigationButton}
          />
          
          <StyledButton
            variant="primary"
            label="Настройки"
            iconName="cog"
            onPress={() => router.push("/settings")}
            style={styles.navigationButton}
          />
          
          {isAuthenticated ? (
            <StyledButton
              variant="secondary"
              label="Профиль"
              iconName="user-circle"
              onPress={() => router.push("/profile")}
              style={styles.navigationButton}
            />
          ) : (
            <StyledButton
              variant="secondary"
              label="Вход / Регистрация"
              iconName="user"
              onPress={() => router.push("/auth")}
              style={styles.navigationButton}
            />
          )}
          
          {/* <StyledButton
            variant="primary"
            label="Мультимедиа"
            iconName="image"
            onPress={() => router.push("/media")}
            style={styles.navigationButton}
          /> */}
        </View>
      </Animated.View>
    </View>
  );
}

// Стили для данного экрана
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
    paddingTop: theme.spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    ...theme.shadows.large,
  },
  headerIcon: {
    // Иконка теперь внутри контейнера
  },
  title: {
    marginBottom: theme.spacing.sm,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold" as const,
  },
  subtitle: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    fontSize: 16,
  },
  mainSection: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  navigationButton: {
    width: "100%",
    minHeight: 55,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
});
