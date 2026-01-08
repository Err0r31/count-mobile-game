import StyledButton from "@/components/StyledButton";
import StyledText from "@/components/StyledText";
import { LEVELS, type PreparedProblem } from "@/levelsData";
import { saveLevelProgress } from "@/storage";
import { theme } from "@/ui";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    Vibration,
    View,
} from "react-native";
import Modal from "react-native-modal";
import Animated, {
    BounceIn,
    FadeIn,
    FadeInUp,
    FadeOut,
    SlideInLeft,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

function pickRandomN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

export default function LevelScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const levelId = Number(id);
  const level = useMemo(() => LEVELS.find((l) => l.id === levelId), [levelId]);

  // Данные уровня
  const [deck, setDeck] = useState<PreparedProblem[]>([]);
  const [idx, setIdx] = useState(0);

  // Статистика
  const [userAnswer, setUserAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Модалка финиша (как в game.tsx)
  const [isLevelFinished, setIsLevelFinished] = useState(false);

  // Визуальная обратная связь через цвет рамки (как в game.tsx)
  const [borderColor, setBorderColor] = useState(theme.colors.border);

  // Shake анимация (как в game.tsx)
  const shakeOffset = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  const showBorderFeedback = (type: "correct" | "wrong") => {
    const color =
      type === "correct" ? theme.colors.success : theme.colors.error;
    setBorderColor(color);
    setTimeout(() => setBorderColor(theme.colors.border), 1000);
  };

  // Инициализация уровня
  useEffect(() => {
    if (!level) return;
    setDeck(pickRandomN(level.problems, 10));
    setIdx(0);
    setUserAnswer("");
    setCorrectCount(0);
    setWrongCount(0);
    setIsLevelFinished(false);
    setBorderColor(theme.colors.border);
  }, [levelId]);

  const current = deck[idx];

  const handleSubmit = () => {
    if (!current) return;

    const trimmed = userAnswer.trim();
    if (!trimmed) return;

    const isCorrect = Number(trimmed) === current.answer;

    // Тактильный отклик как в game.tsx
    if (Platform.OS === "ios") {
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        triggerShake();
      }
    } else if (Platform.OS === "android") {
      if (isCorrect) {
        Vibration.vibrate(100);
      } else {
        Vibration.vibrate([0, 100, 50, 100]);
        triggerShake();
      }
    }

    // Визуальный фидбек
    showBorderFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) setCorrectCount((c) => c + 1);
    else setWrongCount((c) => c + 1);

    setUserAnswer("");

    const next = idx + 1;

    // Клавиатуру закрываем только на ПОСЛЕДНЕМ вопросе
    if (next >= deck.length) {
      Keyboard.dismiss();
      setIsLevelFinished(true);

      const finalCorrect = correctCount + (isCorrect ? 1 : 0);
      saveLevelProgress(levelId, finalCorrect, deck.length);
    } else {
      setIdx(next);
    }
  };

  const handleRestart = () => {
    if (!level) return;

    // лёгкий тактильный отклик как в game.tsx (для действий)
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
    } else if (Platform.OS === "android") {
      Vibration.vibrate(50);
    }

    setDeck(pickRandomN(level.problems, 10));
    setIdx(0);
    setUserAnswer("");
    setCorrectCount(0);
    setWrongCount(0);
    setIsLevelFinished(false);
    setBorderColor(theme.colors.border);
  };

  if (!level) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: `Уровень ${id}` }} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.gameContent}>
            <StyledText variant="title">Уровень не найден</StyledText>
            <StyledButton
              variant="primary"
              label="Назад"
              iconName="arrow-left"
              onPress={() => router.back()}
              style={[styles.fullWidthButton, { marginTop: theme.spacing.lg }]}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `Уровень ${id}` }} />

      {/* Финальная модалка — копия по структуре из game.tsx */}
      <Modal
        isVisible={isLevelFinished}
        onModalHide={() => {
          // ничего не делаем (как в game.tsx)
        }}
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          style={styles.modalContent}
        >
          <StyledText variant="title">Уровень пройден!</StyledText>

          <StyledText variant="regular" style={styles.score}>
            Верно: <StyledText variant="highlight">{correctCount}</StyledText>{" "}
            из {deck.length}
          </StyledText>

          <View style={styles.modalButtonContainer}>
            <StyledButton
              variant="primary"
              label="Ещё раз"
              iconName="refresh"
              style={styles.modalButton}
              onPress={handleRestart}
            />
            <StyledButton
              variant="primary"
              label="К уровням"
              iconName="list"
              style={styles.modalButton}
              onPress={() => router.replace("/levels")}
            />
          </View>
        </Animated.View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 30}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.contentContainer}
        >
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.gameContent}
          >
            {/* Верхняя панель — как gameInfo */}
            <Animated.View
              entering={SlideInLeft.duration(400).delay(100)}
              style={styles.gameInfo}
            >
              <StyledText variant="regular" style={styles.timer}>
                {level.title}:{" "}
                <StyledText variant="highlight">{idx + 1}</StyledText>/
                {deck.length}
              </StyledText>

              <StyledText variant="regular" style={styles.score}>
                ✅ <StyledText variant="highlight">{correctCount}</StyledText> /
                ❌ <StyledText variant="highlight">{wrongCount}</StyledText>
              </StyledText>
            </Animated.View>

            {/* Пример — как problemContainer */}
            <Animated.View
              entering={BounceIn.duration(800).delay(200)}
              style={[styles.problemContainer, { borderColor }, shakeStyle]}
            >
              <StyledText variant="title" style={styles.problem}>
                {current?.text ?? "..."}
              </StyledText>
            </Animated.View>

            {/* Input — как в game.tsx (80% ширины) */}
            <Animated.View entering={FadeInUp.duration(600).delay(300)}>
              <TextInput
                style={styles.input}
                value={userAnswer}
                onChangeText={setUserAnswer}
                keyboardType="numeric"
                placeholder="Ваш ответ"
                placeholderTextColor={theme.colors.textSecondary}
                onSubmitEditing={handleSubmit}
                onKeyPress={({ nativeEvent }) => {
                  if (
                    nativeEvent.key === "Enter" &&
                    Platform.OS === "android"
                  ) {
                    handleSubmit();
                  }
                }}
                blurOnSubmit={false}
                autoFocus
              />
            </Animated.View>

            {/* Кнопки — как в game.tsx, но одна */}
            <Animated.View
              entering={FadeInUp.duration(600).delay(400)}
              style={styles.buttonContainer}
            >
              <StyledButton
                variant="primary"
                label="Ответить"
                iconName="check"
                onPress={handleSubmit}
                style={styles.actionButton}
              />
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    alignItems: "center",
  },

  // как gameContent в game.tsx
  gameContent: {
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
  },

  // как gameInfo
  gameInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  timer: {
    color: theme.colors.accent,
    fontWeight: "bold" as const,
  },
  score: {
    color: theme.colors.success,
    fontWeight: "bold" as const,
  },

  // как problemContainer
  problemContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
    width: "100%",
  },
  problem: {
    textAlign: "center",
    color: theme.colors.textPrimary,
    fontWeight: "bold" as const,
  },

  // как input в game.tsx (80% width)
  input: {
    width: "80%",
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: 18,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.backgroundLight,
    color: theme.colors.textPrimary,
    ...theme.shadows.medium,
  },

  // как buttonContainer/actionButton
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },

  fullWidthButton: {
    width: "100%",
    minHeight: 55,
  },

  // модалка — как modalContent в game.tsx
  modalContent: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    ...theme.shadows.large,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
});
