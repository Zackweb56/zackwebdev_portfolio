/**
 * Cursor System Types
 */

export type CursorMode = "default" | "interactive" | "text";

export type CursorAction =
  | "INSPECT"
  | "OPEN"
  | "SOURCE"
  | "VIEW"
  | "ENTER"
  | "GO"
  | "CONTACT"
  | "MAIL"
  | null;

export interface CursorState {
  mode: CursorMode;
  action: CursorAction;
  label: string | null;
  symbol: string | null;
}
