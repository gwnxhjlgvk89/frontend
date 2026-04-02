<template>
  <view class="footer-wrap">
    <view class="footer-bar">
      <view
        v-for="item in tabs"
        :key="item.name"
        class="tab-item"
        :class="{ active: current === item.name }"
        @click="switchTab(item)"
      >
        <!-- 激活背景胶囊 -->
        <view class="tab-pill" />

        <!-- 图标：用 image 加载 png -->
        <image
          class="tab-icon"
          :src="current === item.name ? item.activeIcon : item.icon"
          mode="aspectFit"
        />

        <!-- 文字 -->
        <text class="tab-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 底部安全区 -->
    <view class="safe-area" />
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import cdn from "@/utils/cdn";
import { loginCardStore } from "@/stores/loginCardStore";

const cardStore = loginCardStore();

const tabs = [
  {
    name: "home",
    label: "首页",
    path:
      cardStore.identity === "student"
        ? "/pages/home/home"
        : "/pages/admin/admin",
    icon: cdn.home,
    activeIcon: cdn.home,
  },
  {
    name: "profile",
    label: "我的",
    path: "/pages/profile/profile",
    icon: cdn.profile,
    activeIcon: cdn.profile,
  },
];

// ✅ 初始化时就读路由，不写死 "home"，彻底消除初始帧闪烁
function getCurrentTab() {
  const pages = getCurrentPages();
  const route = pages[pages.length - 1]?.route || "";
  return tabs.find((t) => route.includes(t.name))?.name ?? "home";
}

const current = ref(getCurrentTab()); // ← 关键改动

// onShow 保留，处理 switchTab 返回时的状态同步
onShow(() => {
  current.value = getCurrentTab();
});

function switchTab(item) {
  if (current.value === item.name) return;
  current.value = item.name;
  uni.switchTab({ url: item.path });
}
</script>

<style scoped>
.footer-wrap {
  /* 不用 fixed，跟随页面流 */
  width: 100%;
  background: #1e293b;
}

.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16rpx 20rpx 0;
  border-top: 1rpx solid #334155;
}

/* ── 每个 Tab ── */
.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 14rpx 0 10rpx;
  gap: 6rpx;
  transition: all 0.3s ease;
}

/* 激活胶囊背景 */
.tab-pill {
  position: absolute;
  top: 8rpx;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 120rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.45);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 0;
}

.tab-item.active .tab-pill {
  transform: translateX(-50%) scaleX(1);
}

/* ── 图标 ── */
.tab-icon {
  position: relative;
  z-index: 1;
  width: 44rpx;
  height: 44rpx;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab-item.active .tab-icon {
  transform: translateY(-4rpx) scale(1.1);
}

/* 未激活：半透明 */
.tab-icon {
  opacity: 0.4;
  transition:
    opacity 0.3s ease,
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 激活：完全不透明 */
.tab-item.active .tab-icon {
  opacity: 1;
  transform: translateY(-4rpx) scale(1.1);
}

/* ── 文字 ── */
.tab-label {
  position: relative;
  z-index: 1;
  font-size: 22rpx;
  font-weight: 500;
  color: #94a3b8;
  transition: color 0.3s ease;
  letter-spacing: 1rpx;
}

.tab-item.active .tab-label {
  color: #ffffff;
  font-weight: 700;
}

/* ── 底部安全区 ── */
.safe-area {
  height: env(safe-area-inset-bottom);
  background: #1e293b;
}
</style>
