declare module "expo-av" {
  import * as React from "react";

  export namespace Audio {
    class Sound {
      static createAsync(...args: any[]): Promise<any>;
      loadAsync(...args: any[]): Promise<void>;
      playAsync(...args: any[]): Promise<void>;
      pauseAsync(...args: any[]): Promise<void>;
      stopAsync(...args: any[]): Promise<void>;
      unloadAsync(...args: any[]): Promise<void>;
      setOnPlaybackStatusUpdate(cb: (status: any) => void): void;
    }
  }

  export type AVPlaybackStatus = any;

  // ResizeMode реально существует как объект в expo-av
  export const ResizeMode: {
    CONTAIN: "CONTAIN";
    COVER: "COVER";
    STRETCH: "STRETCH";
  };

  // корректный тип для Video, чтобы JSX не ругался
  export interface VideoProps extends Record<string, any> {
    source?: any;
    style?: any;
    resizeMode?: keyof typeof ResizeMode; // "CONTAIN" | "COVER" | "STRETCH"
  }

  export class Video extends React.Component<VideoProps> {
    playAsync(): Promise<void>;
    pauseAsync(): Promise<void>;
    stopAsync(): Promise<void>;
  }
}

declare module "expo-haptics";
declare module "expo-router";
declare module "@expo/vector-icons";
declare module "react-native-sound";
declare module "react-native-linear-gradient";
declare module "react-native-animated";
declare module "react-native-modal";
declare module "react-native-gesture-handler";
declare module "react-native-safe-area-context";
declare module "react-native-screens";
declare module "react-native-reanimated";
