// useGameLogic.ts

import { useState, useEffect, useRef, useCallback } from "react";
import { Alert, Keyboard } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { LoggingService } from "@/services/LoggingService";
import { DeckService } from "@/services/DeckService";
import { ErrorService } from "@/services/ErrorService";
import { TurnAnswer } from "@/types/LoggingTypes";
import { Deck } from "@/types/DeckTypes";
import { ErrorActionType } from "@/types/ErrorTypes";

export type GameLogic = {
  timeLeft: number;
  isPaused: boolean;
  userResponse: string;
  currentText: string;
  currentCategory: string;
  numberCorrect: number;
  totalShown: number;
  resultIcon: { name: keyof typeof Ionicons.glyphMap; color: string } | null;
  handleBackPress: () => void;
  handlePausePress: () => void;
  handleResumePress: () => void;
  handleSkipPress: () => void;
  handleSubmitPress: () => void;
  setUserResponse: React.Dispatch<React.SetStateAction<string>>;
  showGameOver: boolean;
};

export const useGameLogic = (): GameLogic => {
  const errorService = ErrorService.getInstance();
  const loggingService = LoggingService.getInstance();
  const deckService = DeckService.getInstance();

  const { deckName, category, duration } = useLocalSearchParams<{
    deckName: string;
    category: string;
    duration: string;
  }>();

  const [timeLeft, setTimeLeft] = useState(parseInt(duration));
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [totalShown, setTotalShown] = useState(0);
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [turns, setTurns] = useState<TurnAnswer[]>([]);
  const [currentCategory, setCurrentCategory] = useState(category);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [randomizedTexts, setRandomizedTexts] = useState<string[]>([]);
  const [resultIcon, setResultIcon] = useState<{
    name: keyof typeof Ionicons.glyphMap;
    color: string;
  } | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const loadDeck = async () => {
      try {
        const fetchedDeck: Deck | null = await deckService.getDeck(deckName);
        if (fetchedDeck) {
          setDeck(fetchedDeck);
          const randomizedNames = randomizeNames(
            fetchedDeck.items.map((item) => item[0]),
          );
          setRandomizedTexts(randomizedNames);

          if (category === "Random") {
            setCurrentCategory(
              fetchedDeck.categories[randomizeCategoryIndex(fetchedDeck)],
            );
          } else {
            setCurrentCategory(category);
          }
        }
      } catch (error) {
        await errorService.logError(
          ErrorActionType.TOAST,
          25,
          "Unable to get deck.",
          error,
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

  // Randomize the order of names in the array using Fisher-Yates shuffle algorithm
  const randomizeNames = (names: string[]): string[] => {
    const array = [...names];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Get a random index for selecting a category
  const randomizeCategoryIndex = (deck: Deck) => {
    return Math.floor(Math.random() * deck.categories.length);
  };

  // Handle the back button press and confirm exit
  const handleBackPress = useCallback(() => {
    setIsPaused(true);
    Alert.alert("Exit Game", "Going back will cancel this game. Exit game?", [
      { text: "Cancel", onPress: () => setIsPaused(false) },
      {
        text: "Exit",
        onPress: () => router.navigate("/newGame"),
        style: "destructive",
      },
    ]);
  }, []);

  // Pause the game
  const handlePausePress = useCallback(() => {
    Keyboard.dismiss();
    setIsPaused(true);
  }, []);

  // Resume the game
  const handleResumePress = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Skip the current turn and advance
  const handleSkipPress = useCallback(() => {
    if (!deck) return;

    const currentText = randomizedTexts[currentIndex];
    const deckItem = deck.items.find((item) => item[0] === currentText);
    const answer = deckItem
      ? deckItem[deck.categories.indexOf(currentCategory) + 1]
      : "";

    setTotalShown(totalShown + 1);
    setTurns((prevTurns) => [
      ...prevTurns,
      {
        text: currentText,
        category: currentCategory,
        response: "",
        isCorrect: false,
        type: "skip",
        answer: answer,
      },
    ]);
    advanceToNextTurn();
  }, [currentIndex, deck, currentCategory, randomizedTexts]);

  // Submit the user's response and evaluate correctness
  const handleSubmitPress = useCallback(() => {
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
    setTurns((prevTurns) => [
      ...prevTurns,
      {
        text: currentText,
        category: currentCategory,
        response: userResponse,
        isCorrect: isCorrect,
        type: "save",
        answer: answer,
      },
    ]);
    setUserResponse("");
    setResultIcon({
      name: isCorrect ? "checkmark-outline" : "close-outline",
      color: isCorrect ? "green" : "red",
    });
    setTimeout(() => setResultIcon(null), 500);
    advanceToNextTurn();
  }, [currentIndex, deck, currentCategory, userResponse, randomizedTexts]);

  // Advance to the next turn and reset or randomize as needed
  const advanceToNextTurn = useCallback(() => {
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
    if (category === "Random")
      setCurrentCategory(deck.categories[randomizeCategoryIndex(deck)]);
  }, [deck, category, randomizedTexts]);

  // Handle the end of the game and navigate to summary
  const handleGameEnd = useCallback(async () => {
    Keyboard.dismiss();
    setShowGameOver(true); // Show "Game Over" message
    setTimeout(async () => {
      if (!isMountedRef.current) return; // Prevent updates if unmounted
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
          "Error logging the game.",
          error,
        );
      }

      router.navigate({
        pathname: "./gameSummary",
        params: {
          deckName,
          category,
          duration,
          turnsStr: JSON.stringify(turns),
        },
      });
    }, 2000); // 2 seconds delay
  }, [turns, deckName, category, duration]);

  return {
    timeLeft,
    isPaused,
    userResponse,
    currentText: randomizedTexts[currentIndex] || "",
    currentCategory,
    numberCorrect,
    totalShown,
    resultIcon,
    handleBackPress,
    handlePausePress,
    handleResumePress,
    handleSkipPress,
    handleSubmitPress,
    setUserResponse,
    showGameOver,
  };
};
