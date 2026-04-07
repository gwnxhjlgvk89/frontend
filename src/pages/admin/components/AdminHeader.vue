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

      <!-- 操作按钮组 -->
      <view class="action-wrapper">
        <!-- 导出数据按钮 -->
        <view class="export-button" @click="handleExport">
          <text class="export-icon">📊</text>
          <text class="export-text">导出数据</text>
        </view>

        <!-- 导入数据按钮 -->
        <view class="import-button" @click="handleImportClick">
          <text class="import-icon">📥</text>
          <text class="import-text">导入数据</text>
        </view>

        <!-- 添加数据按钮 -->
        <view class="add-button" @click="$emit('add')">
          <text class="add-icon">➕</text>
          <text class="add-text">添加社团</text>
        </view>

        <!-- 筛选按钮 -->
        <view class="filter-toggle" @click="filterExpanded = !filterExpanded">
          <text class="filter-icon">⚙️</text>
          <text class="filter-text">筛选</text>
        </view>

        <!-- 隐藏的文件输入 -->
        <input
          ref="fileInput"
          type="file"
          accept=".csv,.xlsx,.xls"
          style="display: none"
          @change="handleFileSelect"
        />
      </view>
    </view>

    <!-- 筛选面板 -->
    <FilterPanel
      v-if="filterExpanded"
      :type="activeTab"
      :filters="filters"
      :majors="majors"
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
  majors: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["tab-change", "search", "filter-change", "add"]);

const filterExpanded = ref(false);
const fileInput = ref(null);

const tabs = [
  { id: "clubs", label: "社团管理", icon: "🏢" },
  { id: "students", label: "学生管理", icon: "👥" },
];

const searchPlaceholder = computed(() =>
  props.activeTab === "clubs"
    ? "搜索社团、老师、社长..."
    : "搜索学生名字、学号、专业...",
);

// ── 筛选变更 ──
const handleFilterChange = (newFilters) => {
  emit("filter-change", newFilters);
};

// ── 导出数据 ──
const handleExport = () => {
  uni.showToast({
    title: "开始导出数据...",
    icon: "loading",
    duration: 1500,
  });
  // 后续可在此添加具体导出逻辑
};

// ── 导入数据（点击按钮触发文件选择） ──
const handleImportClick = () => {
  fileInput.value.click();
};

// ── 处理文件选择 ──
const handleFileSelect = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  // 验证文件类型
  const validTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (
    !validTypes.includes(file.type) &&
    !file.name.match(/\.(csv|xlsx|xls)$/)
  ) {
    uni.showToast({
      title: "仅支持 CSV、XLSX、XLS 格式",
      icon: "error",
      duration: 2000,
    });
    return;
  }

  // 验证文件大小（限制 10MB）
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    uni.showToast({
      title: "文件大小不超过 10MB",
      icon: "error",
      duration: 2000,
    });
    return;
  }

  // 显示导入中的 Toast
  uni.showLoading({
    title: "正在导入数据...",
  });

  // 模拟处理延迟
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: `已导入 ${file.name}`,
      icon: "success",
      duration: 2000,
    });

    // 在实际应用中，这里应该上传文件到服务器
    console.log("文件信息：", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // 重置文件输入
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }, 1500);
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
   操作按钮组
════════════════════════════════════════ */
.action-wrapper {
  display: flex;
  gap: 12rpx;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* ════════════════════════════════════════
   导出数据按钮
════════════════════════════════════════ */
.export-button {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 16rpx;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.2),
    rgba(22, 163, 74, 0.15)
  );
  border: 1rpx solid rgba(34, 197, 94, 0.3);
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.export-button:active {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.35),
    rgba(22, 163, 74, 0.25)
  );
  box-shadow: 0 8rpx 16rpx rgba(34, 197, 94, 0.2);
  transform: scale(0.98);
}

.export-icon {
  font-size: 20rpx;
}

.export-text {
  font-size: 18rpx;
  font-weight: 600;
  color: rgba(134, 239, 172, 0.85);
}

/* ════════════════════════════════════════
   导入数据按钮
════════════════════════════════════════ */
.import-button {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 16rpx;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2),
    rgba(37, 99, 235, 0.15)
  );
  border: 1rpx solid rgba(59, 130, 246, 0.3);
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.import-button:active {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.35),
    rgba(37, 99, 235, 0.25)
  );
  box-shadow: 0 8rpx 16rpx rgba(59, 130, 246, 0.2);
  transform: scale(0.98);
}

.import-icon {
  font-size: 20rpx;
}

.import-text {
  font-size: 18rpx;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.85);
}

/* ════════════════════════════════════════
   添加数据按钮
════════════════════════════════════════ */
.add-button {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 16rpx;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.2),
    rgba(168, 85, 247, 0.15)
  );
  border: 1rpx solid rgba(139, 92, 246, 0.3);
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.add-button:active {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.35),
    rgba(168, 85, 247, 0.25)
  );
  box-shadow: 0 8rpx 16rpx rgba(139, 92, 246, 0.2);
  transform: scale(0.98);
}

.add-icon {
  font-size: 20rpx;
}

.add-text {
  font-size: 18rpx;
  font-weight: 600;
  color: rgba(221, 214, 254, 0.85);
}

/* ════════════════════════════════════════
   筛选按钮
════════════════════════════════════════ */
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
  flex-shrink: 0;
}

.filter-toggle:active {
  background: rgba(99, 102, 241, 0.35);
  box-shadow: 0 8rpx 16rpx rgba(99, 102, 241, 0.2);
  transform: scale(0.98);
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
