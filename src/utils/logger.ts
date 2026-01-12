import * as vscode from 'vscode';
import { EXTENSION_NAME } from './constants';

/**
 * Centralized logging utility for the SkillSet extension
 * Provides timestamped logging to VS Code output channel
 */
class Logger {
  private static instance: Logger;
  private outputChannel: vscode.OutputChannel;

  private constructor() {
    this.outputChannel = vscode.window.createOutputChannel(EXTENSION_NAME);
  }

  /**
   * Get singleton instance of logger
   * @returns Logger instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Get ISO timestamp for log entries
   * @returns Formatted timestamp string
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Log informational message
   * @param message Message to log
   * @param data Optional additional data to log
   */
  public info(message: string, data?: unknown): void {
    const timestamp = this.getTimestamp();
    this.outputChannel.appendLine(`[${timestamp}] [INFO] ${message}`);
    if (data !== undefined) {
      this.outputChannel.appendLine(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Log warning message
   * @param message Warning message
   * @param data Optional additional data
   */
  public warn(message: string, data?: unknown): void {
    const timestamp = this.getTimestamp();
    this.outputChannel.appendLine(`[${timestamp}] [WARN] ${message}`);
    if (data !== undefined) {
      this.outputChannel.appendLine(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Log error message
   * @param message Error message
   * @param error Optional error object
   */
  public error(message: string, error?: unknown): void {
    const timestamp = this.getTimestamp();
    this.outputChannel.appendLine(`[${timestamp}] [ERROR] ${message}`);

    if (error !== undefined) {
      if (error instanceof Error) {
        this.outputChannel.appendLine(`Error: ${error.message}`);
        if (error.stack) {
          this.outputChannel.appendLine(`Stack: ${error.stack}`);
        }
      } else {
        this.outputChannel.appendLine(JSON.stringify(error, null, 2));
      }
    }
  }

  /**
   * Log debug message (only in development)
   * @param message Debug message
   * @param data Optional additional data
   */
  public debug(message: string, data?: unknown): void {
    const timestamp = this.getTimestamp();
    this.outputChannel.appendLine(`[${timestamp}] [DEBUG] ${message}`);
    if (data !== undefined) {
      this.outputChannel.appendLine(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Show the output channel to the user
   * @param preserveFocus If true, keeps focus on current editor
   */
  public show(preserveFocus = true): void {
    this.outputChannel.show(preserveFocus);
  }

  /**
   * Clear all log entries
   */
  public clear(): void {
    this.outputChannel.clear();
  }

  /**
   * Dispose of the output channel
   */
  public dispose(): void {
    this.outputChannel.dispose();
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
