import StyledButton from "@/components/StyledButton"; // единый стиль кнопок проекта
import StyledText from "@/components/StyledText"; // единый стиль текста проекта
import { loadHighscores, type Highscore } from "@/storage"; // чтение рекордов из AsyncStorage
import { theme } from "@/ui"; // тема
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router"; // хук для переходов между экранами
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

export default function HighscoresScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Highscore[] | null>(null);

  // Загрузка рекордов при монтировании компонента
  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await loadHighscores();
      if (alive) setItems(list);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <StyledText variant="title" style={styles.title}>
          🏆 Таблица рекордов
        </StyledText>
      </Animated.View>

      {/* Три состояния: загрузка / пусто / список */}
      {items === null ? (
        <Animated.View
          entering={FadeIn.duration(400)}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <StyledText variant="regular" style={styles.loadingText}>
            Загрузка...
          </StyledText>
        </Animated.View>
      ) : items.length === 0 ? (
        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.emptyContainer}
        >
          <FontAwesome5 name="trophy" size={60} color={theme.colors.border} />
          <StyledText variant="regular" style={styles.emptyText}>
            Пока нет результатов
          </StyledText>
          <StyledText variant="regular" style={styles.emptySubtext}>
            Сыграйте первую игру, чтобы появился рекорд!
          </StyledText>
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.listContainer}
        >
          <FlatList
            style={styles.list}
            data={items}
            keyExtractor={(it, idx) => `${it.date}-${it.score}-${idx}`}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInUp.duration(400).delay(index * 100)}
                style={[
                  styles.row,
                  index < 3 && styles.topThree,
                  index === 0 && styles.firstPlace,
                  index === 1 && styles.secondPlace,
                  index === 2 && styles.thirdPlace,
                ]}
              >
                <View style={styles.placeContainer}>
                  {index < 3 && (
                    <FontAwesome5
                      name={
                        index === 0 ? "crown" : index === 1 ? "medal" : "award"
                      }
                      size={20}
                      color={
                        index === 0
                          ? "#FFD700"
                          : index === 1
                          ? "#C0C0C0"
                          : "#CD7F32"
                      }
                    />
                  )}
                  <StyledText variant="regular" style={styles.place}>
                    {index + 1}.
                  </StyledText>
                </View>
                <StyledText variant="regular" style={styles.score}>
                  {item.score} очков
                </StyledText>
                <StyledText variant="regular" style={styles.date}>
                  {new Date(item.date).toLocaleString()}
                </StyledText>
              </Animated.View>
            )}
          />
        </Animated.View>
      )}

      {/* Кнопки действий */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(400)}
        style={styles.buttonContainer}
      >
        <StyledButton
          variant="primary"
          label="Статистика"
          iconName="chart-line"
          onPress={() => router.push("/statistics")}
          style={styles.actionButton}
        />
      </Animated.View>
    </View>
  );
}

// Стили с современной темой
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  loadingText: {
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
  },
  emptySubtext: {
    textAlign: "center",
    color: theme.colors.textLight,
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  list: {
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.backgroundLight,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  topThree: {
    borderWidth: 2,
    ...theme.shadows.medium,
  },
  firstPlace: {
    borderColor: "#FFD700",
    backgroundColor: "#FFF8DC",
  },
  secondPlace: {
    borderColor: "#C0C0C0",
    backgroundColor: "#F5F5F5",
  },
  thirdPlace: {
    borderColor: "#CD7F32",
    backgroundColor: "#FDF5E6",
  },
  placeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    width: 60,
  },
  place: {
    fontWeight: "bold" as const,
    color: theme.colors.textPrimary,
  },
  score: {
    flex: 1,
    fontWeight: "600" as const,
    color: theme.colors.textPrimary,
  },
  date: {
    flex: 1,
    textAlign: "right",
    color: theme.colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
