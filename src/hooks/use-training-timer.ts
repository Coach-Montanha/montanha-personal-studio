import { useState, useEffect, useCallback } from "react";
import type { TimerMode } from "@/components/pt/TrainingTimerDialog";

type TimerState = {
  open: boolean;
  defaultMode?: TimerMode;
};

let currentTimerState: TimerState = { open: false, defaultMode: "EMOM" };
const listeners = new Set<(state: TimerState) => void>();

function notify() {
  listeners.forEach((listener) => listener(currentTimerState));
}

export function openTrainingTimer(defaultMode: TimerMode = "EMOM") {
  currentTimerState = { open: true, defaultMode };
  notify();
}

export function closeTrainingTimer() {
  currentTimerState = { ...currentTimerState, open: false };
  notify();
}

export function setTrainingTimerOpen(open: boolean) {
  currentTimerState = { ...currentTimerState, open };
  notify();
}

export function useTrainingTimer() {
  const [state, setState] = useState<TimerState>(currentTimerState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const open = useCallback((mode: TimerMode = "EMOM") => {
    openTrainingTimer(mode);
  }, []);

  const close = useCallback(() => {
    closeTrainingTimer();
  }, []);

  const setOpen = useCallback((isOpen: boolean) => {
    setTrainingTimerOpen(isOpen);
  }, []);

  return {
    isOpen: state.open,
    defaultMode: state.defaultMode,
    openTimer: open,
    closeTimer: close,
    setOpen,
  };
}
