import StyledButton from "@/components/StyledButton";       // единый стиль кнопок проекта
import StyledText from "@/components/StyledText";           // единый стиль текста проекта
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // иконки из библиотеки FontAwesome
import { useRouter } from "expo-router";                    // хук для переходов между экранами
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MainScreen() {
  const router = useRouter(); // переходы между экранами

  return (
    <View style={styles.container}>
      <FontAwesome5
        name="calculator"
        size={60}
        color="#333"
        style={styles.headerIcon}
      />
      <StyledText variant="title" style={styles.title}>Быстрый счет</StyledText>

      {/* Список действий на главной */}
      <View style={styles.buttonList}>
        <StyledButton
          variant="primary"
          label="Играть"
          iconName="play-circle"
          onPress={() => router.push("/game")}        // переход на экран игры
          style={styles.navigationButton}
        />
        <StyledButton
          variant="primary"
          label="Рекорды"
          iconName="trophy"
          onPress={() => router.push("/highscores")}  // переход на экран рекрдов
          style={styles.navigationButton}
        />
        <StyledButton
          variant="primary"
          label="Правила"
          iconName="book"
          onPress={() => router.push("/rules")}       // переход на экран правил
          style={styles.navigationButton}
        />
        <StyledButton
          variant="primary"
          label="Настройки"
          iconName="cog"
          onPress={() => router.push("/settings")}    // переход на экран настроек
          style={styles.navigationButton}
        />
      </View>
    </View>
  );
}

// Стили для данного экрана
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  headerIcon: {
    marginBottom: 10,
  },
  title: {
    marginBottom: 40,
  },
  buttonList: {
    width: "100%",
    alignItems: "center",
    gap: 15,
  },
  navigationButton: {
    width: "80%",
  },
});
