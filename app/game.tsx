import StyledButton from "@/components/StyledButton";
import StyledText from "@/components/StyledText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function GameScreen() {
  const router = useRouter();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState(0);
  const [isStartModalVisible, setIsStartModalVisible] = useState(true);

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const operators = ["+", "-", "*", "/"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let answer;
    if (operator === "/") {
      const quotient = Math.floor(Math.random() * 10) + 1;
      const newNum1 = num2 * quotient;
      setProblem(`${newNum1} / ${num2}`);
      answer = quotient;
    } else if (operator === "-") {
      const maxNum = Math.max(num1, num2);
      const minNum = Math.min(num1, num2);
      setProblem(`${maxNum} - ${minNum}`);
      answer = maxNum - minNum;
    } else {
      setProblem(`${num1} ${operator} ${num2}`);
      answer = eval(`${num1} ${operator} ${num2}`);
    }

    setCorrectAnswer(answer);
    setAnswerStartTime(Date.now());
    return answer;
  };

  useEffect(() => {
    if (countdown > 0 && isStartModalVisible) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isGameStarted) {
      setIsStartModalVisible(false);
      setIsGameStarted(true);
      generateProblem();
    }
  }, [countdown, isGameStarted, isStartModalVisible]);

  useEffect(() => {
    if (isGameStarted && timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameStarted, isGameOver]);

  const handleSubmit = () => {
    const answerTime = (Date.now() - answerStartTime) / 1000;
    const isCorrect = parseFloat(userAnswer) === correctAnswer;

    if (isCorrect) {
      setScore(score + 10);
      if (answerTime < 5) setScore(score + 12);
    } else {
      setScore(score - 5);
    }

    setUserAnswer("");
    generateProblem();
  };

  const handleSkip = () => {
    setScore(score - 2);
    setUserAnswer("");
    generateProblem();
  };

  const handleRestart = () => {
    setIsGameOver(false);
    setIsGameStarted(false);
    setCountdown(3);
    setTimeLeft(60);
    setScore(0);
    setUserAnswer("");
    setProblem("");
    setCorrectAnswer(0);
    setAnswerStartTime(0);
    setIsStartModalVisible(true);
  };

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

        {/* Модалка с итоговой статистикой */}
        <Modal isVisible={isGameOver}>
        <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={styles.modalContent}
          >
            <FontAwesome5
              name="trophy"
              size={48}
              color="#636b2f"
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
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    backgroundColor: "#636b2f",
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
