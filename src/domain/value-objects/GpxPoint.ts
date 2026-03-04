// Value Object: GpxPoint
export class GpxPoint {
  private constructor(
    public readonly id: string,
    public readonly lat: number,
    public readonly lng: number,
    public readonly ele: number
  ) {}

  static create(id: string, lat: number, lng: number, ele: number): GpxPoint {
    if (!id.trim()) {
      throw new Error("GpxPoint id cannot be empty");
    }
    return new GpxPoint(id, lat, lng, ele);
  }

  static fromPlain(data: {
    id: string;
    lat: number;
    lng: number;
    ele: number;
  }): GpxPoint {
    return GpxPoint.create(data.id, data.lat, data.lng, data.ele);
  }

  toLatLng(): [number, number] {
    return [this.lat, this.lng];
  }
}
