"use client";

import useSWR, { mutate } from "swr";

interface LikesData {
  count: number;
  liked: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLikes(pageSlug: string) {
  const key = `/api/likes?pageSlug=${encodeURIComponent(pageSlug)}`;

  const { data, error, isLoading } = useSWR<LikesData>(key, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // Refresh toutes les 30 secondes
  });

  const addLike = async () => {
    try {
      // Optimistic update
      mutate(
        key,
        (current: LikesData | undefined) => {
          if (!current) return current;
          return { count: current.count + 1, liked: true };
        },
        false,
      );

      const response = await fetch("/api/likes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug }),
      });

      if (!response.ok) throw new Error("Failed to add like");

      const result = await response.json();

      // Revalider avec les données du serveur
      mutate(key, result, false);

      return { success: true, action: "add" as const };
    } catch (error) {
      // Rollback en cas d'erreur
      mutate(key);
      console.error("Error adding like:", error);
      return { success: false, action: "add" as const };
    }
  };

  const removeLike = async () => {
    try {
      // Optimistic update
      mutate(
        key,
        (current: LikesData | undefined) => {
          if (!current) return current;
          return { count: Math.max(0, current.count - 1), liked: false };
        },
        false,
      );

      const response = await fetch(`/api/likes?pageSlug=${encodeURIComponent(pageSlug)}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove like");

      const result = await response.json();

      // Revalider avec les données du serveur
      mutate(key, result, false);

      return { success: true, action: "remove" as const };
    } catch (error) {
      // Rollback en cas d'erreur
      mutate(key);
      console.error("Error removing like:", error);
      return { success: false, action: "remove" as const };
    }
  };

  const toggleLike = async () => {
    if (data?.liked) {
      return removeLike();
    } else {
      return addLike();
    }
  };

  return {
    count: data?.count ?? 0,
    liked: data?.liked ?? false,
    isLoading,
    error,
    addLike,
    removeLike,
    toggleLike,
  };
}
