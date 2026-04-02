<template>
  <view class="dialog-overlay" @click="handleBackdropClick">
    <view class="dialog-wrapper">
      <!-- ── Dialog 内容 ── -->
      <view class="dialog-content" @click.stop>
        <!-- ── Dialog Icon ── -->
        <view class="dialog-icon" :class="`dialog-icon--${type}`">
          <text>{{ typeIcon }}</text>
        </view>

        <!-- ── Dialog Header ── -->
        <view class="dialog-header">
          <text class="dialog-title">{{ title }}</text>
        </view>

        <!-- ── Dialog Body ── -->
        <view class="dialog-body">
          <text class="dialog-message">{{ message }}</text>
        </view>

        <!-- ── Dialog Actions ── -->
        <view class="dialog-actions">
          <button
            class="action-btn action-btn--cancel"
            :disabled="loading"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            class="action-btn action-btn--confirm"
            :class="{ 'action-btn--loading': loading }"
            :disabled="loading"
            @click="handleConfirm"
          >
            <text v-if="loading" class="btn-spinner">⟳</text>
            <text v-else>{{ confirmText }}</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  // 对话框类型：'confirm' | 'warning' | 'error' | 'success' | 'info'
  type: {
    type: String,
    default: "confirm",
    validator: (value) =>
      ["confirm", "warning", "error", "success", "info"].includes(value),
  },
  // 对话框标题
  title: {
    type: String,
    required: true,
  },
  // 对话框消息
  message: {
    type: String,
    required: true,
  },
  // 确认按钮文本
  confirmText: {
    type: String,
    default: "确认",
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: "取消",
  },
  // 是否显示加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 是否可以通过点击背景关闭
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
  // 是否显示取消按钮
  showCancel: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["confirm", "cancel"]);

// ── 计算属性 ──
const typeIcon = computed(() => {
  const icons = {
    confirm: "❓",
    warning: "⚠️",
    error: "✕",
    success: "✓",
    info: "ℹ️",
  };
  return icons[props.type] || "❓";
});

// ── 事件处理 ──
const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.loading) {
    emit("cancel");
  }
};
</script>

<style scoped>
/* ════════════════════════════════════════
   Dialog Overlay
════════════════════════════════════════ */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(4px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ════════════════════════════════════════
   Dialog Wrapper
════════════════════════════════════════ */
.dialog-wrapper {
  width: 100%;
  padding: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ════════════════════════════════════════
   Dialog Content
════════════════════════════════════════ */
.dialog-content {
  width: 100%;
  max-width: 560rpx;
  background: linear-gradient(135deg, #1a1f35 0%, #0f172a 100%);
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  padding: 32rpx 24rpx;
  animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 20rpx 64rpx rgba(0, 0, 0, 0.5);
  border: 1rpx solid rgba(99, 102, 241, 0.15);
  position: relative;
  overflow: hidden;
}

/* ── 背景装饰 ── */
.dialog-content::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.1) 0%,
    transparent 70%
  );
  animation: drift 6s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20rpx, -20rpx);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ════════════════════════════════════════
   Dialog Icon
════════════════════════════════════════ */
.dialog-icon {
  position: relative;
  z-index: 1;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  animation: bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-icon--confirm {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.25),
    rgba(139, 92, 246, 0.15)
  );
  border: 2rpx solid rgba(99, 102, 241, 0.4);
}

.dialog-icon--warning {
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.25),
    rgba(245, 158, 11, 0.15)
  );
  border: 2rpx solid rgba(251, 191, 36, 0.4);
}

.dialog-icon--error {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.25),
    rgba(220, 38, 38, 0.15)
  );
  border: 2rpx solid rgba(239, 68, 68, 0.4);
}

.dialog-icon--success {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.25),
    rgba(16, 185, 129, 0.15)
  );
  border: 2rpx solid rgba(34, 197, 94, 0.4);
}

.dialog-icon--info {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.25),
    rgba(37, 99, 235, 0.15)
  );
  border: 2rpx solid rgba(59, 130, 246, 0.4);
}

@keyframes bounce {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ════════════════════════════════════════
   Dialog Header
════════════════════════════════════════ */
.dialog-header {
  position: relative;
  z-index: 1;
  text-align: center;
}

.dialog-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.5rpx;
}

/* ════════════════════════════════════════
   Dialog Body
════════════════════════════════════════ */
.dialog-body {
  position: relative;
  z-index: 1;
  text-align: center;
}

.dialog-message {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
  letter-spacing: 0.3rpx;
  word-break: break-word;
}

/* ════════════════════════════════════════
   Dialog Actions
════════════════════════════════════════ */
.dialog-actions {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  gap: 12rpx;
  margin-top: 12rpx;
}

.action-btn {
  flex: 1;
  padding: 14rpx 20rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  white-space: nowrap;
  outline: none;
}

/* ── Cancel Button ── */
.action-btn--cancel {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
}

.action-btn--cancel:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1rpx);
}

.action-btn--cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Confirm Button ── */
.action-btn--confirm {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.3);
}

.action-btn--confirm:active:not(:disabled) {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 36rpx rgba(99, 102, 241, 0.4);
}

.action-btn--confirm:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.action-btn--loading {
  pointer-events: none;
}

.btn-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ════════════════════════════════════════
   Responsive
════════════════════════════════════════ */
@media (max-width: 600px) {
  .dialog-content {
    padding: 24rpx 16rpx;
    gap: 16rpx;
  }

  .dialog-icon {
    width: 64rpx;
    height: 64rpx;
    font-size: 32rpx;
  }

  .dialog-title {
    font-size: 24rpx;
  }

  .dialog-message {
    font-size: 18rpx;
  }

  .action-btn {
    font-size: 18rpx;
    padding: 12rpx 16rpx;
  }
}
</style>
