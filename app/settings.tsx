import StyledButton from "@/components/StyledButton"; // единый стиль кнопок проекта
import StyledText from "@/components/StyledText"; // единый стиль текста проекта
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  type Settings,
} from "@/storage"; // функции для работы с настройками
import { theme } from "@/ui"; // тема
import { useRouter } from "expo-router"; // хук для переходов между экранами
import React, { useEffect, useState } from "react"; // хуки состояния и жизненного цикла
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

/* Экран настроек игры */
export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(defaultSettings); // состояние настроек
  const [busy, setBusy] = useState(false); // флаг блокировки UI при сохранении

  // Загрузка настроек при монтировании компонента
  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await loadSettings();
      if (alive) setSettings(s);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Установка числового параметра из текстового инпута
  const setNum = (
    key: "durationSec" | "rangeMin" | "rangeMax",
    value: string
  ) => {
    const n = parseInt((value ?? "").replace(/\D+/g, ""), 10);
    setSettings((s) => ({ ...s, [key]: isNaN(n) ? s[key] : n }));
  };

  // Переключение операции
  const toggleOp = (key: keyof Settings["ops"], next?: boolean) => {
    setSettings((s) => {
      const current = s.ops[key];
      const val = typeof next === "boolean" ? next : !current;
      return { ...s, ops: { ...s.ops, [key]: val } };
    });
  };

  // Переключение звука
  const toggleSound = (value: boolean) => {
    setSettings((s) => ({ ...s, soundEnabled: value }));
  };

  // Сохранение настроек
  const onSave = async () => {
    try {
      setBusy(true);
      if (settings.rangeMin > settings.rangeMax) {
        Alert.alert("Ошибка", "Минимум не может быть больше максимума");
        return;
      }
      await saveSettings(settings);
      Alert.alert("Сохранено", "Настройки применены");
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(600)}>
        <StyledText variant="title" style={styles.title}>
          Настройки игры
        </StyledText>
      </Animated.View>

      {/* Длительность раунда*/}
      <Animated.View
        entering={FadeInUp.duration(600).delay(100)}
        style={styles.group}
      >
        <StyledText variant="regular" style={styles.label}>
          Длительность (сек)
        </StyledText>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={String(settings.durationSec)}
          onChangeText={(t) => setNum("durationSec", t)}
        />
      </Animated.View>

      {/* Диапазон ОТ */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(200)}
        style={styles.group}
      >
        <StyledText variant="regular" style={styles.label}>
          Диапазон: от
        </StyledText>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={String(settings.rangeMin)}
          onChangeText={(t) => setNum("rangeMin", t)}
        />
      </Animated.View>

      {/* Диапазон ДО */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(300)}
        style={styles.group}
      >
        <StyledText variant="regular" style={styles.label}>
          Диапазон: до
        </StyledText>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={String(settings.rangeMax)}
          onChangeText={(t) => setNum("rangeMax", t)}
        />
      </Animated.View>

      {/* Выбор математических операций */}
      <Animated.View entering={FadeInUp.duration(600).delay(400)}>
        <StyledText
          variant="regular"
          style={[styles.label, { marginTop: theme.spacing.md }]}
        >
          Операции
        </StyledText>
        <View style={styles.opsGrid}>
          <OpCard
            icon="+"
            label="Сложение"
            value={settings.ops.add}
            onToggle={(v) => toggleOp("add", v)}
          />
          <OpCard
            icon="−"
            label="Вычитание"
            value={settings.ops.sub}
            onToggle={(v) => toggleOp("sub", v)}
          />
          <OpCard
            icon="×"
            label="Умножение"
            value={settings.ops.mul}
            onToggle={(v) => toggleOp("mul", v)}
          />
          <OpCard
            icon="÷"
            label="Деление"
            value={settings.ops.div}
            onToggle={(v) => toggleOp("div", v)}
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(600).delay(500)}
        style={styles.group}
      >
        <StyledText variant="regular" style={styles.label}>
          Музыка
        </StyledText>
        <Switch
          style={styles.switch}
          value={settings.soundEnabled}
          onValueChange={toggleSound}
          thumbColor={theme.colors.primary}
          trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(600)}>
        <StyledButton label="Сохранить" onPress={onSave} disabled={busy} />
      </Animated.View>
    </ScrollView>
  );
}

// Карточка одной операции
function OpCard({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: string;
  label: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onToggle(!value)}
      style={({ pressed }) => [
        styles.opCard,
        value && styles.opCardActive,
        pressed && styles.opCardPressed,
      ]}
    >
      <View style={styles.opIconWrap}>
        <Text style={styles.opIcon}>{icon}</Text>
      </View>

      <Text style={styles.opLabel}>{label}</Text>

      <Switch
        style={styles.opSwitch}
        value={value}
        onValueChange={onToggle}
        thumbColor={theme.colors.primary}
        trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
      />
    </Pressable>
  );
}

// Стили с современной темой
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    minHeight: "100%",
  },
  title: {
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  group: {
    width: "100%",
    alignSelf: "stretch",
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontWeight: "600" as const,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    textAlign: "center",
    backgroundColor: theme.colors.backgroundLight,
    color: theme.colors.textPrimary,
    ...theme.shadows.medium,
  },
  opsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  opCard: {
    position: "relative",
    width: "48%",
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  opCardActive: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.backgroundLight,
  },
  opCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  opIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundLight,
  },
  opIcon: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: theme.colors.textPrimary,
  },
  opLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginRight: 50,
    color: theme.colors.textPrimary,
  },
  opSwitch: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  switch: {
    alignSelf: "flex-start",
  },
});
