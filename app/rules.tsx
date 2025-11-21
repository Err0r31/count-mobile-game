import StyledText from "@/components/StyledText"; // единый стиль текста проекта
import { theme } from "@/ui"; // тема
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // иконки из библиотеки FontAwesome
import { useRouter } from "expo-router"; // хук для переходов между экранами 
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function RuleScreen() {
  const router = useRouter(); // переходы между экранами

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(600)}>
        <StyledText variant="title" style={styles.title}>
          📖 Правила игры
        </StyledText>
      </Animated.View>

      {/* Список правил: иконка + текст */}
      <View style={styles.rulesList}>
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.ruleItem}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent }]}>
            <FontAwesome5 name="bullseye" size={24} color={theme.colors.textOnPrimary} />
          </View>
          <StyledText variant="regular" style={styles.ruleText}>
            Решайте как можно больше математических примеров за 60 секунд!
          </StyledText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.ruleItem}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.success }]}>
            <FontAwesome5 name="check-circle" size={24} color={theme.colors.textOnPrimary} />
          </View>
          <StyledText variant="regular" style={styles.ruleText}>
            Правильный ответ: <StyledText variant="highlight">+10 очков</StyledText>.
          </StyledText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.ruleItem}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.error }]}>
            <FontAwesome5 name="times-circle" size={24} color={theme.colors.textOnPrimary} />
          </View>
          <StyledText variant="regular" style={styles.ruleText}>
            Ошибка: <StyledText variant="highlight">-5 очков</StyledText>.
          </StyledText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.ruleItem}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.warning }]}>
            <FontAwesome5 name="bolt" size={24} color={theme.colors.textOnPrimary} />
          </View>
          <StyledText variant="regular" style={styles.ruleText}>
            Быстрый ответ (менее 5 секунд): <StyledText variant="highlight">+2 очка</StyledText>.
          </StyledText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.ruleItem}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.info }]}>
            <FontAwesome5 name="clock" size={24} color={theme.colors.textOnPrimary} />
          </View>
          <StyledText variant="regular" style={styles.ruleText}>
            Время: <StyledText variant="highlight">60 секунд</StyledText>. После окончания вы увидите свой счёт.
          </StyledText>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.ruleItem}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.textSecondary }]}>
            <FontAwesome5 name="forward" size={24} color={theme.colors.textOnPrimary} />
          </View>
          <StyledText variant="regular" style={styles.ruleText}>
            Пропуск примера: <StyledText variant="highlight">-2 очка</StyledText>.
          </StyledText>
        </Animated.View>
      </View>

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
  rulesList: {
    width: "100%",
    marginBottom: theme.spacing.xl,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
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
  ruleText: {
    flex: 1,
    lineHeight: 24,
  },
});
