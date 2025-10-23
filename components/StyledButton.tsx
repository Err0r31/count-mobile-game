import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // иконки из библиотеки FontAwesome
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import StyledText from "./StyledText";                      // единый стиль текста проекта  

// Пропсы кнопки: наследуем стандартные TouchableOpacityProps + свои поля
type StyledButtonProps = TouchableOpacityProps & {
  label?: string;                                           // текст кнопки
  iconName?: string;                                        // имя иконки из FontAwesome
  iconSize?: number;                                        // размер иконки
  variant?: "primary" | "skip" | "modal";                   // визуальный вариант кнопки
};

export default function StyledButton({
  label,
  iconName,
  iconSize,
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
          color="#fff"
          style={styles.icon}
        />
      )}
      {/* Текст кнопки */}
      {label && <StyledText variant="button">{label}</StyledText>}
    </TouchableOpacity>
  );
}

// Стили: базовый вид + состояния/варианты; тени (iOS), выравнивание контента
const styles = StyleSheet.create({
  base: {
    backgroundColor: "#6366f1",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6366f1",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  primary: {
    backgroundColor: "#6366f1",
  },
  skip: {
    backgroundColor: "#ff6600ff",
    borderColor: "#ff6600ff",
  },
  modal: {
    backgroundColor: "#6366f1",
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    marginRight: 8,
  },
});
