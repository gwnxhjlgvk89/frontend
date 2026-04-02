import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { homeApi } from "@/api/home";

export const useProfileStore = defineStore("profile", () => {
  // 从本地存储恢复
  const profile = ref(uni.getStorageSync("profile") || null);

  // 设置 profile（登录后调用）
  function setProfile(newProfile) {
    profile.value = newProfile.student;
    uni.setStorageSync("profile", newProfile.student);
  }

  return { profile, setProfile };
});
