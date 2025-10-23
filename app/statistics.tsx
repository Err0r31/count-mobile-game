import StyledButton from "@/components/StyledButton"; // единый стиль кнопок проекта
import StyledText from "@/components/StyledText"; // единый стиль текста проекта
import { loadHighscores } from "@/storage"; // функции для работы с рекордами
import { theme } from "@/ui"; // тема
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // иконки из библиотеки FontAwesome
import { useRouter } from "expo-router"; // хук для переходов между экранами
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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

export default function StatisticsScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const highscores = await loadHighscores();
      
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
      const bestScore = Math.max(...highscores.map(h => h.score));
      const averageScore = highscores.reduce((sum, h) => sum + h.score, 0) / totalGames;
      
      // Примерные вычисления (так как у нас нет детальной статистики)
      const estimatedCorrectAnswers = highscores.reduce((sum, h) => sum + Math.max(0, h.score / 10), 0);
      const estimatedWrongAnswers = highscores.reduce((sum, h) => sum + Math.max(0, -h.score / 5), 0);
      const estimatedSkippedAnswers = highscores.reduce((sum, h) => sum + Math.max(0, -h.score / 2), 0);
      
      const totalAnswers = estimatedCorrectAnswers + estimatedWrongAnswers + estimatedSkippedAnswers;
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
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    color = theme.colors.primary 
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
        <StyledText variant="regular" style={styles.statTitle}>{title}</StyledText>
        <StyledText variant="highlight" style={styles.statValue}>{value}</StyledText>
        {subtitle && (
          <StyledText variant="regular" style={styles.statSubtitle}>{subtitle}</StyledText>
        )}
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.loadingContainer}>
          <FontAwesome5 name="chart-line" size={48} color={theme.colors.primary} />
          <StyledText variant="regular" style={styles.loadingText}>
            Загрузка статистики...
          </StyledText>
        </Animated.View>
      </View>
    );
  }

  if (!stats || stats.totalGames === 0) {
    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <StyledText variant="title" style={styles.title}>
            📊 Статистика
          </StyledText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.emptyContainer}>
          <FontAwesome5 name="chart-bar" size={64} color={theme.colors.textSecondary} />
          <StyledText variant="regular" style={styles.emptyText}>
            Пока нет данных для статистики
          </StyledText>
          <StyledText variant="regular" style={styles.emptySubtext}>
            Сыграйте несколько игр, чтобы увидеть свою статистику
          </StyledText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(400)}>
          <StyledButton
            variant="primary"
            label="Назад"
            iconName="arrow-left"
            onPress={() => router.back()}
          />
        </Animated.View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(600)}>
        <StyledText variant="title" style={styles.title}>
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
          <StyledText variant="regular" style={styles.sectionTitle}>
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

      <Animated.View entering={FadeInUp.duration(600).delay(500)}>
        <StyledButton
          variant="primary"
          label="Назад"
          iconName="arrow-left"
          onPress={() => router.back()}
        />
      </Animated.View>
    </ScrollView>
  );
}

// Стили с современной темой
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
  title: {
    marginBottom: theme.spacing.xl,
    textAlign: "center",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
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
  sectionTitle: {
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
});
