<template>
  <view class="admin-body">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <view class="spinner" />
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 社团列表 -->
    <scroll-view v-else-if="tab === 'clubs'" class="body-scroll" scroll-y>
      <view v-if="clubs.length === 0" class="empty-state">
        <text class="empty-icon">🎭</text>
        <text class="empty-text">暂无社团数据</text>
      </view>

      <view v-else class="list-container">
        <ClubItem
          v-for="club in clubs"
          :key="club.club_id"
          :club="club"
          @edit="$emit('edit', club)"
          @delete="$emit('delete', club)"
        />
      </view>

      <view class="list-bottom" />
    </scroll-view>

    <!-- 学生列表 -->
    <scroll-view v-else class="body-scroll" scroll-y>
      <view v-if="students.length === 0" class="empty-state">
        <text class="empty-icon">👤</text>
        <text class="empty-text">暂无学生数据</text>
      </view>

      <view v-else class="list-container">
        <StudentItem
          v-for="student in students"
          :key="student.student_id"
          :student="student"
          @edit="$emit('edit', student)"
          @delete="$emit('delete', student)"
        />
      </view>

      <view class="list-bottom" />
    </scroll-view>

    <!-- 新增按钮 -->
    <view class="add-button" @click="$emit('add')">
      <text class="add-icon">+</text>
    </view>
  </view>
</template>

<script setup>
import ClubItem from "./ClubItem.vue";
import StudentItem from "./StudentItem.vue";

defineProps({
  tab: {
    type: String,
    default: "clubs",
  },
  clubs: {
    type: Array,
    default: () => [],
  },
  students: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["edit", "delete", "add"]);
</script>

<style scoped>
.admin-body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1a1f35 100%);
  position: relative;
  display: flex;
  flex-direction: column;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20rpx;
}

.spinner {
  width: 50rpx;
  height: 50rpx;
  border: 4rpx solid rgba(99, 102, 241, 0.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.6);
}

.body-scroll {
  width: 100%;
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20rpx;
  color: rgba(255, 255, 255, 0.35);
}

.empty-icon {
  font-size: 80rpx;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

.empty-text {
  font-size: 24rpx;
}

.list-container {
  padding: 16rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.list-bottom {
  height: 100rpx;
}

/* ════════════════════════════════════════
   新增按钮（浮动）
════════════════════════════════════════ */
.add-button {
  position: fixed;
  bottom: 120rpx;
  right: 24rpx;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(99, 102, 241, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
}

.add-button:active {
  transform: scale(0.9);
  box-shadow: 0 8rpx 20rpx rgba(99, 102, 241, 0.2);
}

.add-icon {
  font-size: 40rpx;
  color: #ffffff;
  font-weight: 700;
}
</style>
