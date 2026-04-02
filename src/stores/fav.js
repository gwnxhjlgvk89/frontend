import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { homeApi } from "@/api/home";

export const useFavStore = defineStore("fav", () => {
  // 从本地存储恢复
  const favNames = ref(uni.getStorageSync("favNames") || []);

  // 是否已收藏
  const isFav = (name) => favNames.value.includes(name);

  // 收藏数量
  const favCount = computed(() => favNames.value.length);

  function setFavNames(data) {
    favNames.value = data || [];
    uni.setStorageSync("favNames", favNames.value);
  }

  // 切换收藏状态
  const toggleFav = async (name) => {
    if (favNames.value.includes(name)) {
      favNames.value = favNames.value.filter((favName) => favName !== name);
    } else {
      favNames.value = [...favNames.value, name];
    }
    // 同步持久化
    uni.setStorageSync("favNames", favNames.value);
    // 同步后端
    try {
      await homeApi.renewFavName(name);
    } catch (err) {
      throw err;
    }
  };

  return { favNames, favCount, setFavNames, isFav, toggleFav };
});
