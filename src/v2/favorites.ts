import { notifyError, request } from "./api";
import { useSession } from "./session";

const inFlight = new Set<number>();

export async function toggleFavorite(clubId: number) {
  if (inFlight.has(clubId)) return;
  const s = useSession();
  const was = s.favorites.includes(clubId);
  const set = (on: boolean) =>
    (s.favorites = on
      ? [...s.favorites.filter((x) => x !== clubId), clubId]
      : s.favorites.filter((x) => x !== clubId));
  inFlight.add(clubId);
  // Update the heart immediately; roll back if the request fails.
  set(!was);
  try {
    await request("/favorites/" + clubId, was ? "DELETE" : "PUT");
  } catch (e) {
    set(was);
    notifyError(e);
  } finally {
    inFlight.delete(clubId);
  }
}
