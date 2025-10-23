import { StyleSheet, Text, TextProps } from "react-native";
import { theme } from "../ui";

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
    color: theme.colors.textPrimary,
    fontFamily: "System",
  },
  title: {
    ...theme.typography.h1,
  },
  regular: {
    ...theme.typography.bodyLarge,
  },
  highlight: {
    ...theme.typography.bodyLarge,
    fontWeight: "bold" as const,
    color: theme.colors.accent,
  },
  button: {
    ...theme.typography.button,
  },
});
