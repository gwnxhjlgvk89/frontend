<template>
  <view>
    <ToastProvider />
    <HomeContainer>
      <template #header>
        <HomeHeader
          :total-count="clubs.length"
          :filtered-count="filteredClubs.length"
          :majorTags="clubStore.superClubOptions"
          :fav-count="favNames.length"
          :current-page="currentPage"
          :total-pages="totalPages"
          :profile="profile"
          @update:keyword="onKeyword"
          @update:major="onMajor"
          @update:sort="onSort"
        />
      </template>

      <HomeBody
        :clubs="pagedClubs"
        :profile="profile"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-count="filteredClubs.length"
        @update:page="onPageChange"
        @prev-page="onPrevPage"
        @next-page="onNextPage"
      />

      <template #footer>
        <Footer />
      </template>
    </HomeContainer>
  </view>
</template>

<script setup>
import HomeContainer from "@/components/layout/HomeContainer.vue";
import ToastProvider from "@/components/base/ToastProvider.vue";
import HomeHeader from "./components/HomeHeader.vue";
import HomeBody from "./components/HomeBody.vue";
import Footer from "@/components/base/Footer.vue";
import { onLoad, onUnload, onHide, onShow } from "@dcloudio/uni-app";
import { ref, computed, watch } from "vue";
import { homeApi } from "@/api/home";
import { useClubStore } from "@/stores/club.js";
import { useFavStore } from "@/stores/fav.js";
import { useProfileStore } from "@/stores/profile";
import { useWsStore } from "@/stores/wsStore";
import { useTimerStore } from "@/stores/timer"; // ✅ 引入 Timer Store
import { showToast } from "@/utils/toast";
// import { getMemoryInfo, monitorMemory } from "@/utils/memory";

const clubStore = useClubStore();
const favStore = useFavStore();
const profileStore = useProfileStore();
const wsStore = useWsStore();
const timerStore = useTimerStore(); // ✅ 获取 Timer Store

const PAGE_ID = "home"; // ✅ 定义页面ID

// 监控内存（可选，调试用）
// let stopMonitor = null;

// ===================== 数据源 =====================
const clubs = computed(() => clubStore.clubs);
const favNames = computed(() => favStore.favNames);
const profile = computed(() => profileStore.profile);
let timer = null;

async function refresh() {
  try {
    await homeApi.init();
  } catch (e) {
    console.error("[Home] 刷新失败", e);
  }
}

// ===================== 生命周期 =====================
onLoad(async () => {
  // 页面加载时获取一次内存信息
  // getMemoryInfo();

  // 启动实时监测（每 5 秒检查一次）
  // stopMonitor = monitorMemory(5000);

  await refresh();
  wsStore.connect();

  // ✅ 使用 Timer Store 创建定时器
  timerStore.createTimer(PAGE_ID, "refresh", refresh, 3000);

  // 名额更新
  wsStore.on("quota_update", ({ club_name, remaining_quota }) => {
    const club = clubs.value.find((c) => c.club_name === club_name);
    if (club) {
      club.remaining_quota = remaining_quota;
      if (remaining_quota === 0) club.club_status = 2;
    }
  });

  // 抢课成功（只有当前页面在前台才弹）
  wsStore.on("select_success", ({ message }) => {
    showToast({ title: message, icon: "success", duration: 2500 });
  });
});

onHide(() => {
  timerStore.clearTimer(PAGE_ID);
  // ✅ ws 断线服务端会自动感知，不需要手动 disconnect
  // wsStore.disconnect();
});

onShow(async () => {
  await refresh();
  wsStore.connect(); // 重连即可
  timerStore.clearTimer(PAGE_ID);
  timerStore.createTimer(PAGE_ID, "refresh", refresh, 3000);
});

onUnload(() => {
  timerStore.clearPageTimers(PAGE_ID);
  wsStore.disconnect();
});

// ===================== 筛选/排序状态 =====================
const keyword = ref("");
const activeMajor = ref("all");
const sortMode = ref(""); // "asc" | "desc" | ""

const onKeyword = (val) => (keyword.value = val);
const onMajor = (val) => (activeMajor.value = val);
const onSort = (val) => (sortMode.value = val);

// ===================== 筛选后全量数据 =====================
const filteredClubs = computed(() => {
  let list = [...clubs.value];

  if (activeMajor.value !== "all") {
    list = list.filter((c) => c.super_club === activeMajor.value);
  }

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.club_name.toLowerCase().includes(kw) ||
        c.description.toLowerCase().includes(kw),
    );
  }

  if (sortMode.value === "asc") {
    list.sort((a, b) => a.remaining_quota - b.remaining_quota);
  } else if (sortMode.value === "desc") {
    list.sort((a, b) => b.remaining_quota - a.remaining_quota);
  }

  // 4. ✅ 收藏置顶（稳定排序，收藏内部保持原有顺序）
  list.sort((a, b) => {
    const aFav = favNames.value.includes(a.club_name) ? 0 : 1;
    const bFav = favNames.value.includes(b.club_name) ? 0 : 1;
    return aFav - bFav;
  });

  return list;
});

// ===================== 分页 =====================
const PAGE_SIZE = 10;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredClubs.value.length / PAGE_SIZE)),
);

const pagedClubs = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredClubs.value.slice(start, start + PAGE_SIZE);
});

// 筛选条件变化时重置到第 1 页
watch([keyword, activeMajor, sortMode], () => {
  currentPage.value = 1;
});

const onPageChange = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const onPrevPage = () => onPageChange(currentPage.value - 1);
const onNextPage = () => onPageChange(currentPage.value + 1);
</script>

<style lang="scss" scoped></style>
