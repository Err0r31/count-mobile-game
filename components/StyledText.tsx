import { StyleSheet, Text, TextProps } from "react-native";

// Пропсы: наследуем стандартные TextProps + свой вариант отображения
type StyledTextProps = TextProps & {
  variant?: "title" | "regular" | "highlight" | "button";
};

export default function StyledText({
  variant = "regular",
  style,
  ...props
}: StyledTextProps) {
  return (
    <Text
    // Базовый стиль + стиль по варианту + внешние стили из пропсов
      style={[
        styles.base,
        variant === "title" && styles.title,
        variant === "regular" && styles.regular,
        variant === "highlight" && styles.highlight,
        variant === "button" && styles.button,
        style,
      ]}
      {...props}
    />
  );
}

// Общий базовый стиль + пресеты для заголовков, обычного текста, акцента и текста на кнопках
const styles = StyleSheet.create({
  base: {
    color: "#000000",
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "bold",
  },
  regular: {
    fontSize: 16,
    lineHeight: 20,
  },
  highlight: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold",
    color: "#6366f1",
  },
  button: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
    color: "#fff",
  },
});
