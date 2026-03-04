// Value Object: DayStats
export class DayStats {
  private constructor(
    public readonly distance: number,
    public readonly elevationGain: number,
    public readonly elevationLoss: number,
    public readonly totalDistance: number,
    public readonly totalElevationGain: number,
    public readonly totalElevationLoss: number
  ) {}

  static create(
    distance: number,
    elevationGain: number,
    elevationLoss: number,
    totalDistance: number,
    totalElevationGain: number,
    totalElevationLoss: number
  ): DayStats {
    if (distance < 0) throw new Error("Distance cannot be negative");
    if (elevationGain < 0) throw new Error("Elevation gain cannot be negative");
    if (elevationLoss < 0) throw new Error("Elevation loss cannot be negative");

    return new DayStats(
      distance,
      elevationGain,
      elevationLoss,
      totalDistance,
      totalElevationGain,
      totalElevationLoss
    );
  }

  static fromPlain(data: {
    distance: number;
    elevationGain: number;
    elevationLoss: number;
    totalDistance: number;
    totalElevationGain: number;
    totalElevationLoss: number;
  }): DayStats {
    return DayStats.create(
      data.distance,
      data.elevationGain,
      data.elevationLoss,
      data.totalDistance,
      data.totalElevationGain,
      data.totalElevationLoss
    );
  }
}
