<template>
  <view class="admin-footer">
    <!-- 统计信息 -->
    <view class="stats-container">
      <view v-for="stat in currentStats" :key="stat.label" class="stat-item">
        <text class="stat-label">{{ stat.label }}</text>
        <text class="stat-value">{{ stat.value }}</text>
      </view>
    </view>

    <!-- 安全区占位符 -->
    <view class="safe-area-spacer" :style="{ height: safeAreaInset }"></view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";

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

const safeAreaInset = ref("0px");

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

// 获取安全区高度
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  if (systemInfo.safeAreaInsets && systemInfo.safeAreaInsets.bottom) {
    safeAreaInset.value = systemInfo.safeAreaInsets.bottom - 15 + "rpx";
  }
});
</script>

<style scoped>
.admin-footer {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f35 100%);
  /* border-top: 1rpx solid rgba(99, 102, 241, 0.2); */
  padding: 16rpx 24rpx;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
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

/* ════════════════════════════════════════
   安全区占位符
════════════════════════════════════════ */
.safe-area-spacer {
  width: 100%;
  background: transparent;
}
</style>
