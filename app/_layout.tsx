import { Stack, useRouter } from "expo-router";
import { StatusBar, Text, TouchableOpacity } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#6366f1" },               
          headerTitleStyle: { fontWeight: "bold", color: "#ffffff" }, 
          headerBackVisible: false,                                    
        }}
      >
        <Stack.Screen
          name="index"
          options={{ 
            title: "Быстрый счет", 
            headerLeft: () => null,
            headerTitle: () => (
              <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
                <Text style={{ fontWeight: "bold", color: "#ffffff", fontSize: 18 }}>
                  Быстрый счет
                </Text>
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen
          name="game"
          options={{ 
            title: "Игра", 
            headerLeft: () => null,
            headerTitle: () => (
              <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
                <Text style={{ fontWeight: "bold", color: "#ffffff", fontSize: 18 }}>
                  Игра
                </Text>
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen
          name="highscores"
          options={{ 
            title: "Рекорды", 
            headerLeft: () => null,
            headerTitle: () => (
              <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
                <Text style={{ fontWeight: "bold", color: "#ffffff", fontSize: 18 }}>
                  Рекорды
                </Text>
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen
          name="rules"
          options={{ 
            title: "Правила", 
            headerLeft: () => null,
            headerTitle: () => (
              <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
                <Text style={{ fontWeight: "bold", color: "#ffffff", fontSize: 18 }}>
                  Правила
                </Text>
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen
          name="settings"
          options={{ 
            title: "Настройки", 
            headerLeft: () => null,
            headerTitle: () => (
              <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
                <Text style={{ fontWeight: "bold", color: "#ffffff", fontSize: 18 }}>
                  Настройки
                </Text>
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen
          name="media"
          options={{ 
            title: "Мультимедиа", 
            headerLeft: () => null,
            headerTitle: () => (
              <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
                <Text style={{ fontWeight: "bold", color: "#ffffff", fontSize: 18 }}>
                  Мультимедиа
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </Stack>
    </>
  );
}
