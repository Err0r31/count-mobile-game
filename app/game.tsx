import StyledButton from "@/components/StyledButton";                   // единый стиль кнопок проекта
import StyledText from "@/components/StyledText";                       // единый стиль текста проекта
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";             // иконки из библиотеки FontAwesome
import { useRouter } from "expo-router";                                // хук для переходов между экранами 
import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Modal from "react-native-modal";                                 // библиотека для модальных окон (старт, финиш)
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";    // анимации для модалок (появления/скрытия)
import { addHighscore, loadSettings, type Settings } from "@/storage";  // функции для работы с настройками и рекордами

export default function GameScreen() {
  const router = useRouter();
  
  // Состояние игры
  const [isGameStarted, setIsGameStarted] = useState(false);            // флаг, что игра началась
  const [countdown, setCountdown] = useState(3);                        // стартовый отсчет
  const [timeLeft, setTimeLeft] = useState(60);                         // таймер раунда
  const [score, setScore] = useState(0);                                // текущий счёт

  // Текущий пример
  const [problem, setProblem] = useState("");                           // текст примера
  const [correctAnswer, setCorrectAnswer] = useState(0);                // правильный ответ
  const [userAnswer, setUserAnswer] = useState("");                     // ввод пользователя               

  // Прочее
  const [isGameOver, setIsGameOver] = useState(false);                  // флаг, что игра окончена
  const [answerStartTime, setAnswerStartTime] = useState(0);            // время начала ввода ответа (для бонуса за скорость)
  const [isStartModalVisible, setIsStartModalVisible] = useState(true); // видимость стартовой модалки
  const [settings, setSettings] = useState<Settings | null>(null);      // загруженные настройки

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
    return () => { alive = false; };
  }, []);

  // Генерация целочисленного случайного числа
  const randInt = (min: number, max: number) => {
    const lo = Math.min(min, max), hi = Math.max(min, max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  };

  // Выбор операции по включенным настройкам
  const pickOp = (ops: Settings['ops']): '+' | '-' | '*' | '/' => {
    const list = [
      ops.add ? '+' : null,
      ops.sub ? '-' : null,
      ops.mul ? '*' : null,
      ops.div ? '/' : null,
    ].filter((x): x is '+' | '-' | '*' | '/' => x !== null);

    return list.length ? list[Math.floor(Math.random() * list.length)] : '+';
  };

  // Генерируем пример: без eval, деление даёт целый ответ, разность неотрицательная
  const generateProblem = useCallback(() => {
    const s = settings ?? { rangeMin: 1, rangeMax: 50, ops: { add: true, sub: true, mul: true, div: true } } as Settings;
    const op = pickOp(s.ops);

    let a = randInt(s.rangeMin, s.rangeMax);
    let b = randInt(s.rangeMin, s.rangeMax);

    if (op === '-') {
      if (b > a) [a, b] = [b, a]; // избегаем отрицательных результатов
    } else if (op === '/') {
      // Хотим целый ответ: a = b * q
      b = Math.max(1, randInt(s.rangeMin, s.rangeMax));
      const q = randInt(Math.max(1, s.rangeMin), Math.max(1, s.rangeMax));
      a = b * q;  
    }

    const correct =
      op === '+' ? a + b :
        op === '-' ? a - b :
          op === '*' ? a * b :
            a / b;

    setProblem(`${a} ${op} ${b}`);
    setCorrectAnswer(correct);
    setAnswerStartTime(Date.now());
    return correct;
  }, [settings]);

  // Старт: обратный отсчёт -> скрываем модалку -> запускаем игру и первый пример
  useEffect(() => {
    if (!settings) return;

    if (countdown > 0 && isStartModalVisible) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else if (countdown === 0 && !isGameStarted) {
      setIsStartModalVisible(false);
      setIsGameStarted(true);
      generateProblem();
    }
  }, [countdown, isGameStarted, isStartModalVisible, settings, generateProblem]);

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

    // Бонус за скорость: если ответ <5 сек (+12 очков суммарно)
    const bonus = isCorrect && answerTime < 5 ? 12 : 0;
    const delta = isCorrect ? 10 + bonus : -5;

    setScore((prev) => prev + delta);
    setUserAnswer("");
    generateProblem();
  };

  // Обработка пропуска примера (-2 очка)
  const handleSkip = () => {
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
          <View style={styles.gameContent}>
            <StyledText variant="regular" style={styles.timer}>
              Время: <StyledText variant="highlight">{timeLeft} сек</StyledText>
            </StyledText>
            <StyledText variant="regular" style={styles.score}>
              Очки: <StyledText variant="highlight">{score}</StyledText>
            </StyledText>
            <StyledText variant="title" style={styles.problem}>
              {problem}
            </StyledText>
            <TextInput
              style={styles.input}
              value={userAnswer}
              onChangeText={setUserAnswer}
              keyboardType="numeric"
              placeholder="Ваш ответ"
              placeholderTextColor="#ccc"
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
              autoFocus={true}
            />
            <View style={styles.buttonContainer}>
              <StyledButton
                variant="primary"
                label="Ответить"
                onPress={handleSubmit}
              />
              <StyledButton
                variant="skip"
                label="Пропустить"
                iconName="forward"
                onPress={handleSkip}
              />
            </View>
          </View>
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
              color="#6366f1"
              style={styles.modalIcon}
            />
            <StyledText variant="title">Игра окончена!</StyledText>
            <StyledText variant="regular" style={styles.score}>
              Ваш счёт: <StyledText variant="highlight">{score} очков</StyledText>
            </StyledText>
            <View style={styles.modalButtonContainer}>
              <StyledButton
                variant="modal"
                label="Играть снова"
                style={styles.modalButton}
                onPress={handleRestart}
              />
              <StyledButton
                variant="modal"
                label="На главную"
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
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  gameContent: {
    width: "100%",
    alignItems: "center",
  },
  timer: {
    marginBottom: 12,
  },
  problem: {
    marginBottom: 24,
  },
  score: {
    marginTop: 24,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#c8c8c8",
    borderRadius: 16,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    gap: 12,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalContentStart: {
    backgroundColor: "#6366f1",
    padding: 24,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
    gap: 10,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalButton: {
    paddingHorizontal: 15,
  },
  modalText: {
    color: "#fff",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
