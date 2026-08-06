import { CursorAction, CursorMode, CursorState } from "./cursor.types";

/**
 * Symbol mapping for technical annotation badges
 */
export const ACTION_SYMBOLS: Record<NonNullable<CursorAction>, string> = {
  INSPECT: "+",
  OPEN: "↗",
  SOURCE: "<>",
  VIEW: "[ ]",
  ENTER: "→",
  GO: "→",
  CONTACT: "@",
  MAIL: "@",
};

/**
 * Detect cursor mode and action from hover event target element
 */
export function getCursorStateFromElement(target: HTMLElement | null): CursorState {
  if (!target) {
    return { mode: "default", action: null, label: null, symbol: null };
  }

  // Check explicit data-cursor or data-cursor-action attributes up the DOM tree
  const cursorEl = target.closest<HTMLElement>(
    "[data-cursor], [data-cursor-action], a, button, input, textarea, select, [role='button']"
  );

  if (!cursorEl) {
    // Check if hovering selectable text element
    const isTextEl = target.closest("p, h1, h2, h3, h4, h5, h6, li, span");
    if (isTextEl && !isTextEl.closest("a, button")) {
      return { mode: "text", action: null, label: null, symbol: null };
    }
    return { mode: "default", action: null, label: null, symbol: null };
  }

  const explicitMode = cursorEl.getAttribute("data-cursor") as CursorMode | null;
  const explicitAction = cursorEl.getAttribute("data-cursor-action") as CursorAction | null;
  const explicitLabel = cursorEl.getAttribute("data-cursor-label");

  // Case 1: Explicit text cursor requested
  if (explicitMode === "text") {
    return { mode: "text", action: null, label: null, symbol: null };
  }

  // Case 2: Explicit action defined
  if (explicitAction && ACTION_SYMBOLS[explicitAction]) {
    return {
      mode: "interactive",
      action: explicitAction,
      label: explicitLabel || explicitAction,
      symbol: ACTION_SYMBOLS[explicitAction],
    };
  }

  // Case 3: Action derived from explicit data-cursor value (e.g. data-cursor="inspect")
  if (explicitMode && explicitMode.toUpperCase() in ACTION_SYMBOLS) {
    const derivedAction = explicitMode.toUpperCase() as CursorAction;
    return {
      mode: "interactive",
      action: derivedAction,
      label: explicitLabel || derivedAction,
      symbol: derivedAction ? ACTION_SYMBOLS[derivedAction] : null,
    };
  }

  // Case 4: Native HTML element defaults (Links & Buttons)
  const isLink = cursorEl.tagName === "A";
  const isExternal = isLink && cursorEl.getAttribute("target") === "_blank";

  if (isExternal) {
    return {
      mode: "interactive",
      action: "OPEN",
      label: "OPEN",
      symbol: ACTION_SYMBOLS.OPEN,
    };
  }

  if (isLink || cursorEl.tagName === "BUTTON" || cursorEl.getAttribute("role") === "button") {
    return {
      mode: "interactive",
      action: "GO",
      label: explicitLabel || "GO",
      symbol: ACTION_SYMBOLS.GO,
    };
  }

  return { mode: "default", action: null, label: null, symbol: null };
}
