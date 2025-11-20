// === Моки для React Native окружения ===
jest.mock("react-native", () => {
  const RN = {
    Platform: { OS: "ios", select: (o) => o.ios ?? o.default },
    StyleSheet: {create: (s) => s, flatten: (s) => s,},
    View: "View",
    Text: "Text",
    TextInput: "TextInput",
    TouchableOpacity: "TouchableOpacity",
    KeyboardAvoidingView: "KeyboardAvoidingView",
    ScrollView: "ScrollView",
    Vibration: { vibrate: jest.fn() },
  };
  return RN;
});

// === Моки Expo API ===
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

// jest.mock("expo-av", () => ({
//   Audio: {
//     Sound: {
//       createAsync: jest.fn().mockResolvedValue({
//         sound: {
//           playAsync: jest.fn(),
//           pauseAsync: jest.fn(),
//           unloadAsync: jest.fn(),
//           setOnPlaybackStatusUpdate: jest.fn(),
//         },
//       }),
//     },
//   },
// }));

// === Мок expo-av ===
jest.mock("expo-av", () => ({
  Audio: {
    Sound: jest.fn().mockImplementation(() => ({
      loadAsync: jest.fn(),
      playAsync: jest.fn(),
      pauseAsync: jest.fn(),
      unloadAsync: jest.fn(),
      setOnPlaybackStatusUpdate: jest.fn(),
    })),
  },
}));

jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
}));

jest.mock("react-native-modal", () => "Modal");

jest.mock("react-native-reanimated", () => {
  const NOOP = () => {};
  return {
    // компоненты
    View: "View",
    ScrollView: "ScrollView",
    // базовые хуки
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useDerivedValue: jest.fn((fn) => fn?.()),
    // анимации
    withTiming: jest.fn((v) => v),
    withSpring: jest.fn((v) => v),
    withDelay: jest.fn((_, v) => v),
    withRepeat: jest.fn((v) => v),
    interpolate: jest.fn(() => 0),
    Extrapolate: { CLAMP: "clamp", EXTEND: "extend" },
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn()),
    cancelAnimation: NOOP,
    Easing: {
      linear: NOOP,
      ease: NOOP,
      quad: NOOP,
      cubic: NOOP,
      bounce: NOOP,
      bezier: NOOP,
      in: NOOP,
      out: NOOP,
      inOut: NOOP,
    },
  };
});

jest.mock("@expo/vector-icons/FontAwesome5", () => "FontAwesome5");

global.__DEV__ = true;

