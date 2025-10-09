import StyledButton from "@/components/StyledButton";
import StyledText from "@/components/StyledText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MainScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <FontAwesome5
        name="calculator"
        size={60}
        color="#333"
        style={styles.headerIcon}
      />
      <StyledText variant="title" style={styles.title}>Быстрый счет</StyledText>
      <View style={styles.buttonList}>
        <StyledButton
          variant="primary"
          label="Играть"
          iconName="play-circle"
          onPress={() => router.push("/game")}
          style={styles.navigationButton}
        />
        <StyledButton
          variant="primary"
          label="Правила"
          iconName="book"
          onPress={() => router.push("/rules")}
          style={styles.navigationButton}
        />
        <StyledButton
          variant="primary"
          label="Настройки"
          iconName="cog"
          onPress={() => router.push("/")}
          style={styles.navigationButton}
        />
      </View>
    </View>
  );
}

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
