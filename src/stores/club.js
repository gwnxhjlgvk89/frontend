// stores/club.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useClubStore = defineStore("club", () => {
  // 唯一数据源：优先从 Storage 恢复（App 冷启动时）
  const clubs = ref(uni.getStorageSync("clubs") || []);

  const superClubOptions = computed(() => {
    const set = new Set(clubs.value.map((c) => c.super_club)); // ✅ 加 .value
    return [
      { label: "全部", value: "all" },
      ...[...set].map((s) => ({ label: s, value: s })),
    ];
  });

  // ===== 计算属性 =====
  //   const openClubs = computed(() => clubs.value.filter((c) => c.status === 1));

  //   const clubsByMajor = computed(
  //     () => (major) =>
  //       clubs.value.filter((c) => !c.major_limit || c.major_limit === major),
  //   );

  //   const quotaById = computed(
  //     () => (id) =>
  //       clubs.value.find((c) => c.club_id === id)?.remaining_quota ?? 0,
  //   );

  // ===== Actions =====

  // 登录后由 authApi 调用，整体初始化
  function setClubs(data) {
    clubs.value = data || [];
    uni.setStorageSync("clubs", clubs.value);
  }

  // 抢课成功后更新单个社团（名额变化）
  function updateClub(updated) {
    const idx = clubs.value.findIndex((c) => c.club_id === updated.club_id);
    if (idx !== -1) {
      clubs.value[idx] = updated;
      uni.setStorageSync("clubs", clubs.value);
    }
  }

  // 登出时清空
  function clearClubs() {
    clubs.value = [];
    uni.removeStorageSync("clubs");
  }

  function clear() {
    clearClubs();
  }

  return {
    clubs,
    superClubOptions,
    setClubs,
    updateClub,
    clear,
  };
});
