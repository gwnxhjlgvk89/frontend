<template>
  <view class="home-container">
    <!-- Header -->
    <view class="home-header">
      <slot name="header" />
    </view>

    <!-- Body -->
    <scroll-view
      class="home-body"
      scroll-y
      enhanced
      :show-scrollbar="false"
      :style="{ paddingLeft: bodyPadding, paddingRight: bodyPadding }"
    >
      <view style="height: 24rpx" />
      <slot />
      <view style="height: 32rpx" />
    </scroll-view>

    <!-- Footer -->
    <view class="home-footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup>
defineProps({
  bodyPadding: { type: String, default: "24rpx" },
});
</script>

<style scoped>
/* ── 整体容器 ── */
.home-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #0f172a;
  box-sizing: border-box;
}

/* ── Header ── */
.home-header {
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4rpx 24rpx rgba(0, 0, 0, 0.3),
    0 1rpx 0 rgba(99, 102, 241, 0.2);
}

/* ── Body：渐变动效主角 ── */
.home-body {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;

  /* 
   * 把 4 个色标拉很开，每帧 background-position 移动
   * 视觉上就像渐变在缓慢流动
   */
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1a1040 20%,
    /* 深紫 */ #0f172a 35%,
    #0d1f3c 50%,
    /* 深蓝 */ #0f172a 65%,
    #1a0f2e 80%,
    /* 暗紫 */ #0f172a 100%
  );
  background-size: 400% 400%; /* 拉大画布，给位移留空间 */
  animation: bg-shift 12s ease-in-out infinite;
}

@keyframes bg-shift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* ── Footer ── */
.home-footer {
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1rpx solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 -4rpx 24rpx rgba(0, 0, 0, 0.3),
    0 -1rpx 0 rgba(99, 102, 241, 0.2);
}
</style>
