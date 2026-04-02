import { get, post, patch, put, del } from "@/utils/request.js";
import { useClubStore } from "@/stores/club";
import { useFavStore } from "@/stores/fav";
import { useProfileStore } from "@/stores/profile";

export const homeApi = {
  async getClubs() {
    try {
      const clubs = await get("/student/clubs");
      const clubStore = useClubStore();
      clubStore.setClubs(clubs);
    } catch (err) {
      throw err;
    }
  },
  async getFavNames() {
    try {
      const favors = await get("/student/favorites");
      const favStore = useFavStore();
      favStore.setFavNames(favors);
    } catch (err) {
      throw err;
    }
  },
  async getProfile() {
    try {
      const profile = await get("/student/me");
      const profileStore = useProfileStore();
      profileStore.setProfile(profile);
    } catch (err) {
      throw err;
    }
  },
  async renewFavName(name) {
    try {
      await post("/student/favorites", { club_name: name });
    } catch (err) {
      throw err;
    }
  },
  async renewFavNames() {
    try {
      const favStore = useFavStore();
      const favNames = favStore.favNames;
      for (const name of favNames) {
        this.renewFavName(name);
      }
    } catch (err) {
      throw err;
    }
  },
  async selectClub(name) {
    try {
      await post(`/student/select`, { club_name: name });
    } catch (err) {
      throw err;
    }
  },
  async quitClub() {
    try {
      await post(`/student/quit`);
    } catch (err) {
      throw err;
    }
  },

  async init() {
    try {
      await Promise.all([
        this.getClubs(),
        this.getFavNames(),
        this.getProfile(),
      ]);
    } catch (err) {
      throw err;
    }
  },
};
