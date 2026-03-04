import { useMemo } from "react";
import { Day } from "../entities/Day";
import type { SerializedDay } from "../serialization";

// Hook pour reconstruire l'entité Day côté client
export function useDay(serializedDay: SerializedDay): Day {
  return useMemo(() => Day.fromPlain(serializedDay), [serializedDay]);
}
