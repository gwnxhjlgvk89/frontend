<template>
  <view v-if="visible" class="modal-root">
    <!-- 遮罩 -->
    <view class="modal-mask" :class="maskClass" @click="onMaskClick" />

    <!-- 弹窗卡片 -->
    <view class="modal-wrap">
      <view class="modal-card" :class="cardClass">
        <!-- 顶部装饰光晕 -->
        <view class="modal-card__halo" />

        <!-- 流光 -->
        <view class="modal-card__glow" />

        <!-- 图标区 -->
        <view class="modal-icon-wrap">
          <text class="modal-icon">{{ resolvedIcon }}</text>
        </view>

        <!-- 标题 -->
        <text class="modal-title">{{ title }}</text>

        <!-- 内容 -->
        <text v-if="content" class="modal-content">{{ content }}</text>

        <!-- 分割线 -->
        <view class="modal-divider" />

        <!-- 按钮区 -->
        <view
          class="modal-btns"
          :class="{ 'modal-btns--vertical': !showCancel }"
        >
          <!-- 取消 -->
          <view
            v-if="showCancel"
            class="modal-btn modal-btn--cancel"
            hover-class="modal-btn--cancel-hover"
            @click="onCancel"
          >
            <text class="modal-btn__text modal-btn__text--cancel">
              {{ cancelText }}
            </text>
          </view>

          <!-- 竖向分割 -->
          <view v-if="showCancel" class="modal-btn-sep" />

          <!-- 确认 -->
          <view
            class="modal-btn modal-btn--confirm"
            hover-class="modal-btn--confirm-hover"
            @click="onConfirm"
          >
            <view class="modal-btn__glow" />
            <text
              class="modal-btn__text modal-btn__text--confirm"
              :style="confirmColor ? { color: confirmColor } : {}"
            >
              {{ confirmText }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "提示" },
  content: { type: String, default: "" },
  showCancel: { type: Boolean, default: true },
  cancelText: { type: String, default: "取消" },
  confirmText: { type: String, default: "确定" },
  confirmColor: { type: String, default: "" },
  maskClosable: { type: Boolean, default: false },
  icon: { type: String, default: "auto" },
  // auto | warn | info | danger | success | none
});

const emit = defineEmits(["confirm", "cancel", "close"]);

// ── 动画状态 ───────────────────────────────────────────────
const animating = ref(false);
const hiding = ref(false);

watch(
  () => props.visible,
  (val) => {
    if (val) {
      hiding.value = false;
      animating.value = false;
      // 下一帧触发入场动画
      setTimeout(() => (animating.value = true), 30);
    }
  },
);

const maskClass = computed(() => ({
  "modal-mask--in": animating.value && !hiding.value,
  "modal-mask--out": hiding.value,
}));

const cardClass = computed(() => ({
  "modal-card--in": animating.value && !hiding.value,
  "modal-card--out": hiding.value,
}));

// ── 图标自动推断 ───────────────────────────────────────────
const resolvedIcon = computed(() => {
  if (props.icon !== "auto") {
    const map = {
      warn: "⚠️",
      info: "ℹ️",
      danger: "🗑️",
      success: "✅",
      none: "",
    };
    return map[props.icon] ?? props.icon;
  }
  // 根据 confirmColor 自动判断
  if (props.confirmColor === "#ef4444" || props.confirmColor === "#f87171")
    return "⚠️";
  return "💬";
});

// ── 关闭动画 ───────────────────────────────────────────────
const closeWithAnim = (cb) => {
  hiding.value = true;
  setTimeout(() => {
    hiding.value = false;
    animating.value = false;
    cb?.();
  }, 260);
};

const onConfirm = () => closeWithAnim(() => emit("confirm"));

const onCancel = () => closeWithAnim(() => emit("cancel"));

const onMaskClick = () => {
  if (!props.maskClosable) return;
  closeWithAnim(() => emit("cancel"));
};
</script>

<style scoped>
/* ── 根层：全屏覆盖 ── */
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── 遮罩 ── */
.modal-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.28s ease;
}
.modal-mask--in {
  background: rgba(0, 0, 0, 0.6);
}
.modal-mask--out {
  background: rgba(0, 0, 0, 0);
  transition: background 0.22s ease;
}

/* ── 定位层 ── */
.modal-wrap {
  position: relative;
  z-index: 1;
  width: 580rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
}

/* ── 卡片 ── */
.modal-card {
  position: relative;
  width: 100%;
  border-radius: 32rpx;
  overflow: hidden;
  background: rgba(22, 32, 48, 0.92);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 32rpx 80rpx rgba(0, 0, 0, 0.55),
    0 8rpx 24rpx rgba(0, 0, 0, 0.35),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);

  /* 初始态：缩小 + 透明 */
  opacity: 0;
  transform: scale(0.88) translateY(24rpx);
  transition:
    opacity 0.32s cubic-bezier(0.21, 1.02, 0.73, 1),
    transform 0.32s cubic-bezier(0.21, 1.02, 0.73, 1);
}

/* 入场 */
.modal-card--in {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 出场 */
.modal-card--out {
  opacity: 0;
  transform: scale(0.92) translateY(16rpx);
  transition:
    opacity 0.22s cubic-bezier(0.4, 0, 1, 1),
    transform 0.22s cubic-bezier(0.4, 0, 1, 1);
}

/* ── 顶部光晕 ── */
.modal-card__halo {
  position: absolute;
  top: -60rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 300rpx;
  height: 160rpx;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(99, 102, 241, 0.35) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* ── 流光 ── */
.modal-card__glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 100%
  );
  transform: translateX(-150%);
  animation: glow-sweep 4s ease-in-out infinite;
  pointer-events: none;
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

/* ── 图标 ── */
.modal-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 48rpx;
  padding-bottom: 8rpx;
}
.modal-icon {
  font-size: 72rpx;
  animation: icon-bounce 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) 0.15s both;
}
@keyframes icon-bounce {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* ── 标题 ── */
.modal-title {
  display: block;
  text-align: center;
  font-size: 34rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 1rpx;
  padding: 12rpx 40rpx 0;
}

/* ── 内容 ── */
.modal-content {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  padding: 16rpx 48rpx 0;
  word-break: break-all;
}

/* ── 分割线 ── */
.modal-divider {
  margin: 40rpx 0 0;
  height: 1rpx;
  background: rgba(255, 255, 255, 0.08);
}

/* ── 按钮区 ── */
.modal-btns {
  display: flex;
  flex-direction: row;
  height: 100rpx;
}

/* ── 按钮竖向分割线 ── */
.modal-btn-sep {
  width: 1rpx;
  background: rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

/* ── 按钮基础 ── */
.modal-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: background 0.15s ease;
}

/* ── 取消按钮 ── */
.modal-btn--cancel-hover {
  background: rgba(255, 255, 255, 0.06);
}
.modal-btn__text--cancel {
  font-size: 30rpx;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
}

/* ── 确认按钮 ── */
.modal-btn--confirm {
  position: relative;
}
.modal-btn--confirm-hover {
  background: rgba(255, 255, 255, 0.06);
}
.modal-btn__text--confirm {
  font-size: 30rpx;
  font-weight: 700;
  color: #818cf8;
  z-index: 1;
}

/* 确认按钮流光 */
.modal-btn__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(129, 140, 248, 0.07) 50%,
    transparent 100%
  );
  transform: translateX(-150%);
  animation: glow-sweep 3s ease-in-out infinite 0.6s;
}
</style>
