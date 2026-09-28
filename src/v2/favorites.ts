import { notifyError, request } from "./api";
import { useSession } from "./session";

const inFlight = new Set<number>();

export async function toggleFavorite(clubId: number) {
  if (inFlight.has(clubId)) return;
  const s = useSession();
  const was = s.favorites.includes(clubId);
  inFlight.add(clubId);
  try {
    await request("/favorites/" + clubId, was ? "DELETE" : "PUT");
    s.favorites = was
      ? s.favorites.filter((x) => x !== clubId)
      : [...s.favorites, clubId];
    uni.showToast({ title: was ? "已取消收藏" : "已收藏", icon: "none" });
  } catch (e) {
    notifyError(e);
  } finally {
    inFlight.delete(clubId);
  }
}
