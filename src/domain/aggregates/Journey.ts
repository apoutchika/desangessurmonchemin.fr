import { Day } from "../entities/Day";

export interface PageNavigation {
  prev?: { slug: string; label: string };
  next?: { slug: string; label: string };
}

export interface JourneyStats {
  totalDays: number;
  totalDistance: number;
  totalElevationGain: number;
  startDate: Date | null;
  endDate: Date | null;
  startCity: string;
  endCity: string;
}

// Aggregate Root: Journey
export class Journey {
  private index: Map<string, Day>;
  private constructor(private readonly days: Day[]) {
    this.index = new Map(days.map((d) => [d.slug, d]));
  }

  static create(days: Day[]): Journey {
    return new Journey(days);
  }

  static fromPlain(data: any[]): Journey {
    const days = data.map((d) => Day.fromPlain(d));
    return Journey.create(days);
  }

  getAllDays(): Day[] {
    return [...this.days];
  }

  getDayBySlug(slug: string): Day | null {
    return this.index.get(slug) ?? null;
  }

  getNavigation(currentDay: Day): PageNavigation {
    const idx = this.days.indexOf(currentDay);
    const prev = idx > 0 ? this.days[idx - 1] : undefined;
    const next = idx < this.days.length - 1 ? this.days[idx + 1] : undefined;

    return {
      prev: prev ? { slug: prev.getSlug(), label: prev.getLabel() } : undefined,
      next: next ? { slug: next.getSlug(), label: next.getLabel() } : undefined,
    };
  }

  getStats(): JourneyStats {
    const journeyDays = this.days.filter((d) => d.isJour() && d.hasStats());

    const totalDistance = journeyDays.reduce(
      (sum, d) => sum + (d.stats?.distance ?? 0),
      0,
    );

    const totalElevationGain = journeyDays.reduce(
      (sum, d) => sum + (d.stats?.elevationGain ?? 0),
      0,
    );

    return {
      totalDays: journeyDays.length,
      totalDistance,
      totalElevationGain,
      startDate: journeyDays[0]?.date ?? null,
      endDate: journeyDays[journeyDays.length - 1]?.date ?? null,
      startCity: journeyDays[0]?.from?.city ?? "",
      endCity: journeyDays[journeyDays.length - 1]?.to?.city ?? "",
    };
  }

  getJourneyDays(): Day[] {
    return this.days.filter((d) => d.isJour());
  }

  getDaysWithMap(): Day[] {
    return this.days.filter((d) => d.hasMap());
  }

  getDaysWithPhotos(): Day[] {
    return this.days.filter((d) => d.hasPhotos());
  }
}
