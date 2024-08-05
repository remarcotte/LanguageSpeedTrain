import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';

import { ErrorService } from '../services/ErrorService';
import { type ErrorLog, ErrorActionType } from '../types/ErrorTypes';

export default function Errors() {
  // Get a singleton instance of the ErrorService
  const errorService = ErrorService.getInstance();

  // State to store the list of errors
  const [errors, setErrors] = useState<ErrorLog[] | null>(null);

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
          'Failed to fetch errors.',
          error
        );
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    getErrors(); // Invoke the function to fetch errors on component mount
  }, []);

  return (
    <ThemedScreen title="Errors">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Information about the purpose of the screen */}
        <ThemedText style={styles.errorNote}>
          This screen is used for support if the application becomes unstable.
        </ThemedText>

        {loading ? (
          // Show loading indicator while fetching data
          <ActivityIndicator size="large" color="#0000ff" />
        ) : errors && errors.length > 0 ? (
          // Render error logs if available
          errors.map((error: ErrorLog) => (
            <ThemedView key={error.errorId} style={styles.errorContainer}>
              <ThemedView style={styles.errorHeader}>
                <ThemedText style={styles.errorText}>
                  {error.datetime} / {error.errorId}
                </ThemedText>
                <ThemedText style={styles.errorText}>
                  {error.message}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))
        ) : (
          // Show message if no errors are logged
          <ThemedText style={styles.errorText}>
            No errors have been logged.
          </ThemedText>
        )}
      </ScrollView>
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
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  errorHeader: {
    flexDirection: 'column',
  },
  errorNote: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 14,
    marginLeft: 8,
  },
});
