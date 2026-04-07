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
import { ref, reactive, computed } from "vue";
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
import { useTimerStore } from "@/stores/timer"; // ✅ 引入 Timer Store
import { showToast } from "@/utils/toast";
import XModal from "@/components/XModal/index.vue";
import { showModal } from "@/composables/useModal";
import {
  modalState,
  _modalConfirm,
  _modalCancel,
} from "@/composables/useModal";

import { useThemeStore } from "@/stores/theme";

// ── 静态数据（后续替换为 store）──────────────────────────────
const profileStore = useProfileStore();
const profile = computed(() => profileStore.profile);
const wsStore = useWsStore();
const timerStore = useTimerStore(); // ✅ 获取 Timer Store

const showEdit = ref(false);
let timer = null;

async function refresh() {
  try {
    await profileApi.init();
  } catch (e) {
    console.error("[Profile] 刷新失败", e);
  }
}
// ===================== 生命周期 =====================
onLoad(async () => {
  await refresh();
  timer = setInterval(refresh, 3000);
});

onHide(() => {
  clearInterval(timer);
  timer = null;
});

onShow(async () => {
  await refresh();
  // 这一行很重要，防止定时器叠加
  clearInterval(timer);
  timer = setInterval(refresh, 3000);
});

onUnload(() => {
  clearInterval(timer);
  timer = null;
});

// ── 头像 ─────────────────────────────────────────────────────
const onChangeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    async success(res) {
      const tempPath = res.tempFilePaths[0];
      showToast({ title: "上传中...", icon: "loading" });

      // ✅ 封装成 Promise，才能被 await
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

        // ✅ 更新 store 里的头像
        profileStore.profile.avatar = data.data.avatar;
        showToast({ title: "头像更新成功", icon: "success" });
      } catch (err) {
        console.error(err);
        showToast({ title: "上传失败", icon: "error" });
      }
    },
  });
};

// ── 保存编辑 ─────────────────────────────────────────────────
const onSave = async (form) => {
  await profileApi.renewContact(form);
  showEdit.value = false;
  showToast({ title: "保存成功", icon: "success" });
};
// ── 退出社团 ─────────────────────────────────────────────────
const onQuitClub = () => {
  showModal({
    title: "退出确认",
    content: `确定要退出「${profile.value.selected_club_name}」吗？`,
    confirmText: "确定退出",
    confirmColor: "#ef4444",
    async success(res) {
      if (res.confirm) {
        await homeApi.quitClub();
        showToast({ title: "已退出社团", icon: "success" });
      }
    },
  });
};

// ── 退出登录 ─────────────────────────────────────────────────
const onLogout = () => {
  showModal({
    title: "退出登录",
    content: "确定要退出当前账号吗？",
    confirmText: "退出",
    confirmColor: "#ef4444",
    async success(res) {
      if (res.confirm) {
        await authApi.logout();
        timerStore.clearPageTimers("home");
        showToast({ title: "已退出登录", icon: "success" });
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
