<template>
  <view :class="`page ${useThemeStore().getCurrentTheme}`">
    <ToastProvider />
    <XModal
      v-bind="modalState"
      @confirm="_modalConfirm"
      @cancel="_modalCancel"
    />
    <scroll-view class="page__scroll" scroll-y>
      <ProfileHeader
        :profile="profile"
        @edit="showEdit = true"
        @change-avatar="onChangeAvatar"
      />
      <ProfileBody
        :profile="profile"
        @logout="onLogout"
        @quit-club="onQuitClub"
      />
      <view class="scroll-safe" />
    </scroll-view>

    <Footer />
    <ProfileEditModal
      v-if="showEdit"
      :profile="profile"
      @close="showEdit = false"
      @save="onSave"
    />
  </view>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import ToastProvider from "@/components/base/ToastProvider.vue";
import ProfileHeader from "./components/ProfileHeader.vue";
import ProfileBody from "./components/ProfileBody.vue";
import ProfileEditModal from "./components/ProfileEditModal.vue";
import Footer from "@/components/base/Footer.vue";
import { authApi } from "@/api/auth";
import { profileApi } from "@/api/profile";
import { useProfileStore } from "@/stores/profile";
import { onLoad, onUnload, onHide, onShow } from "@dcloudio/uni-app";
import { BASE_URL } from "@/utils/request";
import { homeApi } from "@/api/home";
import { useWsStore } from "@/stores/wsStore";
import { useTimerStore } from "@/stores/timer";
import { showToast } from "@/utils/toast";
import XModal from "@/components/XModal/index.vue";
import {
  showModal,
  modalState,
  _modalConfirm,
  _modalCancel,
} from "@/composables/useModal";
import { useThemeStore } from "@/stores/theme";

// ========== Store 初始化 ==========
const profileStore = useProfileStore();
const wsStore = useWsStore();
const timerStore = useTimerStore();
const themeStore = useThemeStore();

// ========== 响应式数据 ==========
const profile = computed(() => profileStore.profile);
const showEdit = ref(false);

// ========== 常量配置 ==========
const PAGE_ID = "profile";
const REFRESH_TIMER_ID = "refresh";
const REFRESH_DELAY = 3000;

// ========== 工具函数 ==========
/**
 * 刷新个人信息
 */
async function refresh() {
  try {
    await profileApi.init();
  } catch (e) {
    console.error("[Profile] 刷新失败", e);
  }
}

/**
 * 启动定时器
 */
function startRefreshTimer() {
  timerStore.createTimer(PAGE_ID, REFRESH_TIMER_ID, refresh, REFRESH_DELAY);
  console.log(
    `[Profile] 启动定时器，当前活跃数: ${timerStore.getActiveTimerCount()}`,
  );
}

/**
 * 停止定时器
 */
function stopRefreshTimer() {
  timerStore.clearTimer(PAGE_ID, REFRESH_TIMER_ID);
  console.log(
    `[Profile] 停止定时器，当前活跃数: ${timerStore.getActiveTimerCount()}`,
  );
}

// ========== 生命周期 ==========

/**
 * 页面加载
 */
onLoad(async () => {
  console.log("[Profile] 页面加载");
  await refresh();
  startRefreshTimer();
});

/**
 * 页面显示（从后台返回）
 */
onShow(async () => {
  console.log("[Profile] 页面显示");
  await refresh();
  startRefreshTimer();
});

/**
 * 页面隐藏（进入后台）
 */
onHide(() => {
  console.log("[Profile] 页面隐藏");
  stopRefreshTimer();
});

/**
 * 页面卸载（离开页面）
 */
onUnload(() => {
  console.log("[Profile] 页面卸载");
  stopRefreshTimer();
  timerStore.clearPageTimers(PAGE_ID);
});

/**
 * 组件卸载前
 */
onBeforeUnmount(() => {
  timerStore.clearPageTimers(PAGE_ID);
});

// ========== 事件处理 ==========

/**
 * 更改头像
 */
const onChangeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    async success(res) {
      const tempPath = res.tempFilePaths[0];
      showToast({ title: "上传中...", icon: "loading" });

      // 封装成Promise
      const uploadFile = (options) =>
        new Promise((resolve, reject) => {
          uni.uploadFile({
            ...options,
            success: resolve,
            fail: reject,
          });
        });

      try {
        const uploadRes = await uploadFile({
          url: `${BASE_URL}/student/avatar`,
          filePath: tempPath,
          name: "file",
          header: {
            Authorization: `Bearer ${uni.getStorageSync("token")}`,
          },
        });

        const data = JSON.parse(uploadRes.data);
        profileStore.profile.avatar = data.data.avatar;
        showToast({ title: "头像更新成功", icon: "success" });
      } catch (err) {
        console.error("[Profile] 上传失败", err);
        showToast({ title: "上传失败", icon: "error" });
      }
    },
  });
};

/**
 * 保存编辑
 */
const onSave = async (form) => {
  try {
    await profileApi.renewContact(form);
    showEdit.value = false;
    showToast({ title: "保存成功", icon: "success" });
    await refresh();
  } catch (e) {
    console.error("[Profile] 保存失败", e);
    showToast({ title: "保存失败", icon: "error" });
  }
};

/**
 * 退出社团
 */
const onQuitClub = () => {
  showModal({
    title: "退出确认",
    content: `确定要退出「${profile.value.selected_club_name}」吗？`,
    confirmText: "确定退出",
    confirmColor: "#ef4444",
    async success(res) {
      if (res.confirm) {
        try {
          await homeApi.quitClub();
          showToast({ title: "已退出社团", icon: "success" });
          await refresh();
        } catch (e) {
          console.error("[Profile] 退出失败", e);
          showToast({ title: "退出失败", icon: "error" });
        }
      }
    },
  });
};

/**
 * 退出登录
 */
const onLogout = () => {
  showModal({
    title: "退出登录",
    content: "确定要退出当前账号吗？",
    confirmText: "退出",
    confirmColor: "#ef4444",
    async success(res) {
      if (res.confirm) {
        try {
          await authApi.logout();
          timerStore.clearAllTimers();
          showToast({ title: "已退出登录", icon: "success" });
        } catch (e) {
          console.error("[Profile] 登出失败", e);
          showToast({ title: "登出失败", icon: "error" });
        }
      }
    },
  });
};
</script>

<style scoped lang="scss">
@import "@/styles/themes.scss";
.page {
  width: 100%;
  height: 100vh;
  @include theme-aware(background-color, semantic, bg-canvas);

  display: flex;
  flex-direction: column;
}
.page__scroll {
  width: 100%;
  height: calc(100vh - 55px - env(safe-area-inset-bottom, 0px));
}
.scroll-safe {
  height: 48rpx;
}
</style>
