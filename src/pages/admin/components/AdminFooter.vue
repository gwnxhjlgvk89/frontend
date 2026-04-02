<template>
  <view class="admin-footer">
    <!-- Tab 切换 -->
    <view class="tab-container">
      <view
        v-for="tab in tabs"
        :key="tab.id"
        class="footer-tab"
        :class="{ 'footer-tab--active': activeTab === tab.id }"
        @click="$emit('tab-change', tab.id)"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <view class="tab-info">
          <text class="tab-name">{{ tab.label }}</text>
          <text class="tab-count">{{ getTabCount(tab.id) }}</text>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-container">
      <view v-for="stat in currentStats" :key="stat.label" class="stat-item">
        <text class="stat-label">{{ stat.label }}</text>
        <text class="stat-value">{{ stat.value }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  activeTab: {
    type: String,
    default: "clubs",
  },
  clubCount: {
    type: Number,
    default: 0,
  },
  studentCount: {
    type: Number,
    default: 0,
  },
  clubStats: {
    type: Object,
    default: () => ({ total: 0, open: 0, full: 0 }),
  },
  studentStats: {
    type: Object,
    default: () => ({ total: 0, selected: 0, unselected: 0 }),
  },
});

const emit = defineEmits(["tab-change"]);

const tabs = [
  { id: "clubs", label: "社团", icon: "🏢" },
  { id: "students", label: "学生", icon: "👥" },
];

const currentStats = computed(() => {
  if (props.activeTab === "clubs") {
    return [
      { label: "总数", value: props.clubStats.total },
      { label: "开放中", value: props.clubStats.open },
      { label: "已满员", value: props.clubStats.full },
    ];
  }
  return [
    { label: "总数", value: props.studentStats.total },
    { label: "已选社", value: props.studentStats.selected },
    { label: "未选社", value: props.studentStats.unselected },
  ];
});

const getTabCount = (tabId) => {
  return tabId === "clubs" ? props.clubCount : props.studentCount;
};
</script>

<style scoped>
.admin-footer {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f35 100%);
  border-top: 1rpx solid rgba(99, 102, 241, 0.2);
  padding: 16rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

/* ════════════════════════════════════════
   Tab 容器
════════════════════════════════════════ */
.tab-container {
  display: flex;
  gap: 16rpx;
}

.footer-tab {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-tab:active {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.footer-tab--active {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.2),
    rgba(139, 92, 246, 0.15)
  );
  border-color: rgba(99, 102, 241, 0.4);
}

.tab-icon {
  font-size: 28rpx;
  flex-shrink: 0;
}

.tab-info {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.tab-name {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.tab-count {
  font-size: 18rpx;
  color: #a5f3fc;
  font-weight: 700;
}

/* ════════════════════════════════════════
   统计信息
════════════════════════════════════════ */
.stats-container {
  display: flex;
  gap: 12rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 12rpx;
  background: rgba(99, 102, 241, 0.08);
  border: 1rpx solid rgba(99, 102, 241, 0.15);
  border-radius: 8rpx;
}

.stat-label {
  font-size: 14rpx;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
}

.stat-value {
  font-size: 22rpx;
  color: #86efac;
  font-weight: 700;
}
</style>
