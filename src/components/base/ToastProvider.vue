<template>
  <!-- 遮罩 -->
  <view v-if="state.visible && state.mask" class="toast-mask" />

  <!-- ✅ wrap 去掉动画 class，只保留定位 -->
  <view v-if="state.visible" class="toast-wrap">
    <!-- ✅ 动画 class 移到 card 上 -->
    <view
      class="toast-card"
      :class="[
        cardClass,
        state.animating ? 'toast-card--show' : 'toast-card--anim-hide',
      ]"
    >
      <!-- 流光 -->
      <view class="toast-glow" />

      <!-- 图标区 -->
      <view
        v-if="state.icon !== 'none'"
        class="toast-icon-wrap"
        :class="iconWrapClass"
      >
        <!-- success -->
        <view v-if="state.icon === 'success'" class="toast-icon">
          <view class="check-circle">
            <view class="check-line check-line--short" />
            <view class="check-line check-line--long" />
          </view>
        </view>
        <!-- error -->
        <view v-else-if="state.icon === 'error'" class="toast-icon">
          <view class="cross-circle">
            <view class="cross-line cross-line--1" />
            <view class="cross-line cross-line--2" />
          </view>
        </view>
        <!-- loading -->
        <view v-else-if="state.icon === 'loading'" class="toast-icon">
          <view class="loading-ring" />
        </view>
      </view>

      <!-- 文字 -->
      <text class="toast-title" :class="titleClass">{{ state.title }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { _toastState as state } from "@/utils/toast";

const cardClass = computed(() => ({
  "toast-card--success": state.value.icon === "success",
  "toast-card--error": state.value.icon === "error",
  "toast-card--loading": state.value.icon === "loading",
  "toast-card--none": state.value.icon === "none",
}));

const iconWrapClass = computed(() => ({
  "icon-wrap--success": state.value.icon === "success",
  "icon-wrap--error": state.value.icon === "error",
  "icon-wrap--loading": state.value.icon === "loading",
}));

const titleClass = computed(() => ({
  "toast-title--has-icon": state.value.icon !== "none",
}));
</script>

<style scoped>
/* ── 遮罩 ── */
.toast-mask {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: transparent;
}

/* ════════════════════════════════════════
   定位层：只负责位置，不做 opacity
════════════════════════════════════════ */
.toast-wrap {
  position: fixed;
  bottom: 130rpx;
  left: 50%;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  justify-content: center;
  /* ✅ 去掉 opacity，wrap 永远不透明 */
  transform: translateX(-50%);
}

/* ── 卡片主体：承担全部入出场动画 ── */
.toast-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
  min-width: 200rpx;
  max-width: 560rpx;
  padding: 36rpx 48rpx;
  border-radius: 20rpx;
  overflow: hidden;
  /* ✅ 背景始终是这个值，不会被外层 opacity 影响 */
  background: rgba(22, 32, 48, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1rpx solid rgba(255, 255, 255, 0.13);
  box-shadow:
    0 4rpx 24rpx rgba(0, 0, 0, 0.25),
    0 1rpx 4rpx rgba(0, 0, 0, 0.3),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.09);

  /* ✅ 动画状态放在 card 上：初始隐藏 */
  opacity: 0;
  transform: translateY(20rpx) scale(0.94);
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* none：横排 pill */
.toast-card--none {
  flex-direction: row;
  padding: 22rpx 40rpx;
  border-radius: 40rpx;
  gap: 14rpx;
}

/* success glow */
.toast-card--success {
  border-color: rgba(134, 239, 172, 0.18);
  box-shadow:
    0 4rpx 24rpx rgba(0, 0, 0, 0.25),
    0 0 24rpx rgba(34, 197, 94, 0.15),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.09);
}

/* error glow */
.toast-card--error {
  border-color: rgba(252, 165, 165, 0.18);
  box-shadow:
    0 4rpx 24rpx rgba(0, 0, 0, 0.25),
    0 0 24rpx rgba(239, 68, 68, 0.15),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.09);
}

/* loading glow */
.toast-card--loading {
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow:
    0 4rpx 24rpx rgba(0, 0, 0, 0.25),
    0 0 24rpx rgba(99, 102, 241, 0.2),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.09);
}

/* ✅ 入场：class 加在 card 上 */
.toast-card--show {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition:
    opacity 0.36s cubic-bezier(0.21, 1.02, 0.73, 1),
    transform 0.36s cubic-bezier(0.21, 1.02, 0.73, 1);
}

/* ✅ 出场：class 加在 card 上 */
.toast-card--anim-hide {
  opacity: 0;
  transform: translateY(16rpx) scale(0.94);
  transition:
    opacity 0.28s cubic-bezier(0.4, 0, 1, 1),
    transform 0.28s cubic-bezier(0.4, 0, 1, 1);
}

/* ── 流光 ── */
.toast-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 100%
  );
  /* ✅ 用 transform 替代 left 动画，GPU 合成层，小程序兼容 */
  transform: translateX(-150%);
  animation: glow-sweep 3.5s ease-in-out infinite;
}
@keyframes glow-sweep {
  0% {
    transform: translateX(-150%);
  }
  60%,
  100% {
    transform: translateX(250%);
  }
}

/* ── 图标容器 ── */
.toast-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-wrap--success {
  background: rgba(34, 197, 94, 0.15);
  border: 1rpx solid rgba(34, 197, 94, 0.3);
}
.icon-wrap--error {
  background: rgba(239, 68, 68, 0.15);
  border: 1rpx solid rgba(239, 68, 68, 0.3);
}
.icon-wrap--loading {
  background: rgba(99, 102, 241, 0.15);
  border: 1rpx solid rgba(99, 102, 241, 0.3);
}

/* ════════════════════════════════════════
   success 对勾
════════════════════════════════════════ */
.check-circle {
  position: relative;
  width: 44rpx;
  height: 44rpx;
}
.check-line {
  position: absolute;
  background: #86efac;
  border-radius: 3rpx;
  opacity: 0;
  transform-origin: left center;
}
.check-line--short {
  width: 16rpx;
  height: 4rpx;
  left: 6rpx;
  top: 26rpx;
  animation: check-draw-short 0.25s ease 0.1s forwards;
}
.check-line--long {
  width: 26rpx;
  height: 4rpx;
  left: 17rpx;
  top: 35rpx;
  animation: check-draw-long 0.28s ease 0.22s forwards;
}
@keyframes check-draw-short {
  from {
    opacity: 0;
    transform: rotate(45deg) scaleX(0);
  }
  to {
    opacity: 1;
    transform: rotate(45deg) scaleX(1);
  }
}
@keyframes check-draw-long {
  from {
    opacity: 0;
    transform: rotate(-45deg) scaleX(0);
  }
  to {
    opacity: 1;
    transform: rotate(-45deg) scaleX(1);
  }
}

/* ════════════════════════════════════════
   error 叉号
════════════════════════════════════════ */
.cross-circle {
  position: relative;
  width: 44rpx;
  height: 44rpx;
}
.cross-line {
  position: absolute;
  width: 40rpx;
  height: 4rpx;
  background: #fca5a5;
  border-radius: 4rpx;
  top: 50%;
  left: 50%;
  opacity: 0;
}
.cross-line--1 {
  animation: cross-draw-1 0.25s ease 0.08s forwards;
}
.cross-line--2 {
  animation: cross-draw-2 0.25s ease 0.18s forwards;
}
@keyframes cross-draw-1 {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(45deg) scaleX(0);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(45deg) scaleX(1);
  }
}
@keyframes cross-draw-2 {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(-45deg) scaleX(0);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(-45deg) scaleX(1);
  }
}

/* ── loading 转圈 ── */
.loading-ring {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(99, 102, 241, 0.2);
  border-top-color: #818cf8;
  animation: spin 0.75s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ── 文字 ── */
.toast-title {
  font-size: 28rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.5rpx;
  text-align: center;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  z-index: 1;
}
.toast-title--has-icon {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.72);
}
</style>
