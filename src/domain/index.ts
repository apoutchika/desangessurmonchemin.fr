// Domain exports
export { Day } from "./entities/Day";
export type { PageType } from "./entities/Day";

export { Journey } from "./aggregates/Journey";
export type { PageNavigation, JourneyStats } from "./aggregates/Journey";

export { LatLng } from "./value-objects/LatLng";
export { Place } from "./value-objects/Place";
export { Photo } from "./value-objects/Photo";
export { DayStats } from "./value-objects/DayStats";
export { GpxPoint } from "./value-objects/GpxPoint";

// Serialization
export { serializeDay } from "./serialization";
export type {
  SerializedDay,
  SerializedPlace,
  SerializedPhoto,
  SerializedDayStats,
  SerializedGpxPoint,
  SerializedPageNavigation,
} from "./serialization";

// Hooks
export { useDay } from "./hooks/useDay";
