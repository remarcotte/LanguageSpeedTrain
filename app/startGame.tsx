import React, { useEffect, useState, useRef } from 'react';
import {
  TextInput as RTextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';
import { router } from 'expo-router';
import { LoggingService } from '../services/LoggingService';
import { DeckService } from '../services/DeckService';
import { Deck } from '../types/DeckTypes';
import { TurnAnswer } from '../types/LoggingTypes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ErrorService } from '../services/ErrorService';
import { ErrorActionType } from '../types/ErrorTypes';

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function StartGame() {
  const errorService = ErrorService.getInstance();
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');

  const { deckName, category, duration } = useLocalSearchParams<{
    deckName: string;
    category: string;
    duration: string;
  }>();

  const [timeLeft, setTimeLeft] = useState(parseInt(duration));
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [totalShown, setTotalShown] = useState(0);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [turns, setTurns] = useState<TurnAnswer[]>([]);
  const [currentCategory, setCurrentCategory] = useState(category);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [randomizedTexts, setRandomizedTexts] = useState<string[]>([]);
  const [resultIcon, setResultIcon] = useState<{
    name: IoniconName;
    color: string;
  } | null>(null);
  const [showGameOver, setShowGameOver] = useState(false); // New state variable
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const loggingService = LoggingService.getInstance();
  const deckService = DeckService.getInstance();
  const textInputRef = useRef<RTextInput>(null);

  useEffect(() => {
    isMountedRef.current = true;

    const loadDeck = async () => {
      try {
        const fetchedDeck: Deck | null = await deckService.getDeck(deckName);
        if (fetchedDeck) {
          setDeck(fetchedDeck);
          const randomizedNames = randomizeNames(
            fetchedDeck.items.map((item) => item[0])
          );
          setRandomizedTexts(randomizedNames);
          // Set the initial category based on the first randomized text
          if (category === 'Random') {
            setCurrentCategory(
              fetchedDeck.categories[randomizeCategoryIndex(fetchedDeck)]
            );
          } else {
            setCurrentCategory(category);
          }
        }
      } catch (error) {
        await errorService.logError(
          ErrorActionType.TOAST,
          25,
          'Unable to get deck.',
          error
        );
      }
    };

    loadDeck();

    if (timeLeft > 0 && !isPaused) {
      timerIdRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      isMountedRef.current = false;
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      if (isMountedRef.current) {
        handleGameEnd();
      }
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    }
  }, [timeLeft]);

  useEffect(() => {
    if (isPaused) {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    } else {
      if (timeLeft > 0 && !timerIdRef.current) {
        timerIdRef.current = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      }
    }
  }, [isPaused]);

  const randomizeNames = (names: string[]): string[] => {
    const array = [...names];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const randomizeCategoryIndex = (deck: Deck) => {
    return Math.floor(Math.random() * deck.categories.length);
  };

  const handleBackPress = () => {
    setIsPaused(true);
    Alert.alert('Exit Game', 'Going back will cancel this game. Exit game?', [
      { text: 'Cancel', onPress: () => setIsPaused(false) },
      {
        text: 'Exit',
        onPress: () => router.navigate('/newGame'),
        style: 'destructive',
      },
    ]);
  };

  const handlePausePress = () => {
    setIsPaused(true);
  };

  const handleResumePress = () => {
    setIsPaused(false);
  };

  const handleSkipPress = () => {
    if (!deck) return;

    const currentText = randomizedTexts[currentIndex];
    const deckItem = deck.items.find((item) => item[0] === currentText);
    const answer = deckItem
      ? deckItem[deck.categories.indexOf(currentCategory) + 1]
      : '';

    setTotalShown(totalShown + 1);
    setTurns([
      ...turns,
      {
        text: currentText,
        category: currentCategory,
        response: '',
        isCorrect: false,
        type: 'skip',
        answer: answer,
      },
    ]);
    advanceToNextTurn();
  };

  const handleSubmitPress = () => {
    if (!deck) return;

    const currentText = randomizedTexts[currentIndex];
    const deckItem = deck.items.find((item) => item[0] === currentText);
    if (!deckItem) return;

    const isCorrect =
      userResponse === deckItem[deck.categories.indexOf(currentCategory) + 1];
    const answer = isCorrect
      ? undefined
      : deckItem[deck.categories.indexOf(currentCategory) + 1];

    setTotalShown(totalShown + 1);
    setNumberCorrect(numberCorrect + (isCorrect ? 1 : 0));
    setTurns([
      ...turns,
      {
        text: currentText,
        category: currentCategory,
        response: userResponse,
        isCorrect: isCorrect,
        type: 'save',
        answer: answer,
      },
    ]);
    setUserResponse('');
    setResultIcon({
      name: isCorrect ? 'checkmark-outline' : 'close-outline',
      color: isCorrect ? 'green' : 'red',
    });
    setTimeout(() => setResultIcon(null), 500);
    advanceToNextTurn();
  };

  const advanceToNextTurn = () => {
    if (!deck) return;

    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= randomizedTexts.length) {
        if (deck) {
          setRandomizedTexts(randomizeNames(deck.items.map((item) => item[0])));
        }
        return 0;
      }
      return nextIndex;
    });
    if (category === 'Random')
      setCurrentCategory(deck.categories[randomizeCategoryIndex(deck)]);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  const handleGameEnd = async () => {
    setShowGameOver(true); // Show "Game Over" message
    setTimeout(async () => {
      setShowGameOver(false); // Hide "Game Over" message
      const turnsForLogging = turns.map(({ answer, ...rest }) => rest);

      try {
        await loggingService.logGame({
          deckName: deckName,
          category,
          duration: parseInt(duration),
          turns: turnsForLogging,
        });
      } catch (error) {
        await errorService.logError(
          ErrorActionType.TOAST,
          26,
          'Error logging the game.',
          error
        );
      }

      router.navigate({
        pathname: './gameSummary',
        params: {
          deckName,
          category,
          duration,
          turnsStr: JSON.stringify(turns),
        },
      });
    }, 2000); // 2 seconds delay
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  };

  return (
    <ThemedScreen title="Start Game">
      {showGameOver && (
        <ThemedView
          style={[styles.overlay, { backgroundColor: inputBackgroundColor }]}
        >
          <ThemedText
            style={[
              styles.gameOverText,
              { backgroundColor: inputBackgroundColor },
            ]}
          >
            Game Over
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.header}>
        <ThemedPressable
          title="Exit Game"
          fontSize={20}
          onPress={handleBackPress}
        />
        <ThemedView style={styles.iconContainer}>
          {resultIcon && (
            <Ionicons
              size={24}
              name={resultIcon.name}
              style={[styles.resultIcon, { color: resultIcon.color }]}
            />
          )}
        </ThemedView>
        <ThemedText
          style={styles.stats}
        >{`${numberCorrect} / ${totalShown}`}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.timer}>{formatTime(timeLeft)}</ThemedText>
        <ThemedText style={styles.itemText}>
          {randomizedTexts[currentIndex]}
        </ThemedText>
        <ThemedText style={styles.categoryText}>{currentCategory}</ThemedText>
        <ThemedTextInput
          ref={textInputRef}
          style={styles.input}
          value={userResponse}
          onChangeText={setUserResponse}
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="off" // Disable autofill
          editable={true} // Keep the input editable
          selectTextOnFocus={false} // Disable text selection on focus
          contextMenuHidden={true}
          autoFocus={true}
          placeholder={`Enter ${currentCategory}...`}
          onSubmitEditing={handleSubmitPress}
        />
        <ThemedView style={styles.buttonContainer}>
          <ThemedPressable
            title="Skip"
            fontSize={20}
            onPress={handleSkipPress}
          />
          <ThemedPressable
            title="Submit"
            fontSize={20}
            onPress={handleSubmitPress}
            disabled={!userResponse}
          />
          <ThemedPressable
            title="Pause"
            fontSize={20}
            onPress={handlePausePress}
          />
        </ThemedView>
      </ThemedView>
      <Modal visible={isPaused} transparent={true}>
        <ThemedView
          style={[styles.modal, { backgroundColor: inputBackgroundColor }]}
        >
          <ThemedText
            style={[
              styles.pauseText,
              { backgroundColor: inputBackgroundColor },
            ]}
          >
            Game paused. Tap to continue.
          </ThemedText>
          <TouchableOpacity
            onPress={handleResumePress}
            style={styles.modalOverlay}
          />
        </ThemedView>
      </Modal>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align children within header
  },
  iconContainer: {
    position: 'relative', // Use relative positioning within header
    marginHorizontal: 10, // Adjust positioning
  },
  stats: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultIcon: {
    marginLeft: 10,
  },
  timer: {
    fontSize: 48,
    textAlign: 'center',
    marginVertical: 10, // Ensure sufficient space around timer
  },
  itemText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  pauseText: {
    fontSize: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});
