// debug.tsx

import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedScreen } from "@/components/ThemedScreen";

import { LoggingService } from "@/services/LoggingService";
import { ErrorService } from "@/services/ErrorService";

// an uncommented free-for-all for looking directly at the data
export default function Debug() {
  const loggingService = LoggingService.getInstance();
  const errorService = ErrorService.getInstance();

  const [item0, setItem0] = useState<any>(null);
  const [item1, setItem1] = useState<any>(null);
  const [item2, setItem2] = useState<any>(null);
  const [item3, setItem3] = useState<any>(null);
  const [item4, setItem4] = useState<any>(null);
  const [item5, setItem5] = useState<any>(null);
  const [item6, setItem6] = useState<any>(null);
  const [item7, setItem7] = useState<any>(null);
  const [item8, setItem8] = useState<any>(null);
  const [item9, setItem9] = useState<any>(null);

  useEffect(() => {
    const doDebug = async () => {
      const e = (await errorService.getErrors()) as any;
      setItem0(e || null);
      const d = (await loggingService.getDeckSummary("Hirigana")) as any;
      setItem6(d?.summary || null);
      setItem7(d?.games || null);
      setItem8(d?.details || null);
      const c = (await loggingService.getDebug()) as any;
      setItem9(c?.counts || null);
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
        <ThemedText type="head1">Counts</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item9)}</ThemedText>
        <ThemedText type="head1">Errors</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item0)}</ThemedText>
        <ThemedText type="head1">Logging getDeckSummary</ThemedText>
        <ThemedText type="head2">Summary</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item6)}</ThemedText>
        <ThemedText type="head2">Games</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item7)}</ThemedText>
        <ThemedText type="head2">Details</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item8)}</ThemedText>

        <ThemedText type="head1">Database Tests</ThemedText>
        <ThemedText type="head2">Deck</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item1)}</ThemedText>
        <ThemedText type="head2">Deck_Summary</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item2)}</ThemedText>
        <ThemedText type="head2">Deck_Detail</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item3)}</ThemedText>
        <ThemedText type="head2">Game_Summary</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item4)}</ThemedText>
        <ThemedText type="head2">Game_Detail</ThemedText>
        <ThemedText type="normal">{JSON.stringify(item5)}</ThemedText>
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
});
