import { LatLng } from "./LatLng";

// Value Object: Place
export class Place {
  private constructor(
    public readonly latlng: LatLng | null,
    public readonly city: string,
    public readonly name: string,
    public readonly link?: string
  ) {}

  static create(
    city: string,
    name: string,
    latlng?: LatLng | null,
    link?: string
  ): Place {
    if (!city.trim()) {
      throw new Error("City cannot be empty");
    }
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }
    return new Place(latlng ?? null, city, name, link);
  }

  static fromPlain(data: {
    latlng: { lat: number; lng: number } | null;
    city: string;
    name: string;
    link?: string;
  }): Place {
    return Place.create(
      data.city,
      data.name,
      data.latlng ? LatLng.fromPlain(data.latlng) : null,
      data.link
    );
  }

  hasCoordinates(): boolean {
    return this.latlng !== null;
  }

  hasLink(): boolean {
    return !!this.link;
  }

  equals(other: Place): boolean {
    return (
      this.city === other.city &&
      this.name === other.name &&
      (this.latlng === other.latlng ||
        (this.latlng !== null &&
          other.latlng !== null &&
          this.latlng.equals(other.latlng)))
    );
  }
}
