import { Ionicons } from '@expo/vector-icons';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import StyledButton from '@/components/StyledButton';
import StyledText from '@/components/StyledText';

export default function MediaScreen() {
  const router = useRouter();
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
  const [isPlaying, setIsPlaying] = useState(false);
  

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;
  

  const videoHeight = isDesktop ? Math.min(400, screenHeight * 0.4) : 
                     isTablet ? Math.min(300, screenHeight * 0.35) : 250;

  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  };

  const handlePlayPause = async () => {
    if (video.current) {
      if (isPlaying) {
        await video.current.pauseAsync();
      } else {
        await video.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoError = () => {
    Alert.alert(
      'Ошибка видео',
      'Не удалось загрузить видео. Проверьте подключение к интернету.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <StyledText style={styles.title}>Видеоплеер</StyledText>
      </TouchableOpacity>
      
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={[styles.video, { height: videoHeight }]}
          source={videoSource}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
          onError={handleVideoError}
        />
        
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={handlePlayPause}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={50} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <StyledText style={styles.statusText}>
          {isPlaying ? 'Воспроизведение' : 'Пауза'}
        </StyledText>
        
        {status.isLoaded && status.durationMillis && status.positionMillis && (
          <StyledText style={styles.progressText}>
            {Math.floor(status.positionMillis / 1000)}s / {Math.floor(status.durationMillis / 1000)}s
          </StyledText>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          label="Воспроизвести"
          onPress={handlePlayPause}
          style={[styles.button, isPlaying && styles.buttonDisabled]}
          disabled={isPlaying}
        />
        
        <StyledButton
          label="Пауза"
          onPress={handlePlayPause}
          style={[styles.button, !isPlaying && styles.buttonDisabled]}
          disabled={!isPlaying}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 0,
    paddingVertical: 20,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    paddingHorizontal: 20,
    maxWidth: 600,
    alignSelf: 'center',
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: '#000',
    width: '100%',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'stretch',
  },
  video: {
    width: '100%',
    minHeight: 200,
    alignSelf: 'stretch',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    maxWidth: 600,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
    paddingHorizontal: 20,
    maxWidth: 600,
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    maxWidth: 150,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});