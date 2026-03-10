import { LRUCache } from 'lru-cache';

// Cache pour les likes par page (slug)
const likesCache = new LRUCache<string, { count: number; timestamp: number }>({
  max: 500, // Max 500 pages en cache
  ttl: 1000 * 60 * 5, // 5 minutes
  updateAgeOnGet: true,
});

// Cache pour les stats de downloads
const downloadStatsCache = new LRUCache<string, { total: number; epub: number; pdf: number; timestamp: number }>({
  max: 1, // Une seule entrée (stats globales)
  ttl: 1000 * 60 * 2, // 2 minutes
  updateAgeOnGet: true,
});

// Cache pour l'état liked d'un utilisateur (slug-based)
const userLikesCache = new LRUCache<string, Set<string>>({
  max: 1000, // Max 1000 utilisateurs en cache
  ttl: 1000 * 60 * 10, // 10 minutes
  updateAgeOnGet: true,
});

export const cache = {
  // Likes
  getLikesCount(pageSlug: string): number | null {
    const cached = likesCache.get(pageSlug);
    if (cached) {
      return cached.count;
    }
    return null;
  },

  setLikesCount(pageSlug: string, count: number): void {
    likesCache.set(pageSlug, { count, timestamp: Date.now() });
  },

  invalidateLikes(pageSlug: string): void {
    likesCache.delete(pageSlug);
  },

  // User likes (pour savoir si un user a liké)
  getUserLikes(ipHash: string): Set<string> | null {
    return userLikesCache.get(ipHash) || null;
  },

  setUserLikes(ipHash: string, pageSlugs: Set<string>): void {
    userLikesCache.set(ipHash, pageSlugs);
  },

  addUserLike(ipHash: string, pageSlug: string): void {
    const likes = userLikesCache.get(ipHash) || new Set<string>();
    likes.add(pageSlug);
    userLikesCache.set(ipHash, likes);
  },

  removeUserLike(ipHash: string, pageSlug: string): void {
    const likes = userLikesCache.get(ipHash);
    if (likes) {
      likes.delete(pageSlug);
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
