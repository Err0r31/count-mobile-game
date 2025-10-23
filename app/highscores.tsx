import React, { useEffect, useState } from "react"; 
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import StyledText from "@/components/StyledText";           // единый стиль текста проекта
import StyledButton from "@/components/StyledButton";       // единый стиль кнопок проекта
import { useRouter } from "expo-router";                    // хук для переходов между экранами
import { loadHighscores, type Highscore } from "@/storage"; // чтение рекордов из AsyncStorage

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
    return () => { alive = false; };
  }, []);

  return (
    <View style={styles.container}>
      <StyledText variant="title" style={styles.title}>Таблица рекордов</StyledText>

    {/* Три состояния: загрузка / пусто / список */}
      {items === null ? (
        <ActivityIndicator />
      ) : items.length === 0 ? (
        <StyledText variant="regular">Пока нет результатов</StyledText>
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(it, idx) => `${it.date}-${it.score}-${idx}`}   // уникальный ключ для элемента списка
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <StyledText variant="regular" style={styles.place}>
                {index + 1}.
              </StyledText>
              <StyledText variant="regular" style={styles.score}>
                {item.score} очков
              </StyledText>
              <StyledText variant="regular" style={styles.date}>
                {new Date(item.date).toLocaleString()}
              </StyledText>
            </View>
          )}
        />
      )}

      {/* Кнопка назад */}
      <StyledButton label="Назад" iconName="arrow-left" onPress={() => router.back()} />
    </View>
  );
}

// Стили для данного экрана
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    gap: 12,
    alignItems: "center",
},
  title: {
    marginBottom: 30,
},
  list: { 
    alignSelf: "stretch",
},
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 12,
  },
  place: { 
    width: 28,
    textAlign: "right",
 },
  score: { 
    width: 110,
 },
  date: { 
    flex: 1,
 },
});
