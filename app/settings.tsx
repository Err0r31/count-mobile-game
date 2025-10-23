import StyledButton from "@/components/StyledButton"; // единый стиль кнопок проекта
import StyledText from "@/components/StyledText"; // единый стиль текста проекта
import {
    defaultSettings,
    loadSettings,
    saveSettings,
    type Settings,
} from "@/storage"; // функции для работы с настройками
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
    <ScrollView contentContainerStyle={styles.container}>
      <StyledText variant="title" style={styles.title}>
        Настройки игры
      </StyledText>

      {/* Длительность раунда*/}
      <View style={styles.group}>
        <Text style={styles.label}>Длительность (сек)</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={String(settings.durationSec)}
          onChangeText={(t) => setNum("durationSec", t)}
        />
      </View>

      {/* Диапазон ОТ */}
      <View style={styles.group}>
        <Text style={styles.label}>Диапазон: от</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={String(settings.rangeMin)}
          onChangeText={(t) => setNum("rangeMin", t)}
        />
      </View>

      {/* Диапазон ДО */}
      <View style={styles.group}>
        <Text style={styles.label}>Диапазон: до</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={String(settings.rangeMax)}
          onChangeText={(t) => setNum("rangeMax", t)}
        />
      </View>

      {/* Выбор математических операций */}
      <Text style={[styles.label, { marginTop: 8 }]}>Операции</Text>
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
      <View style={styles.group}>
        <Text style={styles.label}>Музыка</Text>
        <Switch
          style={styles.switch}
          value={settings.soundEnabled}
          onValueChange={toggleSound}
          thumbColor={undefined}
        />
      </View>
      <StyledButton label="Сохранить" onPress={onSave} disabled={busy} />
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
        thumbColor={undefined}
      />
    </Pressable>
  );
}

// Cтили для данного экрана
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
  },
  group: {
    width: "100%",
    alignSelf: "stretch",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  smallLabel: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#c8c8c8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  // Операции
  opsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  opCard: {
    position: "relative",
    flexBasis: "48%",
    borderWidth: 1,
    borderColor: "#c8c8c8",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    paddingTop: 18,
    marginBottom: 12,
    // Тень iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  opCardActive: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  opCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  opIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#919191ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  opIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
  opLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: 44,
  },
  opSwitch: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  switch: {
    alignSelf: "flex-start",
  },
});
