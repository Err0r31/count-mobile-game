import { StyleSheet, Text, TextProps } from "react-native";

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

const styles = StyleSheet.create({
  base: {
    color: "#333",
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
    color: "#636b2f",
  },
  button: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
    color: "#fff",
  },
});
