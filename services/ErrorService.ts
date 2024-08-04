import { ErrorLog, ErrorActionType } from '../types/ErrorTypes';
import { DBService } from "./DBService";
import { showToast } from '@/components/ThemedToast';

export class ErrorService {
  private static instance: ErrorService;

  dbService = DBService.getInstance();

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  async clearAll() {
    await this.dbService.execAsync(`
        DELETE FROM errors;`);
  }

  async logError(
    actionType: ErrorActionType,
    errorId: number,
    message: string,
    error: any = ''
  ) {
    try {
      let processedError = '';

      if (error instanceof Error) {
        // Log the first 400 characters of the error message
        processedError = error.message.slice(0, 400);
      } else if (typeof message === 'string') {
        // Log the provided string
        processedError = error;
      }

      // Log an empty string for any other type
      if (actionType !== ErrorActionType.TOASTONLY) {
        await this.dbService.runAsync(
          `INSERT INTO errors (errorId, error, message)
        VALUES (?, ?, ?);`,
          [errorId, message, processedError]
        );
      }

      // Perform additional actions based on the action type
      switch (actionType) {
        case ErrorActionType.CONSOLE:
          console.error(`Error ${errorId}: ${message} - ${processedError}`);
          break;
        case ErrorActionType.TOAST:
        case ErrorActionType.TOASTONLY:
          showToast('warning', message);
          break;
        case ErrorActionType.BOTH:
          console.error(`Error ${errorId}: ${error} - ${processedError}`);
          showToast('warning', message);
          break;
        // For LOG, do nothing additional since it's logged by default
      }
    } catch (err) {
      console.error("Failed to log error", err);
    }

    // Prune the log to keep only the most recent 200 entries
    try {
      await this.dbService.execAsync(
        `DELETE FROM errors WHERE id NOT IN (SELECT id FROM errors ORDER BY id DESC LIMIT 200);`,
      );
    } catch (error) {
      console.error("Failed to prune error logs", error);
    }
  }

  async getErrors(): Promise<ErrorLog[] | null> {
    let logs: ErrorLog[] = [];

    const errors = (await this.dbService.getAllAsync(
      `select * from errors order by id;`
    )) as ErrorLog[];
    if (errors.length > 0) {
      logs = errors.map((item: any) => ({
        ...item,
        datetime: new Date(item.logDatetime * 1000)
          .toLocaleString()
          .replace(",", ""),
      }));
    }
    return logs;
  }
}
