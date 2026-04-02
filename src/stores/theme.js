import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    currentTheme: "theme-dark", // 默认主题
  }),
  getters: {
    getCurrentTheme(state) {
      return state.currentTheme;
    },
  },
  actions: {
    setTheme(theme) {
      this.currentTheme = theme;
      // 将主题保存到本地存储，以便下次访问时使用
      uni.setStorageSync("theme", theme);
    },
  },
});
