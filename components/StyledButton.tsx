import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";
import StyledText from "./StyledText";

type StyledButtonProps = TouchableOpacityProps & {
  label?: string;
  iconName?: string;
  iconSize?: number;
  variant?: "primary" | "skip" | "modal";
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
      {iconName && (
        <FontAwesome5
          name={iconName}
          size={iconSize}
          color="#fff"
          style={styles.icon}
        />
      )}
      {label && <StyledText variant="button">{label}</StyledText>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#636b2f",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#636b2f",
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
    backgroundColor: "#636b2f",
  },
  skip: {
    backgroundColor: "#d35400",
    borderColor: "#d35400",
  },
  modal: {
    backgroundColor: "#636b2f",
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    marginRight: 8,
  },
});
