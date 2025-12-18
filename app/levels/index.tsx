import StyledButton from "@/components/StyledButton";
import StyledText from "@/components/StyledText";
import { LEVELS } from "@/levelsData";
import { loadLevelsProgress, type LevelsProgress } from "@/storage";
import { theme } from "@/ui";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function LevelsScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<LevelsProgress>({});

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const p = await loadLevelsProgress();
        if (alive) setProgress(p);
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledText variant="title" style={styles.title}>
        Уровни
      </StyledText>

      <View style={styles.card}>
        {LEVELS.map((lvl) => {
          const entry = progress[String(lvl.id)];
          const best = entry?.bestCorrect ?? 0;

          const isPassed = best >= 7; // 7/10 и выше — пройдено

          return (
            <View key={lvl.id}>
              <StyledButton
                variant="primary"
                label={`${lvl.title}${
                  lvl.description ? ` — ${lvl.description}` : ""
                }`}
                iconName="layer-group"
                onPress={() =>
                  router.push({
                    pathname: "/levels/[id]",
                    params: { id: String(lvl.id) },
                  })
                }
                style={[
                  styles.button,
                  isPassed && styles.levelItemPassed,
                  entry && !isPassed && styles.levelItemPlayed,
                ]}
              />
            </View>
          );
        })}

        <StyledButton
          variant="primary"
          label="Назад"
          iconName="arrow-left"
          onPress={() => router.push("/")}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing.lg,
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

  levelItemPlayed: {
    borderWidth: 2,
    borderColor: theme.colors.warning,
  },

  levelItemPassed: {
    borderWidth: 2,
    borderColor: theme.colors.success,
  },

  button: {
    width: "100%",
    minHeight: 55,
    ...theme.shadows.medium,
  },
});
