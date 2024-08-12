// ErrorTypes.ts

export type ErrorLog = {
  id?: number; // database generated (auto-increment) id
  // application supplied id. Every error log call in in application
  // is uniquely numbered
  errorId?: number;
  logDatetime?: number; // system datetime for log creation
  datetime?: string; // not persisted. populated after retrieval from the database
  error?: string; // if error object created, this contains start of error.message
  message?: string; // application supplied error message
};

export type LoggedError = Omit<Required<ErrorLog>, "error"> & {
  error?: string; // 'error' remains optional
};

// enumeration of how logs are to be handled. All are logged to database except
// TOASTONLY.
export enum ErrorActionType {
  LOG = "log",
  TOAST = "toast",
  CONSOLE = "console",
  BOTH = "both",
  TOASTONLY = "toastonly",
}
