import { Place } from "../value-objects/Place";
import { Photo } from "../value-objects/Photo";
import { DayStats } from "../value-objects/DayStats";
import { GpxPoint } from "../value-objects/GpxPoint";

export type PageType = "avant-propos" | "jour" | "postface";

// Entité: Day
export class Day {
  private constructor(
    public readonly id: number,
    public readonly type: PageType,
    public readonly day: number | null,
    public readonly date: Date | null,
    public readonly title: string | null,
    public readonly from: Place | null,
    public readonly to: Place | null,
    public readonly stats: DayStats | null,
    public readonly gpx: GpxPoint[],
    public readonly content: string,
    public readonly photos: Photo[],
    public readonly fromMemory: boolean,
  ) {}

  static create(params: {
    id: number;
    type: PageType;
    day?: number | null;
    date?: Date | null;
    title?: string | null;
    from?: Place | null;
    to?: Place | null;
    stats?: DayStats | null;
    gpx?: GpxPoint[];
    content: string;
    photos?: Photo[];
    fromMemory?: boolean;
  }): Day {
    return new Day(
      params.id,
      params.type,
      params.day ?? null,
      params.date ?? null,
      params.title ?? null,
      params.from ?? null,
      params.to ?? null,
      params.stats ?? null,
      params.gpx ?? [],
      params.content,
      params.photos ?? [],
      params.fromMemory ?? false,
    );
  }

  static fromPlain(data: any): Day {
    return Day.create({
      id: data.id,
      type: data.type,
      day: data.day,
      date: data.date ? new Date(data.date) : null,
      title: data.title,
      from: data.from ? Place.fromPlain(data.from) : null,
      to: data.to ? Place.fromPlain(data.to) : null,
      stats: data.stats ? DayStats.fromPlain(data.stats) : null,
      gpx: data.gpx ? data.gpx.map((p: any) => GpxPoint.fromPlain(p)) : [],
      content: data.content,
      photos: data.photos
        ? data.photos.map((p: any) => Photo.fromPlain(p))
        : [],
      fromMemory: data.fromMemory ?? false,
    });
  }

  // Méthodes métier
  isJour(): boolean {
    return this.type === "jour";
  }

  isAvantPropos(): boolean {
    return this.type === "avant-propos";
  }

  isPostface(): boolean {
    return this.type === "postface";
  }

  hasMap(): boolean {
    return (
      this.isJour() &&
      this.from !== null &&
      this.to !== null &&
      this.from.hasCoordinates() &&
      this.to.hasCoordinates()
    );
  }

  hasGpx(): boolean {
    return this.gpx.length > 2;
  }

  hasPhotos(): boolean {
    return this.photos.length > 0;
  }

  hasStats(): boolean {
    return this.stats !== null;
  }

  hasElevationProfile(): boolean {
    return this.hasGpx() && this.gpx.length > 1;
  }

  getSlug(): string {
    if (this.isAvantPropos()) return "avant-propos";
    if (this.isPostface()) return "postface";
    return `jour-${this.day}`;
  }

  getTitle(): string {
    if (!this.isJour()) {
      return this.title ?? (this.isAvantPropos() ? "Avant-propos" : "Postface");
    }

    if (this.from && this.to && this.from.city === this.to.city) {
      return this.from.city;
    }

    return `${this.from?.city ?? "?"} → ${this.to?.city ?? "?"}`;
  }

  getLabel(): string {
    if (!this.isJour()) {
      return this.getTitle();
    }

    if (this.from && this.to && this.from.city === this.to.city) {
      return `Jour ${this.day} — ${this.from.city}`;
    }

    return `Jour ${this.day} — ${this.from?.city ?? "?"} → ${this.to?.city ?? "?"}`;
  }

  getFormattedDate(locale: string = "fr-FR"): string | null {
    if (!this.date) return null;

    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(this.date);
  }

  getMapCenter(): [number, number] | null {
    if (!this.hasMap() || !this.from || !this.to) return null;

    const fromLatLng = this.from.latlng!;
    const toLatLng = this.to.latlng!;

    return [
      (fromLatLng.lat + toLatLng.lat) / 2,
      (fromLatLng.lng + toLatLng.lng) / 2,
    ];
  }

  getGpxLatLngs(): [number, number][] {
    if (!this.hasGpx()) return [];
    return this.gpx.map((p) => p.toLatLng());
  }

  getAllGpxLatLngs(): [number, number][] {
    const points = this.gpx.map((p) => p.toLatLng());
    if (this.from?.latlng) {
      points.push(this.from?.latlng.toTuple());
    }
    if (this.to?.latlng) {
      points.push(this.to?.latlng.toTuple());
    }
    return points;
  }
}
