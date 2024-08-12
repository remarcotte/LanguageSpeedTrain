// errors.tsx

import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedScreen } from "@/components/ThemedScreen";
import { ThemedFlatList } from "@/components/ThemedFlatList"; // Import ThemedFlatList

import { ErrorService } from "@/services/ErrorService";
import { type LoggedError, ErrorActionType } from "@/types/ErrorTypes";

export default function Errors() {
  // Get a singleton instance of the ErrorService
  const errorService = ErrorService.getInstance();

  // State to store the list of errors
  const [errors, setErrors] = useState<LoggedError[] | null>(null);

  // State to manage loading state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to retrieve errors from the ErrorService
    const getErrors = async () => {
      try {
        const e = await errorService.getErrors(); // Fetch errors from the service
        setErrors(e || null); // Update state with fetched errors or set to null if no errors
      } catch (error) {
        await errorService.logError(
          ErrorActionType.TOAST,
          55,
          "Failed to fetch errors.",
          error,
        );
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    getErrors(); // Invoke the function to fetch errors on component mount
  }, []);

  // Render item function for FlatList
  const renderErrorItem = ({ item }: { item: LoggedError }) => (
    <ThemedView style={styles.errorContainer}>
      <ThemedView style={styles.errorHeader}>
        <ThemedText type="smaller" style={styles.errorText}>
          {item.datetime} / {item.errorId}
        </ThemedText>
        <ThemedText type="smaller" style={styles.errorText}>
          {item.message}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedScreen title="Errors">
      {/* Information about the purpose of the screen */}
      <ThemedText type="normal" style={styles.note}>
        This screen is used for support if the application becomes unstable.
      </ThemedText>

      {loading ? (
        // Show loading indicator while fetching data
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errors && errors.length > 0 ? (
        // Render errors using ThemedFlatList
        <ThemedFlatList
          data={errors}
          renderItem={renderErrorItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.scrollContainer}
          // Optional: Configure the FlatList further if needed
        />
      ) : (
        // Show message if no errors are logged
        <ThemedText type="normal">No errors have been logged.</ThemedText>
      )}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    marginTop: 8,
  },
  errorContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  errorHeader: {
    flexDirection: "column",
  },
  note: {
    marginBottom: 20,
  },
  errorText: {
    marginLeft: 8,
  },
});
