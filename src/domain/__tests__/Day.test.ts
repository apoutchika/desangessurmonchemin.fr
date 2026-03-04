import { describe, it, expect } from '@jest/globals';
import { Day } from '../entities/Day';
import { Place } from '../value-objects/Place';
import { LatLng } from '../value-objects/LatLng';
import { DayStats } from '../value-objects/DayStats';
import { Photo } from '../value-objects/Photo';
import { GpxPoint } from '../value-objects/GpxPoint';

describe('Day Entity', () => {
  describe('Type checks', () => {
    it('should identify a jour type', () => {
      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        content: 'Test content',
      });

      expect(day.isJour()).toBe(true);
      expect(day.isAvantPropos()).toBe(false);
      expect(day.isPostface()).toBe(false);
    });

    it('should identify avant-propos type', () => {
      const day = Day.create({
        id: 0,
        type: 'avant-propos',
        content: 'Test content',
      });

      expect(day.isAvantPropos()).toBe(true);
      expect(day.isJour()).toBe(false);
    });
  });

  describe('hasMap()', () => {
    it('should return true when jour has from/to with coordinates', () => {
      const from = Place.create(
        'Lyon',
        'Chez moi',
        LatLng.create(45.76, 4.84)
      );
      const to = Place.create(
        'Thurins',
        'Chez Dominique',
        LatLng.create(45.67, 4.65)
      );

      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        from,
        to,
        content: 'Test',
      });

      expect(day.hasMap()).toBe(true);
    });

    it('should return false when not a jour', () => {
      const day = Day.create({
        id: 0,
        type: 'avant-propos',
        content: 'Test',
      });

      expect(day.hasMap()).toBe(false);
    });

    it('should return false when from or to missing coordinates', () => {
      const from = Place.create('Lyon', 'Chez moi'); // No coordinates
      const to = Place.create('Thurins', 'Chez Dominique');

      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        from,
        to,
        content: 'Test',
      });

      expect(day.hasMap()).toBe(false);
    });
  });

  describe('hasPhotos()', () => {
    it('should return true when photos exist', () => {
      const photo = Photo.create('/photo.jpg', 'Test photo');
      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        content: 'Test',
        photos: [photo],
      });

      expect(day.hasPhotos()).toBe(true);
    });

    it('should return false when no photos', () => {
      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        content: 'Test',
      });

      expect(day.hasPhotos()).toBe(false);
    });
  });

  describe('hasStats()', () => {
    it('should return true when stats exist', () => {
      const stats = DayStats.create(25, 500, 400, 25, 500, 400);
      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        content: 'Test',
        stats,
      });

      expect(day.hasStats()).toBe(true);
    });

    it('should return false when no stats', () => {
      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        content: 'Test',
      });

      expect(day.hasStats()).toBe(false);
    });
  });

  describe('hasElevationProfile()', () => {
    it('should return true when multiple GPX points exist', () => {
      const gpx = [
        GpxPoint.create('1', 45.76, 4.84, 200),
        GpxPoint.create('2', 45.77, 4.85, 250),
      ];

      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        content: 'Test',
        gpx,
      });

      expect(day.hasElevationProfile()).toBe(true);
    });

    it('should return false when only one GPX point', () => {
      const gpx = [GpxPoint.create('1', 45.76, 4.84, 200)];

      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        content: 'Test',
        gpx,
      });

      expect(day.hasElevationProfile()).toBe(false);
    });
  });

  describe('getSlug()', () => {
    it('should return "avant-propos" for avant-propos type', () => {
      const day = Day.create({
        id: 0,
        type: 'avant-propos',
        content: 'Test',
      });

      expect(day.getSlug()).toBe('avant-propos');
    });

    it('should return "postface" for postface type', () => {
      const day = Day.create({
        id: 100,
        type: 'postface',
        content: 'Test',
      });

      expect(day.getSlug()).toBe('postface');
    });

    it('should return "jour-N" for jour type', () => {
      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 5,
        content: 'Test',
      });

      expect(day.getSlug()).toBe('jour-5');
    });
  });

  describe('getTitle()', () => {
    it('should return title for non-jour types', () => {
      const day = Day.create({
        id: 0,
        type: 'avant-propos',
        title: 'Mon Avant-propos',
        content: 'Test',
      });

      expect(day.getTitle()).toBe('Mon Avant-propos');
    });

    it('should return city when from and to are same', () => {
      const from = Place.create('Lyon', 'Départ');
      const to = Place.create('Lyon', 'Arrivée');

      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        from,
        to,
        content: 'Test',
      });

      expect(day.getTitle()).toBe('Lyon');
    });

    it('should return "from → to" when cities differ', () => {
      const from = Place.create('Lyon', 'Départ');
      const to = Place.create('Thurins', 'Arrivée');

      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        from,
        to,
        content: 'Test',
      });

      expect(day.getTitle()).toBe('Lyon → Thurins');
    });
  });

  describe('getMapCenter()', () => {
    it('should calculate center between from and to', () => {
      const from = Place.create(
        'Lyon',
        'Départ',
        LatLng.create(45.76, 4.84)
      );
      const to = Place.create(
        'Thurins',
        'Arrivée',
        LatLng.create(45.68, 4.66)
      );

      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        from,
        to,
        content: 'Test',
      });

      const center = day.getMapCenter();
      expect(center).toEqual([
        (45.76 + 45.68) / 2,
        (4.84 + 4.66) / 2,
      ]);
    });

    it('should return null when no map available', () => {
      const day = Day.create({
        id: 1,
        type: 'jour',
        day: 1,
        content: 'Test',
      });

      expect(day.getMapCenter()).toBeNull();
    });
  });
});
