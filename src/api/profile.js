import { get, post, patch, put, del } from "@/utils/request.js";

import { useProfileStore } from "@/stores/profile";

export const profileApi = {
  async getProfile() {
    try {
      const profile = await get("/student/me");
      const profileStore = useProfileStore();
      profileStore.setProfile(profile);
    } catch (err) {
      throw err;
    }
  },
  async init() {
    try {
      await this.getProfile();
    } catch (err) {
      throw err;
    }
  },
  async renewContact(form) {
    try {
      await patch("/student/contact", form);
    } catch (err) {
      throw err;
    }
  },
};
