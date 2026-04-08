<template>
  <view class="club-item">
    <!-- 背景光晕效果 -->
    <view class="club-glow" />

    <!-- 主容器 -->
    <view class="club-container">
      <!-- 左侧装饰条 -->
      <view class="club-accent" />

      <!-- 内容区域 -->
      <view class="club-content">
        <!-- 标题区 -->
        <view class="club-header">
          <view class="title-wrapper">
            <text class="club-icon">🏢</text>
            <text class="club-name">{{ club.club_name }}</text>
          </view>
          <view class="badges-wrapper">
            <view class="badge" :class="`badge--${getStatusClass}`">
              <text class="badge-icon">{{ getStatusIcon }}</text>
              <text class="badge-text">{{ getStatusText }}</text>
            </view>
            <view v-if="club.has_major_limit" class="badge badge--limit">
              <text class="badge-icon">🎯</text>
              <text class="badge-text">专业限</text>
            </view>
          </view>
        </view>

        <!-- 信息网格 -->
        <view class="club-info-grid">
          <view class="info-card">
            <text class="info-label">👨‍🏫 指导老师</text>
            <text class="info-value">{{ club.teacher_advisor || "暂无" }}</text>
          </view>
          <view class="info-card">
            <text class="info-label">👤 社长</text>
            <text class="info-value">{{ club.club_president || "暂无" }}</text>
          </view>
        </view>

        <!-- 配额显示 -->
        <view class="club-quota-section">
          <view class="quota-header">
            <text class="quota-label">招募进度</text>
            <text class="quota-percentage">{{ quotaPercent }}%</text>
          </view>
          <view class="quota-bar-container">
            <view class="quota-bar">
              <view
                class="quota-fill"
                :style="{ width: quotaPercent + '%' }"
                :class="{ 'quota-fill--full': quotaPercent >= 100 }"
              />
            </view>
          </view>
          <view class="quota-info">
            <text class="quota-count">
              已招募:
              <text class="count-highlight">{{
                club.total_quota - club.remaining_quota
              }}</text>
              / {{ club.total_quota }}
            </text>
            <text class="quota-remaining">
              还需:
              <text class="remaining-highlight">{{
                club.remaining_quota
              }}</text>
            </text>
          </view>
        </view>
      </view>

      <!-- 操作按钮区 -->
      <view class="club-actions" v-if="adminRole === 2">
        <view class="action-btn btn-edit" @click="$emit('edit')" title="编辑">
          <text class="action-icon">✎</text>
        </view>
        <view class="action-divider" />
        <view
          class="action-btn btn-delete"
          @click="$emit('delete')"
          title="删除"
        >
          <text class="action-icon">🗑</text>
        </view>
      </view>
    </view>

    <!-- 悬停动画层 -->
    <view class="club-hover-effect" />
  </view>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  club: {
    type: Object,
    required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
});

const adminRole = ref(props.role);

defineEmits(["edit", "delete"]);

// ── 计算配额百分比 ──
const quotaPercent = computed(() => {
  if (props.club.total_quota === 0) return 0;
  return Math.round(
    ((props.club.total_quota - props.club.remaining_quota) /
      props.club.total_quota) *
      100,
  );
});

// ── 状态文本 ──
const getStatusText = computed(() => {
  const map = {
    0: "未开放",
    1: "招募中",
    2: "已满员",
    3: "已结束",
  };
  return map[props.club.club_status] || "未知";
});

// ── 状态图标 ──
const getStatusIcon = computed(() => {
  const map = {
    0: "🔒",
    1: "🔓",
    2: "✅",
    3: "🏁",
  };
  return map[props.club.club_status] || "❓";
});

// ── 状态样式类 ──
const getStatusClass = computed(() => {
  const map = {
    0: "default",
    1: "success",
    2: "danger",
    3: "warning",
  };
  return map[props.club.club_status] || "default";
});
</script>

<style scoped>
/* ════════════════════════════════════════
   容器层级
════════════════════════════════════════ */
.club-item {
  position: relative;
  width: 100%;
  margin-bottom: 16rpx;
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ════════════════════════════════════════
   光晕背景效果
════════════════════════════════════════ */
.club-glow {
  position: absolute;
  inset: -8rpx;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 50%,
    transparent 100%
  );
  border-radius: 20rpx;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* ════════════════════════════════════════
   主容器
════════════════════════════════════════ */
.club-container {
  position: relative;
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.06) 0%,
    rgba(139, 92, 246, 0.04) 50%,
    rgba(59, 130, 246, 0.03) 100%
  );
  border: 1rpx solid rgba(99, 102, 241, 0.15);
  border-radius: 20rpx;
  backdrop-filter: blur(10px);
  box-shadow:
    0 4rpx 12rpx rgba(0, 0, 0, 0.1),
    0 0 1rpx rgba(99, 102, 241, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.club-item:hover .club-container {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.12) 0%,
    rgba(139, 92, 246, 0.08) 50%,
    rgba(59, 130, 246, 0.06) 100%
  );
  border-color: rgba(99, 102, 241, 0.25);
  box-shadow:
    0 12rpx 32rpx rgba(99, 102, 241, 0.15),
    0 0 1rpx rgba(99, 102, 241, 0.2),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.08);
}

.club-item:hover .club-glow {
  opacity: 1;
}

/* ════════════════════════════════════════
   左侧装饰条
════════════════════════════════════════ */
.club-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4rpx;
  background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  border-radius: 20rpx 0 0 20rpx;
  box-shadow: 2rpx 0 8rpx rgba(99, 102, 241, 0.3);
}

/* ════════════════════════════════════════
   内容区域
════════════════════════════════════════ */
.club-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  min-width: 0;
}

/* ════════════════════════════════════════
   标题区
════════════════════════════════════════ */
.club-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12rpx;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex: 1;
  min-width: 0;
}

.club-icon {
  font-size: 28rpx;
  flex-shrink: 0;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4rpx);
  }
}

.club-name {
  font-size: 26rpx;
  font-weight: 700;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: linear-gradient(135deg, #ffffff, #a5f3fc);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ════════════════════════════════════════
   徽章区
════════════════════════════════════════ */
.badges-wrapper {
  display: flex;
  gap: 8rpx;
  flex-shrink: 0;
}

.badge {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-size: 14rpx;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  border: 1rpx solid;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.badge-icon {
  font-size: 16rpx;
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.badge-text {
  letter-spacing: 0.5rpx;
}

.badge--default {
  background: rgba(107, 114, 128, 0.15);
  border-color: rgba(107, 114, 128, 0.3);
  color: #d1d5db;
}

.badge--success {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
  color: #86efac;
  box-shadow: 0 0 12rpx rgba(34, 197, 94, 0.2);
}

.badge--danger {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  box-shadow: 0 0 12rpx rgba(239, 68, 68, 0.2);
}

.badge--warning {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
  color: #fde68a;
  box-shadow: 0 0 12rpx rgba(251, 191, 36, 0.2);
}

.badge--limit {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: #c4b5fd;
  box-shadow: 0 0 12rpx rgba(99, 102, 241, 0.2);
}

.badge:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.2);
}

/* ════════════════════════════════════════
   信息网格
════════════════════════════════════════ */
.club-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  padding: 12rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
  transform: translateY(-2rpx);
}

.info-label {
  font-size: 14rpx;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5rpx;
}

.info-value {
  font-size: 18rpx;
  color: #a5f3fc;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ════════════════════════════════════════
   配额部分
════════════════════════════════════════ */
.club-quota-section {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 14rpx;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.08) 0%,
    rgba(59, 130, 246, 0.05) 100%
  );
  border: 1rpx solid rgba(99, 102, 241, 0.15);
  border-radius: 12rpx;
}

.quota-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quota-label {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.quota-percentage {
  font-size: 20rpx;
  font-weight: 700;
  color: #6366f1;
  animation: countUp 0.6s ease-out;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.quota-bar-container {
  overflow: hidden;
  border-radius: 8rpx;
}

.quota-bar {
  width: 100%;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  overflow: hidden;
  position: relative;
}

.quota-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  border-radius: 8rpx;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 12rpx rgba(99, 102, 241, 0.4);
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    box-shadow: 0 0 12rpx rgba(99, 102, 241, 0.4);
  }
  50% {
    box-shadow: 0 0 20rpx rgba(99, 102, 241, 0.6);
  }
}

.quota-fill--full {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  box-shadow: 0 0 12rpx rgba(16, 185, 129, 0.4);
}

.quota-info {
  display: flex;
  justify-content: space-between;
  font-size: 14rpx;
  color: rgba(255, 255, 255, 0.5);
}

.count-highlight {
  color: #10b981;
  font-weight: 700;
}

.remaining-highlight {
  color: #f59e0b;
  font-weight: 700;
}

/* ════════════════════════════════════════
   操作按钮
════════════════════════════════════════ */
.club-actions {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.action-btn {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20rpx;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-icon {
  display: inline-block;
  animation: iconIdle 2s ease-in-out infinite;
}

@keyframes iconIdle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.btn-edit {
  color: #60a5fa;
}

.btn-edit:hover {
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.2),
    rgba(96, 165, 250, 0.1)
  );
  border-color: rgba(96, 165, 250, 0.3);
}

.btn-delete {
  color: #f87171;
}

.btn-delete:hover {
  background: linear-gradient(
    135deg,
    rgba(248, 113, 113, 0.2),
    rgba(248, 113, 113, 0.1)
  );
  border-color: rgba(248, 113, 113, 0.3);
}

.action-divider {
  width: 1rpx;
  height: 24rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rpx;
}

/* ════════════════════════════════════════
   悬停效果层
════════════════════════════════════════ */
.club-hover-effect {
  position: absolute;
  inset: 0;
  border-radius: 20rpx;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.club-item:hover .club-hover-effect {
  opacity: 1;
}
</style>
