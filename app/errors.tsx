import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ErrorService } from '../services/ErrorService';
import { type ErrorLog } from '../types/ErrorTypes';

export default function Errors() {
  const errorService = ErrorService.getInstance();

  const [errors, setErrors] = useState<any>(null);

  useEffect(() => {
    const getErrors = async () => {
      const e = (await errorService.getErrors()) as ErrorLog[];
      setErrors(e || null);
    };

    getErrors();
  }, []);

  return (
    <ThemedScreen title="Errors">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.errorNote}>
          This screen is used for support if application becomes unstable.
        </ThemedText>
        {errors && errors.length > 1 ? (
          errors.map((error: ErrorLog, index: number) => (
            <ThemedView key={index} style={styles.errorContainer}>
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
    // justifyContent: 'space-between',
    // alignItems: 'center',
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
