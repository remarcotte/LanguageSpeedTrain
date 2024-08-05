import { ErrorLog, ErrorActionType } from '../types/ErrorTypes'; // Import error-related types
import { DBService } from "./DBService"; // Import database service
import { showToast } from '@/components/ThemedToast'; // Import custom toast component

// Singleton class for managing error logging and actions
export class ErrorService {
  private static instance: ErrorService; // Singleton instance of ErrorService

  dbService = DBService.getInstance(); // Instance of DBService for database operations

  // Get the singleton instance of ErrorService
  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  // Clear all error logs from the database
  async clearAll() {
    await this.dbService.execAsync(`
        DELETE FROM errors;`);
  }

  // Process the error object and return a truncated error message
  private processError(error: unknown): string {
    if (error instanceof Error) {
      return error.message.slice(0, 400); // Limit to 400 characters
    } else if (typeof error === 'string') {
      return error.slice(0, 400); // Limit to 400 characters
    }
    return ''; // Return empty string for other types
  }

  // Handle different error action types
  private handleErrorAction(
    actionType: ErrorActionType,
    errorId: number,
    message: string,
    processedError: string
  ) {
    switch (actionType) {
      case ErrorActionType.CONSOLE:
        // Log error to the console
        console.error(`Error ${errorId}: ${message} - ${processedError}`);
        break;
      case ErrorActionType.TOAST:
      case ErrorActionType.TOASTONLY:
        // Show a toast notification
        showToast('warning', message);
        break;
      case ErrorActionType.BOTH:
        // Log error to the console and show a toast notification
        console.error(`Error ${errorId}: ${message} - ${processedError}`);
        showToast('warning', message);
        break;
      // LOG action does not require additional handling
    }
  }

  // Log an error to the database and perform additional actions
  async logError(
    actionType: ErrorActionType,
    errorId: number,
    message: string,
    error: any = ''
  ) {
    try {
      const processedError = this.processError(error);

      // Log the error to the database if not only showing a toast
      if (actionType !== ErrorActionType.TOASTONLY) {
        await this.dbService.runAsync(
          `INSERT INTO errors (errorId, error, message)
          VALUES (?, ?, ?);`,
          [errorId, message, processedError]
        );
      }

      // Perform additional actions based on the action type
      this.handleErrorAction(actionType, errorId, message, processedError);
    } catch (err) {
      // Log any errors encountered while trying to log the original error
      console.error("Failed to log error", err);
    }

    // Prune old error logs to limit the number of stored entries
    await this.pruneErrorLogs();
  }

  // Prune old error logs to limit the number of stored entries
  private async pruneErrorLogs() {
    try {
      await this.dbService.execAsync(
        `DELETE FROM errors WHERE id NOT IN (SELECT id FROM errors ORDER BY id DESC LIMIT 200);`
      );
    } catch (error) {
      console.error("Failed to prune error logs", error);
    }
  }

  // Retrieve the entire list of errors in reverse chronological order
  async getErrors(): Promise<ErrorLog[] | null> {
    let logs: ErrorLog[] = [];

    const errors = await this.dbService.getAllAsync<ErrorLog>(
      `select * from errors order by id desc;`
    );

    if (errors && errors.length > 0) {
      logs = errors.map((item: any) => ({
        ...item,
        // Convert the log date to a readable string format
        datetime: this.dbService.dbDateToString(item.logDatetime),
      }));
    }
    return logs;
  }
}
