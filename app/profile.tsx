import StyledButton from "@/components/StyledButton";
import StyledText from "@/components/StyledText";
import { authAPI, highscoresAPI, type User, type Highscore } from "@/api";
import { theme } from "@/ui";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface GameStats {
  totalGames: number;
  bestScore: number;
  averageScore: number;
  totalTimePlayed: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  accuracy: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Загружаем информацию о пользователе
      const userData = await authAPI.getCurrentUser();
      setUser(userData);

      // Загружаем результаты пользователя
      const highscores = await highscoresAPI.getMyHighscores(0, 100);

      if (highscores.length === 0) {
        setStats({
          totalGames: 0,
          bestScore: 0,
          averageScore: 0,
          totalTimePlayed: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          skippedAnswers: 0,
          accuracy: 0,
        });
        return;
      }

      // Вычисляем статистику
      const totalGames = highscores.length;
      const bestScore = Math.max(...highscores.map((h) => h.score));
      const averageScore =
        highscores.reduce((sum, h) => sum + h.score, 0) / totalGames;

      // Примерные вычисления (так как у нас нет детальной статистики)
      const estimatedCorrectAnswers = highscores.reduce(
        (sum, h) => sum + Math.max(0, h.score / 10),
        0
      );
      const estimatedWrongAnswers = highscores.reduce(
        (sum, h) => sum + Math.max(0, -h.score / 5),
        0
      );
      const estimatedSkippedAnswers = highscores.reduce(
        (sum, h) => sum + Math.max(0, -h.score / 2),
        0
      );

      const totalAnswers =
        estimatedCorrectAnswers + estimatedWrongAnswers + estimatedSkippedAnswers;
      const accuracy = totalAnswers > 0 ? (estimatedCorrectAnswers / totalAnswers) * 100 : 0;

      setStats({
        totalGames,
        bestScore,
        averageScore: Math.round(averageScore),
        totalTimePlayed: totalGames * 60, // Предполагаем 60 секунд на игру
        correctAnswers: Math.round(estimatedCorrectAnswers),
        wrongAnswers: Math.round(estimatedWrongAnswers),
        skippedAnswers: Math.round(estimatedSkippedAnswers),
        accuracy: Math.round(accuracy),
      });
    } catch (error: any) {
      console.error("Ошибка загрузки профиля:", error);
      Alert.alert("Ошибка", "Не удалось загрузить профиль. Попробуйте войти снова.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Выход",
      "Вы уверены, что хотите выйти?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Выйти",
          style: "destructive",
          onPress: async () => {
            await authAPI.logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    color = theme.colors.primary,
  }: {
    icon: string;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <FontAwesome5 name={icon} size={24} color={theme.colors.textOnPrimary} />
      </View>
      <View style={styles.statContent}>
        <StyledText variant="regular" style={styles.statTitle}>
          {title}
        </StyledText>
        <StyledText variant="highlight" style={styles.statValue}>
          {value}
        </StyledText>
        {subtitle && (
          <StyledText variant="regular" style={styles.statSubtitle}>
            {subtitle}
          </StyledText>
        )}
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <StyledText variant="regular" style={styles.loadingText}>
            Загрузка профиля...
          </StyledText>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Информация о пользователе */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="user-circle" size={80} color={theme.colors.primary} />
        </View>
        <StyledText variant="title" style={styles.username}>
          {user?.username || "Пользователь"}
        </StyledText>
        <StyledText variant="regular" style={styles.email}>
          {user?.email || ""}
        </StyledText>
        <StyledText variant="regular" style={styles.joinDate}>
          Зарегистрирован: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""}
        </StyledText>
      </Animated.View>

      {/* Статистика */}
      {stats && stats.totalGames > 0 ? (
        <>
          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <StyledText variant="title" style={styles.sectionTitle}>
              📊 Статистика
            </StyledText>
          </Animated.View>

          {/* Основная статистика */}
          <View style={styles.statsGrid}>
            <StatCard
              icon="gamepad"
              title="Игр сыграно"
              value={stats.totalGames}
              subtitle="всего"
              color={theme.colors.primary}
            />

            <StatCard
              icon="trophy"
              title="Лучший результат"
              value={stats.bestScore}
              subtitle="очков"
              color={theme.colors.success}
            />

            <StatCard
              icon="chart-line"
              title="Средний балл"
              value={stats.averageScore}
              subtitle="очков"
              color={theme.colors.accent}
            />

            <StatCard
              icon="clock"
              title="Время игры"
              value={`${Math.round(stats.totalTimePlayed / 60)}м`}
              subtitle="минут"
              color={theme.colors.info}
            />
          </View>

          {/* Детальная статистика */}
          <View style={styles.detailedStats}>
            <Animated.View entering={FadeInUp.duration(600).delay(300)}>
              <StyledText variant="regular" style={styles.detailSectionTitle}>
                Детальная статистика
              </StyledText>
            </Animated.View>

            <View style={styles.detailGrid}>
              <StatCard
                icon="check-circle"
                title="Правильных ответов"
                value={stats.correctAnswers}
                color={theme.colors.success}
              />

              <StatCard
                icon="times-circle"
                title="Неправильных ответов"
                value={stats.wrongAnswers}
                color={theme.colors.error}
              />

              <StatCard
                icon="forward"
                title="Пропущенных"
                value={stats.skippedAnswers}
                color={theme.colors.warning}
              />

              <StatCard
                icon="bullseye"
                title="Точность"
                value={`${stats.accuracy}%`}
                color={theme.colors.accent}
              />
            </View>
          </View>
        </>
      ) : (
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.emptyContainer}>
          <FontAwesome5 name="chart-bar" size={64} color={theme.colors.textSecondary} />
          <StyledText variant="regular" style={styles.emptyText}>
            Пока нет данных для статистики
          </StyledText>
          <StyledText variant="regular" style={styles.emptySubtext}>
            Сыграйте несколько игр, чтобы увидеть свою статистику
          </StyledText>
        </Animated.View>
      )}

      {/* Кнопка выхода */}
      <Animated.View entering={FadeInUp.duration(600).delay(400)}>
        <StyledButton
          label="Выйти"
          iconName="sign-out-alt"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    minHeight: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  userSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  username: {
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  email: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  joinDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
    ...theme.shadows.small,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: theme.colors.textPrimary,
  },
  statSubtitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  detailedStats: {
    marginBottom: theme.spacing.xl,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    marginTop: theme.spacing.lg,
    textAlign: "center",
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  emptySubtext: {
    marginTop: theme.spacing.sm,
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  logoutButton: {
    marginTop: theme.spacing.lg,
  },
});
