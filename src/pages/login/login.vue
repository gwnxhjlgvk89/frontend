<template>
  <view>
    <ToastProvider />
    <login-container>
      <template #header>
        <LoginHeader
          :title="
            activeView === LOGIN_VIEWS.LOGIN ? '请登录你的账号' : '重置密码'
          "
        />
      </template>
      <template #body>
        <view class="card-switcher">
          <!-- 用 animated-class 控制显隐动画 -->
          <!-- vue的transition在小程序里不支持 -->
          <view
            :class="[
              'card-wrap',
              isVisible ? 'card-wrap--in' : 'card-wrap--out',
            ]"
          >
            <LoginCard
              v-if="activeView === LOGIN_VIEWS.LOGIN"
              @login-google="onLoginGoogle"
              @login-wechat="onLoginWeChat"
            />
            <ResetCard v-else-if="activeView === LOGIN_VIEWS.RESET" />
            <FirstLoginResetCard
              v-else-if="activeView === LOGIN_VIEWS.FIRST_RESET"
            />
          </view>
        </view>
      </template>
      <template #footer>
        <LoginFooter />
      </template>
    </login-container>
  </view>
</template>

<script setup>
import LoginContainer from "@/components/layout/LoginContainer.vue";
import LoginHeader from "./components/LoginHeader.vue";
import LoginCard from "./components/LoginCard.vue";
import FirstLoginResetCard from "./components/FirstLoginResetCard.vue";
import ResetCard from "./components/ResetCard.vue";
import LoginFooter from "./components/LoginFooter.vue";
import { reactive, ref, watch, onUnmounted } from "vue";
import ToastProvider from "@/components/base/ToastProvider.vue";
import { showToast, hideToast } from "@/utils/toast";
import { storeToRefs } from "pinia";
import { loginCardStore } from "@/stores/loginCardStore.js";

const cardStore = loginCardStore();
const { currentView } = storeToRefs(cardStore);

const { LOGIN_VIEWS } = cardStore;

// ── 动画控制 ───────────────────────────────────────────────
/** 实际渲染的视图（动画结束后才切换） */
const activeView = ref(currentView.value);
/** 控制 CSS 类，驱动淡入淡出 */
const isVisible = ref(true);

function onShareAppMessage() {
  return {
    title: "加入我们的社团平台",
    path: "/pages/login/index", // 修改为你的登录页路径
    imageUrl: "", // 可选：自定义分享图片 URL
  };
}

watch(currentView, (newView) => {
  // 1. 触发离场动画（淡出 + 上移）
  isVisible.value = false;

  // 2. 等离场动画结束（200ms）后切换内容，再触发入场动画
  setTimeout(() => {
    activeView.value = newView;
    isVisible.value = true;
  }, 300); // 与 CSS transition 时长保持一致
});

function onLoginGoogle() {
  showToast({ title: "谷歌登录暂不支持", icon: "error" });
}

function onLoginWeChat() {
  showToast({ title: "微信登录暂不支持", icon: "error" });
}

onUnmounted(() => {
  // 离开登录页时重置视图状态
  cardStore.resetView();
});
</script>

<style lang="scss" scoped>
/* ── 页面级样式 ───────────────────────────────────────────── */
.card-switcher {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16rpx;
}

.card-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  // 声明需要过渡的属性
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

// ── 入场状态 ───────────────────────────────────────────────
.card-wrap--in {
  opacity: 1;
  transform: translateY(0);
}

// ── 离场状态 ───────────────────────────────────────────────
.card-wrap--out {
  opacity: 0;
  transform: translateY(16rpx);
}
</style>
