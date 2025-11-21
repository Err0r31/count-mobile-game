import { theme } from "@/ui";
import { Stack, useRouter } from "expo-router";
import { StatusBar, Text, TouchableOpacity } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  

  const renderTitle = (text: string) => (
    <TouchableOpacity onPress={() => router.push("/")} activeOpacity={0.7}>
      <Text
        style={{
          fontWeight: "bold",
          color: theme.colors.textOnPrimary,
          fontSize: 18,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  const BackButton = () => (
    <TouchableOpacity
      onPress={() => (router.canGoBack() ? router.back() : router.push("/"))}
      activeOpacity={0.7}
      style={{ paddingHorizontal: 12, paddingVertical: 6 }}
    >
      <Text
        style={{
          color: theme.colors.textOnPrimary,
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {"< Назад"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },               
          headerTitleStyle: { fontWeight: "bold", color: theme.colors.textOnPrimary }, 
          headerBackVisible: false,                                    
        }}
      >
        <Stack.Screen
          name="index"
          options={{ 
            title: "Быстрый счет", 
            headerLeft: () =>  null,
            headerTitle: () => renderTitle("Быстрый счет")
          }}
        />
        <Stack.Screen
          name="game"
          options={{ 
            title: "Игра", 
            headerLeft: () => <BackButton />,
            headerTitle: () => renderTitle("Игра")
          }}
        />
        <Stack.Screen
          name="highscores"
          options={{ 
            title: "Рекорды", 
            headerLeft: () => <BackButton />,
            headerTitle: () => renderTitle("Рекорды")
          }}
        />
        <Stack.Screen
          name="rules"
          options={{ 
            title: "Правила", 
            headerLeft: () => <BackButton />,
            headerTitle: () => renderTitle("Правила")
          }}
        />
        <Stack.Screen
          name="settings"
          options={{ 
            title: "Настройки", 
            headerLeft: () => <BackButton />,
            headerTitle: () => renderTitle("Настройки")
          }}
        />
        <Stack.Screen
          name="media"
          options={{ 
            title: "Мультимедиа", 
            headerLeft: () => <BackButton />,
            headerTitle: () => renderTitle("Мультимедиа")
          }}
        />
        <Stack.Screen
          name="statistics"
          options={{ 
            title: "Статистика", 
            headerLeft: () => <BackButton />,
            headerTitle: () => renderTitle("Статистика")
          }}
        />
      </Stack>
    </>
  );
}
