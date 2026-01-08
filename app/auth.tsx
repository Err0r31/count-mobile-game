import { authAPI } from "@/api";
import StyledButton from "@/components/StyledButton";
import StyledText from "@/components/StyledText";
import { theme } from "@/ui";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Заполните все поля");
      return;
    }

    if (!isLogin && !email.trim()) {
      Alert.alert("Ошибка", "Введите email");
      return;
    }

    try {
      setBusy(true);
      if (isLogin) {
        await authAPI.login({ username, password });
        Alert.alert("Успешно", "Вы авторизованы", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/");
            },
          },
        ]);
      } else {
        await authAPI.register({ username, email, password });
        Alert.alert("Успешно", "Регистрация завершена. Теперь войдите в систему.");
        setIsLogin(true);
        setEmail("");
      }
    } catch (error: any) {
      Alert.alert("Ошибка", error.message || "Произошла ошибка");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок с иконкой */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.headerSection}>
          <StyledText variant="title" style={styles.title}>
            {isLogin ? "Вход" : "Регистрация"}
          </StyledText>
          <StyledText variant="regular" style={styles.subtitle}>
            {isLogin
              ? "Войдите в свой аккаунт"
              : "Создайте новый аккаунт"}
          </StyledText>
        </Animated.View>

        {/* Форма в карточке */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(300)}
          style={styles.formCard}
        >
          <View style={styles.form}>
            <Animated.View
              entering={FadeInUp.duration(600).delay(400)}
              style={styles.inputGroup}
            >
              <View style={styles.inputLabelContainer}>
                <FontAwesome5
                  name="user"
                  size={16}
                  color={theme.colors.accent}
                  style={styles.inputIcon}
                />
                <StyledText variant="regular" style={styles.label}>
                  Имя пользователя
                </StyledText>
              </View>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Введите имя пользователя"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Animated.View>

            {!isLogin && (
              <Animated.View
                entering={FadeInUp.duration(600).delay(500)}
                style={styles.inputGroup}
              >
                <View style={styles.inputLabelContainer}>
                  <FontAwesome5
                    name="envelope"
                    size={16}
                    color={theme.colors.accent}
                    style={styles.inputIcon}
                  />
                  <StyledText variant="regular" style={styles.label}>
                    Email
                  </StyledText>
                </View>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Введите email"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </Animated.View>
            )}

            <Animated.View
              entering={FadeInUp.duration(600).delay(isLogin ? 500 : 600)}
              style={styles.inputGroup}
            >
              <View style={styles.inputLabelContainer}>
                <FontAwesome5
                  name="lock"
                  size={16}
                  color={theme.colors.accent}
                  style={styles.inputIcon}
                />
                <StyledText variant="regular" style={styles.label}>
                  Пароль
                </StyledText>
              </View>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Введите пароль"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
                autoCapitalize="none"
              />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.duration(600).delay(isLogin ? 600 : 700)}
            >
              <StyledButton
                label={isLogin ? "Войти" : "Зарегистрироваться"}
                iconName={isLogin ? "sign-in-alt" : "user-plus"}
                onPress={handleSubmit}
                disabled={busy}
                style={styles.submitButton}
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Переключение между входом и регистрацией */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(isLogin ? 700 : 800)}
          style={styles.switchContainer}
        >
          <View style={styles.switchContent}>
            <StyledText variant="regular" style={styles.switchText}>
              {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            </StyledText>
            <Pressable
              onPress={() => {
                setIsLogin(!isLogin);
                setEmail("");
              }}
              style={({ pressed }) => [
                styles.switchButton,
                pressed && styles.switchButtonPressed,
              ]}
            >
              <StyledText variant="regular" style={styles.switchButtonText}>
                {isLogin ? "Зарегистрироваться" : "Войти"}
              </StyledText>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  formCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  inputIcon: {
    marginRight: 2,
  },
  label: {
    color: theme.colors.textPrimary,
    fontWeight: "600" as const,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
    ...theme.shadows.small,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  switchContainer: {
    marginTop: theme.spacing.md,
  },
  switchContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  switchText: {
    color: theme.colors.textSecondary,
  },
  switchButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  switchButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  switchButtonText: {
    color: theme.colors.accent,
    fontWeight: "600" as const,
  },
});
