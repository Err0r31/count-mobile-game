import StyledButton from "@/components/StyledButton";       // единый стиль кнопок проекта
import StyledText from "@/components/StyledText";           // единый стиль текста проекта
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // иконки из библиотеки FontAwesome
import { useRouter } from "expo-router";                    // хук для переходов между экранами 
import { StyleSheet, View } from "react-native";

export default function RuleScreen() {
  const router = useRouter(); // переходы между экранами

  return (
    <View style={styles.container}>
      {/* Заголовок экрана */}
      <StyledText variant="title" style={styles.title}>Правила игры</StyledText>

      {/* Список правил: иконка + текст */}
      <View style={styles.rulesList}>
        <View style={styles.ruleItem}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="bullseye" size={24} color="#333" />
          </View>
          <StyledText variant="regular">
            Решайте как можно больше математических примеров за 60 секунд!
          </StyledText>
        </View>

        <View style={styles.ruleItem}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="check-circle" size={24} color="#333" />
          </View>
          <StyledText variant="regular">
            Правильный ответ: <StyledText variant="highlight">+10 очков</StyledText>.
          </StyledText>
        </View>

        <View style={styles.ruleItem}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="times-circle" size={24} color="#333" />
          </View>
          <StyledText variant="regular">
            Ошибка: <StyledText variant="highlight">-5 очков</StyledText>.
          </StyledText>
        </View>

        <View style={styles.ruleItem}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="bolt" size={24} color="#333" />
          </View>
          <StyledText variant="regular">
            Быстрый ответ (менее 5 секунд): <StyledText variant="highlight">+2 очка</StyledText>.
          </StyledText>
        </View>

        <View style={styles.ruleItem}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="clock" size={24} color="#333" />
          </View>
          <StyledText variant="regular">
            Время: <StyledText variant="highlight">60 секунд</StyledText>. После окончания вы увидите свой счёт.
          </StyledText>
        </View>

        <View style={styles.ruleItem}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="forward" size={24} color="#333" />
          </View>
          <StyledText variant="regular">
            Пропуск примера: <StyledText variant="highlight">-2 очка</StyledText>.
          </StyledText>
        </View>
      </View>

      {/* Кнопка внизу — вернуть пользователя на предыдущий экран */}
      <StyledButton
        variant="primary"
        label="Назад"
        iconName="arrow-left"
        onPress={() => router.back()}
      />
    </View>
  );
}
// Стили для данного экрана
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    marginBottom: 30,
  },
  rulesList: {
    width: "100%",
    marginBottom: 30,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 35,
    alignItems: "center",
  },
});
