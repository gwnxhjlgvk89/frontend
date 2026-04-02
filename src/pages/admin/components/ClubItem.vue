<template>
  <view class="club-item">
    <view class="club-content">
      <view class="club-header">
        <text class="club-name">{{ club.club_name }}</text>
        <view class="badges">
          <view class="badge" :class="`badge--${getStatusClass}`">
            {{ getStatusText }}
          </view>
          <view v-if="club.has_major_limit" class="badge badge--limit">
            专业限
          </view>
        </view>
      </view>

      <view class="club-info">
        <text class="info-item">
          <text class="info-label">老师:</text>
          <text class="info-value">{{ club.teacher_advisor || "暂无" }}</text>
        </text>
        <text class="info-item">
          <text class="info-label">社长:</text>
          <text class="info-value">{{ club.club_president || "暂无" }}</text>
        </text>
      </view>

      <view class="club-quota">
        <view class="quota-bar">
          <view class="quota-fill" :style="{ width: quotaPercent + '%' }" />
        </view>
        <text class="quota-text">
          {{ club.total_quota - club.remaining_quota }}/{{ club.total_quota }}
        </text>
      </view>
    </view>

    <view class="club-actions">
      <text class="action-btn btn-edit" @click="$emit('edit')">✎</text>
      <text class="action-btn btn-delete" @click="$emit('delete')">🗑</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  club: {
    type: Object,
    required: true,
  },
});

defineEmits(["edit", "delete"]);

const quotaPercent = computed(() => {
  if (props.club.total_quota === 0) return 0;
  return Math.round(
    ((props.club.total_quota - props.club.remaining_quota) /
      props.club.total_quota) *
      100,
  );
});

const getStatusText = computed(() => {
  const map = {
    0: "未开放",
    1: "招募中",
    2: "已满员",
    3: "已结束",
  };
  return map[props.club.club_status] || "未知";
});

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
.club-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.08) 0%,
    rgba(139, 92, 246, 0.06) 100%
  );
  border: 1rpx solid rgba(99, 102, 241, 0.2);
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.club-item:active {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.15);
}

.club-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.club-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.club-name {
  font-size: 24rpx;
  font-weight: 700;
  color: #ffffff;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badges {
  display: flex;
  gap: 6rpx;
  flex-shrink: 0;
}

.badge {
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  font-size: 14rpx;
  font-weight: 600;
  white-space: nowrap;
}

.badge--default {
  background: rgba(107, 114, 128, 0.25);
  color: #d1d5db;
}

.badge--success {
  background: rgba(34, 197, 94, 0.25);
  color: #86efac;
}

.badge--danger {
  background: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

.badge--warning {
  background: rgba(251, 191, 36, 0.25);
  color: #fde68a;
}

.badge--limit {
  background: rgba(99, 102, 241, 0.25);
  color: #c4b5fd;
}

.club-info {
  display: flex;
  gap: 16rpx;
}

.info-item {
  display: flex;
  gap: 6rpx;
  font-size: 16rpx;
}

.info-label {
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
}

.info-value {
  color: rgba(255, 255, 255, 0.7);
}

.club-quota {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.quota-bar {
  flex: 1;
  height: 6rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3rpx;
  overflow: hidden;
}

.quota-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 3rpx;
}

.quota-text {
  font-size: 14rpx;
  color: #a5f3fc;
  font-weight: 600;
  min-width: 60rpx;
  text-align: right;
}

.club-actions {
  display: flex;
  gap: 8rpx;
}

.action-btn {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18rpx;
}

.action-btn:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.9);
}

.btn-edit:active {
  background: rgba(99, 102, 241, 0.3);
}

.btn-delete:active {
  background: rgba(239, 68, 68, 0.3);
}
</style>
