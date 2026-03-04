// Value Object: LatLng
export class LatLng {
  private constructor(
    public readonly lat: number,
    public readonly lng: number
  ) {}

  static create(lat: number, lng: number): LatLng {
    if (lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }
    if (lng < -180 || lng > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }
    return new LatLng(lat, lng);
  }

  static fromPlain(data: { lat: number; lng: number }): LatLng {
    return LatLng.create(data.lat, data.lng);
  }

  toTuple(): [number, number] {
    return [this.lat, this.lng];
  }

  equals(other: LatLng): boolean {
    return this.lat === other.lat && this.lng === other.lng;
  }

  distanceTo(other: LatLng): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(other.lat - this.lat);
    const dLng = this.toRad(other.lng - this.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(this.lat)) *
        Math.cos(this.toRad(other.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
