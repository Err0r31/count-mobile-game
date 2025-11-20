import StyledButton from "@/components/StyledButton"; // единый стиль кнопок проекта
import StyledText from "@/components/StyledText"; // единый стиль текста проекта
import { addHighscore, loadSettings, type Settings } from "@/storage"; // функции для работы с настройками и рекордами
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // иконки из библиотеки FontAwesome
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router"; // хук для переходов между экранами
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Vibration,
  View,
} from "react-native";
import Modal from "react-native-modal"; // библиотека для модальных окон (старт, финиш)
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
} from "react-native-reanimated"; // анимации для модалок (появления/скрытия)
import { theme } from "../ui";


// Генерация целочисленного случайного числа
export function randInt(min: number, max: number): number {
  const lo = Math.min(min, max),
    hi = Math.max(min, max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
};


// Выбор операции по настройкам
export function pickOp(ops: Settings["ops"]): "+" | "-" | "*" | "/" {
  const list = Object.entries(ops)
    .filter(([_, v]) => v)
    .map(([key]) =>
      key === "add"
        ? "+"
        : key === "sub"
          ? "-"
          : key === "mul"
            ? "*"
            : "/"
    );

  return list[Math.floor(Math.random() * list.length)];
}


// Генерируем пример: без eval, деление даёт целый ответ, разность неотрицательная
export const generateProblem = (settings?: Settings) => {
  // Выбираем настройки (если не переданы)
  const s =
    settings ??
    ({
      rangeMin: 1,
      rangeMax: 50,
      ops: { add: true, sub: true, mul: true, div: true },
    } as Settings);

  let op = pickOp(s.ops);

  // Генерация чисел
  let a = randInt(s.rangeMin, s.rangeMax);
  let b = randInt(s.rangeMin, s.rangeMax);

  if (op === "-") {
    if (b > a) [a, b] = [b, a]; // избегаем отрицательных результатов
  } else if (op === "/") {
    // b = randInt(s.rangeMin, s.rangeMax);
    // const max_k = Math.floor(s.rangeMax / b);
    // const min_k = Math.ceil(s.rangeMin / b);
    // const k = randInt(Math.max(1, min_k), max_k);
    // a = b * k;

    // гарантируем, что делитель не превышает rangeMax и не равен 0
    do {
      b = randInt(s.rangeMin, s.rangeMax);

      const max_k = Math.floor(s.rangeMax / b);
      const min_k = Math.max(1, Math.ceil(s.rangeMin / b));

      if (max_k >= 1) {
        const lo = Math.min(min_k, max_k);
        const hi = Math.max(min_k, max_k);
        const k = randInt(lo, hi);
        a = b * k;
        break;
      }
    } while (true);
  }

  const correct =
    op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;

  // возвращаем объект для тестов и внутренней логики
  const problem = `${a} ${op} ${b}`;

  return { problem, correct };
};


// Подсчёт очков игрока
export function calculateScore(
  currentScore: number,
  isCorrect: boolean | null,
  timeTaken: number
): number {
  const base = 10; // базовые очки за правильный ответ
  const bonusFast = 5; // если ответ <5 сек
  const penaltyWrong = -5; // штраф

  if (isCorrect === true) {
    let gained = base;
    if (timeTaken < 5) gained += bonusFast;
    return currentScore + gained;
  }

  if (isCorrect === false) {
    return Math.max(0, currentScore + penaltyWrong);
  }

  // если пропуск
  return currentScore;
}


// Логика таймера игры
// Возвращает объект с методами: start(), tick(), reset()
export function createTimerLogic(initialTime: number = 60) {
  let time = initialTime;
  let running = false;

  return {
    getTime: () => time,
    isRunning: () => running,

    start() {
      if (time > 0) running = true;
    },

    tick() {
      if (!running) return time;
      if (time > 0) time -= 1;
      if (time <= 0) {
        time = 0;
        running = false;
      }
      return time;
    },

    reset() {
      time = initialTime;
      running = false;
      return time;
    },
  };
}




// Основной экран игры
export default function GameScreen() {
  const router = useRouter();

  // Состояние и реф для аудио
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null); // Для хранения объекта звука

  // Состояние игры
  const [isGameStarted, setIsGameStarted] = useState(false); // флаг, что игра началась
  const [countdown, setCountdown] = useState(3); // стартовый отсчет
  const [timeLeft, setTimeLeft] = useState(60); // таймер раунда
  const [score, setScore] = useState(0); // текущий счёт

  // Текущий пример
  const [problem, setProblem] = useState(""); // текст примера
  const [correctAnswer, setCorrectAnswer] = useState(0); // правильный ответ
  const [userAnswer, setUserAnswer] = useState(""); // ввод пользователя

  // Прочее
  const [isGameOver, setIsGameOver] = useState(false); // флаг, что игра окончена
  const [answerStartTime, setAnswerStartTime] = useState(0); // время начала ввода ответа (для бонуса за скорость)
  const [isStartModalVisible, setIsStartModalVisible] = useState(true); // видимость стартовой модалки
  const [settings, setSettings] = useState<Settings | null>(null); // загруженные настройки

  // Визуальная обратная связь через цвет рамки
  const [borderColor, setBorderColor] = useState(theme.colors.border);

  // Анимация встряхивания для неверного ответа
  const shakeOffset = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  // Функция для запуска анимации встряхивания
  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  // Загружаем настройки один раз и ставим длительность раунда
  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await loadSettings();
      if (alive) {
        setSettings(s);
        setTimeLeft(s.durationSec);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Загрузка и настройка аудио
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: audioSound } = await Audio.Sound.createAsync(
          require("../assets/audio/background_music.mp3"), // Укажи путь к файлу
          { shouldPlay: false, isLooping: true } // Не играть сразу, зациклить
        );
        soundRef.current = audioSound;
        setSound(audioSound);
      } catch (error) {
        console.log("Ошибка загрузки музыки:", error);
      }
    };

    loadSound();

    // Очистка при размонтировании
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Воспроизведение музыки при старте игры
  useEffect(() => {
    if (isGameStarted && sound && settings?.soundEnabled) {
      const playSound = async () => {
        try {
          await sound.playAsync();
        } catch (error) {
          console.log("Ошибка воспроизведения музыки:", error);
        }
      };
      playSound();
    }
  }, [isGameStarted, sound, settings?.soundEnabled]);

  // Пауза музыки при завершении игры
  useEffect(() => {
    if (isGameOver && sound) {
      const pauseSound = async () => {
        try {
          await sound.pauseAsync();
        } catch (error) {
          console.log("Ошибка паузы музыки:", error);
        }
      };
      pauseSound();
    }
  }, [isGameOver, sound]);

  // Генерация целочисленного случайного числа randInt перенесена наверх

  // Выбор операции по включенным настройкам pickOp перенесена наверх

  // Показать визуальную обратную связь через цвет рамки
  const showBorderFeedback = (type: "correct" | "wrong" | "skip") => {
    let color = theme.colors.border;

    switch (type) {
      case "correct":
        color = theme.colors.success;
        break;
      case "wrong":
        color = theme.colors.error;
        break;
      case "skip":
        color = theme.colors.warning;
        break;
    }

    setBorderColor(color);
    // Вернуть обычный цвет через 1 секунду
    setTimeout(() => setBorderColor(theme.colors.border), 1000);
  };

  // Функция генерации generateProblem перенесена наверх

  // Старт: обратный отсчёт -> скрываем модалку -> запускаем игру и первый пример
  useEffect(() => {
    if (!settings) return;

    if (countdown > 0 && isStartModalVisible) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else if (countdown === 0 && !isGameStarted) {
      setIsStartModalVisible(false);
      setIsGameStarted(true);
      generateProblem();
    }
  }, [
    countdown,
    isGameStarted,
    isStartModalVisible,
    settings,
    generateProblem,
  ]);

  // Таймер раунда и завершение игры
  useEffect(() => {
    if (isGameStarted && timeLeft > 0 && !isGameOver) {
      const t = setTimeout(() => setTimeLeft((sec) => sec - 1), 1000);
      return () => clearTimeout(t);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameStarted, isGameOver]);

  // Обработка ответа пользователя
  const handleSubmit = () => {
    const trimmed = userAnswer.trim();
    if (!trimmed) return;

    const answerTime = (Date.now() - answerStartTime) / 1000;
    const isCorrect = parseFloat(trimmed) === correctAnswer;
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
      }
    }

    // Бонус за скорость: если ответ <5 сек (+12 очков суммарно)
    const bonus = isCorrect && answerTime < 5 ? 2 : 0;
    const delta = isCorrect ? 10 + bonus : -5;

    // Показать визуальную обратную связь
    showBorderFeedback(isCorrect ? "correct" : "wrong");

    setScore((prev) => prev + delta);
    setUserAnswer("");
    generateProblem();
  };

  // Обработка пропуска примера (-2 очка)
  const handleSkip = () => {
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
    } else if (Platform.OS === "android") {
      Vibration.vibrate(50);
    }
    showBorderFeedback("skip");
    setScore((prev) => prev - 2);
    setUserAnswer("");
    generateProblem();
  };

  // Перезапуск игры: сбрасываем всё и возвращаемся к стартовой модалке
  const handleRestart = () => {
    setIsGameOver(false);
    setIsGameStarted(false);
    setCountdown(3);
    setTimeLeft(settings?.durationSec ?? 60);
    setScore(0);
    setUserAnswer("");
    setProblem("");
    setCorrectAnswer(0);
    setAnswerStartTime(0);
    setIsStartModalVisible(true);
    if (sound && settings?.soundEnabled) {
      sound.playAsync();
    }
  };

  // Сохраняем результат в таблицу рекордов при закрытии финальной модалки
  useEffect(() => {
    if (!isGameOver) return;
    (async () => {
      await addHighscore({ date: new Date().toISOString(), score });
    })();
  }, [isGameOver, score]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 30}
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.contentContainer}
      >
        {/* Начальная модалка */}
        <Modal isVisible={isStartModalVisible}>
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={styles.modalContentStart}
          >
            <FontAwesome5
              name="clock"
              size={48}
              color="#fff"
              style={styles.modalIcon}
            />
            <StyledText variant="title" style={styles.modalText}>
              Игра начнётся через {countdown}...
            </StyledText>
          </Animated.View>
        </Modal>

        {/* Основной экран игры */}
        {isGameStarted && !isGameOver && (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.gameContent}
          >
            <Animated.View
              entering={SlideInLeft.duration(400).delay(100)}
              style={styles.gameInfo}
            >
              <StyledText variant="regular" style={styles.timer}>
                ⏰ Время:{" "}
                <StyledText variant="highlight">{timeLeft}с</StyledText>
              </StyledText>
              <StyledText variant="regular" style={styles.score}>
                🎯 Очки: <StyledText variant="highlight">{score}</StyledText>
              </StyledText>
            </Animated.View>

            <Animated.View
              entering={BounceIn.duration(800).delay(200)}
              style={[styles.problemContainer, { borderColor }, shakeStyle]}
            >
              <StyledText variant="title" style={styles.problem}>
                {problem}
              </StyledText>
            </Animated.View>

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
                autoFocus={true}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.duration(600).delay(400)}
              style={styles.buttonContainer}
            >
              <StyledButton
                variant="skip"
                label="Пропустить"
                iconName="forward"
                onPress={handleSkip}
                style={styles.actionButton}
              />
              <StyledButton
                variant="primary"
                label="Ответить"
                iconName="check"
                onPress={handleSubmit}
                style={styles.actionButton}
              />
            </Animated.View>
          </Animated.View>
        )}

        {/* Финальная модалка с итоговой статистикой */}
        <Modal isVisible={isGameOver}>
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={styles.modalContent}
          >
            <FontAwesome5
              name="trophy"
              size={48}
              color={theme.colors.primary}
              style={styles.modalIcon}
            />
            <StyledText variant="title">Игра окончена!</StyledText>
            <StyledText variant="regular" style={styles.score}>
              Ваш счёт:{" "}
              <StyledText variant="highlight">{score} очков</StyledText>
            </StyledText>
            <View style={styles.modalButtonContainer}>
              <StyledButton
                variant="primary"
                label="Играть снова"
                iconName="refresh"
                style={styles.modalButton}
                onPress={handleRestart}
              />
              <StyledButton
                variant="primary"
                label="На главную"
                iconName="home"
                style={styles.modalButton}
                onPress={() => router.back()}
              />
            </View>
          </Animated.View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Стили для данного экрана
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
  gameContent: {
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
  },
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
  problemContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  problem: {
    textAlign: "center",
    color: theme.colors.textPrimary,
    fontWeight: "bold" as const,
  },
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    ...theme.shadows.large,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  modalContentStart: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    ...theme.shadows.large,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  modalIcon: {
    marginBottom: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
  modalText: {
    color: theme.colors.textOnPrimary,
    textAlign: "center",
  },
});
