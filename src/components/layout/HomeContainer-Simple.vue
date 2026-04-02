<!-- components/layout/HomeContainer.vue -->
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
      <!-- 顶部留白，避免紧贴 header -->
      <view style="height: 24rpx" />

      <slot />

      <!-- 底部留白，避免内容被 footer 遮住 -->
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
  /* 与卡片背景色统一 */
  background-color: #0f172a;
  box-sizing: border-box;
}

/* ── Header ── */
.home-header {
  flex-shrink: 0;
  z-index: 100;

  /* 毛玻璃效果，与深色背景融合 */
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  /* 底部用渐变线代替生硬的 box-shadow */
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.3);
}

/* ── Body ── */
.home-body {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

/* ── Footer ── */
.home-footer {
  flex-shrink: 0;
  z-index: 100;

  /* 与 header 对称，顶部渐变线 */
  border-top: 1rpx solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.3);

  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
