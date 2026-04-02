<template>
  <view class="admin-header">
    <!-- 背景装饰 -->
    <view class="header-bg" />

    <!-- 主内容 -->
    <view class="header-content">
      <!-- 页签切换 -->
      <view class="tab-switch">
        <view
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ 'tab-item--active': activeTab === tab.id }"
          @click="$emit('tab-change', tab.id)"
        >
          <text class="tab-icon">{{ tab.icon }}</text>
          <text class="tab-label">{{ tab.label }}</text>
        </view>
      </view>

      <!-- 搜索框 -->
      <view class="search-wrapper">
        <text class="search-icon">🔍</text>
        <input
          type="text"
          class="search-input"
          :value="searchQuery"
          :placeholder="searchPlaceholder"
          placeholder-style="color: rgba(255, 255, 255, 0.3)"
          @input="$emit('search', $event.detail.value)"
        />
        <text
          v-if="searchQuery"
          class="search-clear"
          @click="$emit('search', '')"
        >
          ✕
        </text>
      </view>

      <!-- 筛选按钮 -->
      <view class="filter-wrapper">
        <view class="filter-toggle" @click="filterExpanded = !filterExpanded">
          <text class="filter-icon">⚙️</text>
          <text class="filter-text">筛选</text>
        </view>
      </view>
    </view>

    <!-- 筛选面板 -->
    <FilterPanel
      v-if="filterExpanded"
      :type="activeTab"
      :filters="filters"
      @change="handleFilterChange"
      @close="filterExpanded = false"
    />
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import FilterPanel from "./FilterPanel.vue";

const props = defineProps({
  activeTab: {
    type: String,
    default: "clubs",
  },
  searchQuery: {
    type: String,
    default: "",
  },
  filters: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["tab-change", "search", "filter-change"]);

const filterExpanded = ref(false);

const tabs = [
  { id: "clubs", label: "社团管理", icon: "🏢" },
  { id: "students", label: "学生管理", icon: "👥" },
];

const searchPlaceholder = computed(() =>
  props.activeTab === "clubs"
    ? "搜索社团、老师、社长..."
    : "搜索学生名字、学号、专业...",
);

const handleFilterChange = (newFilters) => {
  emit("filter-change", newFilters);
};
</script>

<style scoped>
.admin-header {
  background: linear-gradient(135deg, #1a1f35 0%, #0f172a 100%);
  border-bottom: 1rpx solid rgba(99, 102, 241, 0.2);
  overflow: visible;
}

.header-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(139, 92, 246, 0.03) 100%
  );
}

.header-content {
  position: relative;
  z-index: 2;
  padding: 16rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

/* ════════════════════════════════════════
   Tab 切换
════════════════════════════════════════ */
.tab-switch {
  display: flex;
  gap: 0;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx;
  border-bottom: 3rpx solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tab-item--active {
  border-bottom-color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
}

.tab-icon {
  font-size: 24rpx;
}

.tab-label {
  font-size: 22rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}

.tab-item--active .tab-label {
  color: #a5f3fc;
}

/* ════════════════════════════════════════
   搜索框
════════════════════════════════════════ */
.search-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 16rpx;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(99, 102, 241, 0.2);
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.search-wrapper:focus-within {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.15);
}

.search-icon {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.45);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  color: #ffffff;
  font-size: 20rpx;
  outline: none;
  border: none;
}

.search-clear {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.search-clear:active {
  color: rgba(255, 255, 255, 0.7);
}

/* ════════════════════════════════════════
   筛选按钮
════════════════════════════════════════ */
.filter-wrapper {
  display: flex;
  justify-content: flex-end;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 16rpx;
  background: rgba(99, 102, 241, 0.2);
  border: 1rpx solid rgba(99, 102, 241, 0.3);
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-toggle:active {
  background: rgba(99, 102, 241, 0.35);
  box-shadow: 0 8rpx 16rpx rgba(99, 102, 241, 0.2);
}

.filter-icon {
  font-size: 20rpx;
}

.filter-text {
  font-size: 18rpx;
  font-weight: 600;
  color: rgba(165, 243, 252, 0.8);
}
</style>
