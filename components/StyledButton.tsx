import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // иконки из библиотеки FontAwesome
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { theme } from "../ui";
import StyledText from "./StyledText"; // единый стиль текста проекта  
// Пропсы кнопки: наследуем стандартные TouchableOpacityProps + свои поля
type StyledButtonProps = TouchableOpacityProps & {
  label?: string;                                           // текст кнопки
  iconName?: string;                                        // имя иконки из FontAwesome
  iconSize?: number;                                        // размер иконки
  variant?: "primary" | "skip" | "modal" | "secondary";   // визуальный вариант кнопки
};

export default function StyledButton({
  label,
  iconName,
  iconSize = 18,
  variant = "primary",
  disabled,
  style,
  ...props
}: StyledButtonProps) {
  return (
    <TouchableOpacity
    // Базовый стиль + модификаторы по состоянию/варианту + внешние стили
      style={[
        styles.base,
        disabled && styles.disabled,
        variant === "primary" && styles.primary,
        variant === "skip" && styles.skip,
        variant === "modal" && styles.modal,
        variant === "secondary" && styles.secondary,
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      {/* Иконка слева, если задано имя */}
      {iconName && (
        <FontAwesome5
          name={iconName}
          size={iconSize}
          color={theme.colors.textOnPrimary}
          style={styles.icon}
        />
      )}
      {/* Текст кнопки */}
      {label && <StyledText variant="button">{label}</StyledText>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.medium,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.backgroundDark,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  skip: {
    backgroundColor: theme.colors.warning,
  },
  modal: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  secondary: {
    backgroundColor: theme.colors.accent,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
});
