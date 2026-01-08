import StyledButton from "@/components/StyledButton";
import StyledText from "@/components/StyledText";
import { theme } from "@/ui";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function ModeSelectScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <FontAwesome5 name="gamepad" size={56} color={theme.colors.primary} />
        <StyledText variant="title" style={styles.title}>
          Выбор режима
        </StyledText>
        <StyledText variant="regular" style={styles.subtitle}>
          Как хотите играть?
        </StyledText>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(500).delay(150)}
        style={styles.card}
      >
        <StyledButton
          variant="primary"
          label="Игра на время"
          iconName="clock"
          onPress={() => router.push("/game")}
          style={styles.button}
        />

        <StyledButton
          variant="primary"
          label="Прохождение уровней"
          iconName="layer-group"
          onPress={() => router.push("/levels")}
          style={styles.button}
        />

        <StyledButton
          variant="primary"
          label="Назад"
          iconName="arrow-left"
          onPress={() => router.back()}
          style={styles.button}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginTop: theme.spacing.md,
    fontSize: 28,
    fontWeight: "bold" as const,
    textAlign: "center",
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  button: {
    width: "100%",
    minHeight: 55,
    ...theme.shadows.medium,
  },
});
