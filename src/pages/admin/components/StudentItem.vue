<template>
  <view class="student-item">
    <view class="student-content">
      <view class="student-header">
        <view class="student-main">
          <text class="student-name">{{ student.name }}</text>
          <text class="student-id">{{ student.student_id }}</text>
        </view>
        <view class="student-badge" :class="`badge--${getBadgeClass}`">
          {{ getBadgeText }}
        </view>
      </view>

      <view class="student-info">
        <text class="info-item">
          <text class="info-label">专业:</text>
          <text class="info-value">{{ student.major || "暂无" }}</text>
        </text>
        <text class="info-item">
          <text class="info-label">年级:</text>
          <text class="info-value">{{ student.grade || "暂无" }}</text>
        </text>
      </view>
    </view>

    <view class="student-actions">
      <text class="action-btn btn-edit" @click="$emit('edit')">✎</text>
      <text class="action-btn btn-delete" @click="$emit('delete')">🗑</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
});

defineEmits(["edit", "delete"]);

const getBadgeText = computed(() =>
  props.student.has_selected ? "已选社" : "未选社",
);

const getBadgeClass = computed(() =>
  props.student.has_selected ? "success" : "warning",
);
</script>

<style scoped>
.student-item {
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

.student-item:active {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.15);
}

.student-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.student-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.student-main {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
}

.student-name {
  font-size: 22rpx;
  font-weight: 700;
  color: #ffffff;
}

.student-id {
  font-size: 14rpx;
  color: rgba(255, 255, 255, 0.45);
}

.student-badge {
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  font-size: 14rpx;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.badge--success {
  background: rgba(34, 197, 94, 0.25);
  color: #86efac;
}

.badge--warning {
  background: rgba(251, 191, 36, 0.25);
  color: #fde68a;
}

.student-info {
  display: flex;
  gap: 16rpx;
}

.info-item {
  display: flex;
  gap: 6rpx;
  font-size: 14rpx;
}

.info-label {
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
}

.info-value {
  color: rgba(255, 255, 255, 0.7);
}

.student-actions {
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
