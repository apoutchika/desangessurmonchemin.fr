import { LRUCache } from 'lru-cache';

// Cache pour les likes par jour
const likesCache = new LRUCache<number, { count: number; timestamp: number }>({
  max: 500, // Max 500 jours en cache
  ttl: 1000 * 60 * 5, // 5 minutes
  updateAgeOnGet: true,
});

// Cache pour les stats de downloads
const downloadStatsCache = new LRUCache<string, { total: number; epub: number; pdf: number; timestamp: number }>({
  max: 1, // Une seule entrée (stats globales)
  ttl: 1000 * 60 * 2, // 2 minutes
  updateAgeOnGet: true,
});

// Cache pour l'état liked d'un utilisateur
const userLikesCache = new LRUCache<string, Set<number>>({
  max: 1000, // Max 1000 utilisateurs en cache
  ttl: 1000 * 60 * 10, // 10 minutes
  updateAgeOnGet: true,
});

export const cache = {
  // Likes
  getLikesCount(dayId: number): number | null {
    const cached = likesCache.get(dayId);
    if (cached) {
      return cached.count;
    }
    return null;
  },

  setLikesCount(dayId: number, count: number): void {
    likesCache.set(dayId, { count, timestamp: Date.now() });
  },

  invalidateLikes(dayId: number): void {
    likesCache.delete(dayId);
  },

  // User likes (pour savoir si un user a liké)
  getUserLikes(ipHash: string): Set<number> | null {
    return userLikesCache.get(ipHash) || null;
  },

  setUserLikes(ipHash: string, dayIds: Set<number>): void {
    userLikesCache.set(ipHash, dayIds);
  },

  addUserLike(ipHash: string, dayId: number): void {
    const likes = userLikesCache.get(ipHash) || new Set<number>();
    likes.add(dayId);
    userLikesCache.set(ipHash, likes);
  },

  removeUserLike(ipHash: string, dayId: number): void {
    const likes = userLikesCache.get(ipHash);
    if (likes) {
      likes.delete(dayId);
      userLikesCache.set(ipHash, likes);
    }
  },

  invalidateUserLikes(ipHash: string): void {
    userLikesCache.delete(ipHash);
  },

  // Download stats
  getDownloadStats(): { total: number; epub: number; pdf: number } | null {
    const cached = downloadStatsCache.get('global');
    if (cached) {
      return { total: cached.total, epub: cached.epub, pdf: cached.pdf };
    }
    return null;
  },

  setDownloadStats(stats: { total: number; epub: number; pdf: number }): void {
    downloadStatsCache.set('global', { ...stats, timestamp: Date.now() });
  },

  invalidateDownloadStats(): void {
    downloadStatsCache.delete('global');
  },

  // Clear all
  clearAll(): void {
    likesCache.clear();
    userLikesCache.clear();
    downloadStatsCache.clear();
  },
};
