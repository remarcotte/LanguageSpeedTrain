// src/types/ErrorTypes.ts
export type ErrorLog = {
  id?: number;
  errorId?: number;
  logDatetime?: number;
  datetime?: string;
  error?: string;
  message?: string;
};

export enum ErrorActionType {
  LOG = 'log',
  TOAST = 'toast',
  CONSOLE = 'console',
  BOTH = 'both',
  TOASTONLY = 'toastonly',
}
