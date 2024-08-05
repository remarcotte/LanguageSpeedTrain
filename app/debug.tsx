// debug.tsx

import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedScreen } from "@/components/ThemedScreen";

import { LoggingService } from "@/services/LoggingService";

// an uncommented free-for-all for looking directly at the data
export default function Debug() {
  const loggingService = LoggingService.getInstance();

  const [item1, setItem1] = useState<any>(null);
  const [item2, setItem2] = useState<any>(null);
  const [item3, setItem3] = useState<any>(null);
  const [item4, setItem4] = useState<any>(null);
  const [item5, setItem5] = useState<any>(null);
  const [item6, setItem6] = useState<any>(null);
  const [item7, setItem7] = useState<any>(null);
  const [item8, setItem8] = useState<any>(null);

  useEffect(() => {
    const doDebug = async () => {
      const d = (await loggingService.getDeckSummary("Hirigana")) as any;
      setItem6(d?.summary || null);
      setItem7(d?.games || null);
      setItem8(d?.details || null);
      const c = (await loggingService.getDebug()) as any;
      setItem1(c?.deck || null);
      setItem2(c?.deck_summary || null);
      setItem3(c?.deck_detail || null);
      setItem4(c?.game_summary || null);
      setItem5(c?.game_detail || null);
    };

    doDebug();
  }, []);

  return (
    <ThemedScreen title="Debug">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title}>Logging getDeckSummary</ThemedText>
        <ThemedText style={styles.label}>Summary</ThemedText>
        <ThemedText style={styles.normal}>{JSON.stringify(item6)}</ThemedText>
        <ThemedText style={styles.label}>Games</ThemedText>
        <ThemedText style={styles.normal}>{JSON.stringify(item7)}</ThemedText>
        <ThemedText style={styles.label}>Details</ThemedText>
        <ThemedText style={styles.normal}>{JSON.stringify(item8)}</ThemedText>

        <ThemedText style={styles.title}>Database Tests</ThemedText>
        <ThemedText style={styles.label}>Deck</ThemedText>
        <ThemedText style={styles.normal}>{JSON.stringify(item1)}</ThemedText>
        <ThemedText style={styles.label}>Deck_Summary</ThemedText>
        <ThemedText style={styles.normal}>{JSON.stringify(item2)}</ThemedText>
        <ThemedText style={styles.label}>Deck_Detail</ThemedText>
        <ThemedText style={styles.normal}>{JSON.stringify(item3)}</ThemedText>
        <ThemedText style={styles.label}>Game_Summary</ThemedText>
        <ThemedText style={styles.normal}>{JSON.stringify(item4)}</ThemedText>
        <ThemedText style={styles.label}>Game_Detail</ThemedText>
        <ThemedText style={styles.normal}>{JSON.stringify(item5)}</ThemedText>
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  normal: {
    fontSize: 16,
    marginBottom: 16,
  },
});
