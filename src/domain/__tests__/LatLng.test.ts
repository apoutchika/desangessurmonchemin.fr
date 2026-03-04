import { describe, it, expect } from '@jest/globals';
import { LatLng } from '../value-objects/LatLng';

describe('LatLng Value Object', () => {
  describe('create()', () => {
    it('should create valid coordinates', () => {
      const latlng = LatLng.create(45.76, 4.84);
      expect(latlng.lat).toBe(45.76);
      expect(latlng.lng).toBe(4.84);
    });

    it('should throw error for invalid latitude', () => {
      expect(() => LatLng.create(91, 4.84)).toThrow(
        'Latitude must be between -90 and 90'
      );
      expect(() => LatLng.create(-91, 4.84)).toThrow(
        'Latitude must be between -90 and 90'
      );
    });

    it('should throw error for invalid longitude', () => {
      expect(() => LatLng.create(45.76, 181)).toThrow(
        'Longitude must be between -180 and 180'
      );
      expect(() => LatLng.create(45.76, -181)).toThrow(
        'Longitude must be between -180 and 180'
      );
    });
  });

  describe('equals()', () => {
    it('should return true for same coordinates', () => {
      const a = LatLng.create(45.76, 4.84);
      const b = LatLng.create(45.76, 4.84);
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different coordinates', () => {
      const a = LatLng.create(45.76, 4.84);
      const b = LatLng.create(45.77, 4.85);
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('toTuple()', () => {
    it('should convert to [lat, lng] tuple', () => {
      const latlng = LatLng.create(45.76, 4.84);
      expect(latlng.toTuple()).toEqual([45.76, 4.84]);
    });
  });

  describe('distanceTo()', () => {
    it('should calculate distance between two points', () => {
      const lyon = LatLng.create(45.764043, 4.835659);
      const paris = LatLng.create(48.856614, 2.352222);
      
      const distance = lyon.distanceTo(paris);
      
      // Distance Lyon-Paris ≈ 392 km
      expect(distance).toBeGreaterThan(390);
      expect(distance).toBeLessThan(395);
    });

    it('should return 0 for same point', () => {
      const a = LatLng.create(45.76, 4.84);
      const b = LatLng.create(45.76, 4.84);
      
      expect(a.distanceTo(b)).toBe(0);
    });
  });
});
