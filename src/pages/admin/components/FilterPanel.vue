<template>
  <view class="filter-panel">
    <view class="filter-content">
      <!-- 社团筛选 -->
      <view v-if="type === 'clubs'" class="filter-section">
        <!-- 招募状态 -->
        <view class="filter-group">
          <view class="filter-header">
            <text class="filter-label">招募状态</text>
            <text v-if="tempFilters.status !== 'all'" class="filter-badge">
              已选
            </text>
          </view>
          <view class="filter-options">
            <view
              v-for="option in statusOptions"
              :key="option.value"
              class="filter-option"
              :class="{
                'filter-option--active': tempFilters.status === option.value,
              }"
              @click="tempFilters.status = option.value"
            >
              <text class="option-icon">{{ option.icon }}</text>
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </view>

        <!-- 名额状态 -->
        <view class="filter-group">
          <view class="filter-header">
            <text class="filter-label">名额状态</text>
            <text v-if="tempFilters.quotaStatus !== 'all'" class="filter-badge">
              已选
            </text>
          </view>
          <view class="filter-options">
            <view
              v-for="option in quotaStatusOptions"
              :key="option.value"
              class="filter-option"
              :class="{
                'filter-option--active':
                  tempFilters.quotaStatus === option.value,
              }"
              @click="tempFilters.quotaStatus = option.value"
            >
              <text class="option-icon">{{ option.icon }}</text>
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </view>

        <!-- 专业限制 -->
        <view class="filter-group">
          <view class="filter-header">
            <text class="filter-label">专业限制</text>
            <text v-if="tempFilters.majorLimit !== 'all'" class="filter-badge">
              已选
            </text>
          </view>
          <view class="filter-options">
            <view
              v-for="option in majorLimitOptions"
              :key="option.value"
              class="filter-option"
              :class="{
                'filter-option--active':
                  tempFilters.majorLimit === option.value,
              }"
              @click="tempFilters.majorLimit = option.value"
            >
              <text class="option-icon">{{ option.icon }}</text>
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </view>

        <!-- 排序 -->
        <view class="filter-group">
          <view class="filter-header">
            <text class="filter-label">排序方式</text>
          </view>
          <view class="filter-options">
            <view
              v-for="option in sortOptions"
              :key="option.value"
              class="filter-option"
              :class="{
                'filter-option--active': tempFilters.sortBy === option.value,
              }"
              @click="tempFilters.sortBy = option.value"
            >
              <text class="option-icon">{{ option.icon }}</text>
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 学生筛选 -->
      <view v-else class="filter-section">
        <!-- 选社状态 -->
        <view class="filter-group">
          <view class="filter-header">
            <text class="filter-label">选社状态</text>
            <text
              v-if="tempFilters.selectedStatus !== 'all'"
              class="filter-badge"
            >
              已选
            </text>
          </view>
          <view class="filter-options">
            <view
              v-for="option in selectedStatusOptions"
              :key="option.value"
              class="filter-option"
              :class="{
                'filter-option--active':
                  tempFilters.selectedStatus === option.value,
              }"
              @click="tempFilters.selectedStatus = option.value"
            >
              <text class="option-icon">{{ option.icon }}</text>
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </view>

        <!-- 年级 -->
        <view class="filter-group">
          <view class="filter-header">
            <text class="filter-label">年级</text>
            <text v-if="tempFilters.grade !== 'all'" class="filter-badge">
              已选
            </text>
          </view>
          <view class="filter-options">
            <view
              v-for="option in gradeOptions"
              :key="option.value"
              class="filter-option"
              :class="{
                'filter-option--active': tempFilters.grade === option.value,
              }"
              @click="tempFilters.grade = option.value"
            >
              <text class="option-icon">{{ option.icon }}</text>
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </view>

        <!-- 专业 -->
        <view class="filter-group">
          <view class="filter-header">
            <text class="filter-label">专业</text>
            <text v-if="tempFilters.major !== 'all'" class="filter-badge">
              已选
            </text>
          </view>
          <view class="filter-options">
            <view
              v-for="option in majorOptions"
              :key="option.value"
              class="filter-option"
              :class="{
                'filter-option--active': tempFilters.major === option.value,
              }"
              @click="tempFilters.major = option.value"
            >
              <text class="option-icon">{{ option.icon }}</text>
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </view>

        <!-- 排序 -->
        <view class="filter-group">
          <view class="filter-header">
            <text class="filter-label">排序方式</text>
          </view>
          <view class="filter-options">
            <view
              v-for="option in sortOptions"
              :key="option.value"
              class="filter-option"
              :class="{
                'filter-option--active': tempFilters.sortBy === option.value,
              }"
              @click="tempFilters.sortBy = option.value"
            >
              <text class="option-icon">{{ option.icon }}</text>
              <text class="option-label">{{ option.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部操作 -->
      <view class="filter-footer">
        <button class="btn btn-reset" @click="handleReset">
          <text class="btn-icon">↺</text>
          <text>重置</text>
        </button>
        <button class="btn btn-apply" @click="handleApply">
          <text class="btn-icon">✓</text>
          <text>应用筛选</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ["clubs", "students"].includes(value),
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

const emit = defineEmits(["change", "close"]);

// 临时筛选状态（用于实时变更）
const tempFilters = ref({});

// 初始化临时筛选
watch(
  () => props.filters,
  (newFilters) => {
    tempFilters.value = { ...newFilters };
  },
  { immediate: true, deep: true },
);

// ════════════════════════════════════════
// 社团筛选选项
// ════════════════════════════════════════

const statusOptions = [
  { value: "all", label: "全部", icon: "📊" },
  { value: 1, label: "招募中", icon: "📢" },
  { value: 2, label: "已满员", icon: "✓" },
  { value: 0, label: "未开放", icon: "🔒" },
  { value: 3, label: "已结束", icon: "⏹" },
];

const quotaStatusOptions = [
  { value: "all", label: "全部", icon: "📊" },
  { value: "sufficient", label: "名额充足", icon: "✨" },
  { value: "tight", label: "名额紧张", icon: "⚡" },
  { value: "full", label: "已满员", icon: "🔴" },
];

const majorLimitOptions = [
  { value: "all", label: "全部", icon: "📊" },
  { value: true, label: "有专业限制", icon: "🎯" },
  { value: false, label: "无专业限制", icon: "🌐" },
];

// ════════════════════════════════════════
// 学生筛选选项
// ════════════════════════════════════════

const selectedStatusOptions = [
  { value: "all", label: "全部", icon: "📋" }, // 📋 文件夹/列表
  { value: "selected", label: "已选社", icon: "✅" }, // ✅ 绿色勾选
  { value: "reserved", label: "已预留", icon: "⏳" }, // ⏳ 沙漏/等待
  { value: "empty", label: "未选社", icon: "⭕" }, // ⭕ 空心圆/未选
];

const gradeOptions = [
  { value: "all", label: "全部", icon: "📊" },
  { value: "1", label: "大一", icon: "1️⃣" },
  { value: "2", label: "大二", icon: "2️⃣" },
  { value: "3", label: "大三", icon: "3️⃣" },
  { value: "4", label: "大四", icon: "4️⃣" },
];

const majorOptions = [
  { value: "all", label: "全部", icon: "📊" },
  ...props.majors.map((major) => ({
    value: major.major_name,
    label: major.major_name,
    icon: "🎓",
  })),
];

// ════════════════════════════════════════
// 排序选项（通用）
// ════════════════════════════════════════

const sortOptions = [
  { value: "default", label: "默认排序", icon: "↕️" },
  { value: "name", label: "按名称", icon: "🔤" },
  { value: "newest", label: "最新优先", icon: "⏰" },
  { value: "popular", label: "剩余优先", icon: "👥" },
];

// ════════════════════════════════════════
// 事件处理
// ════════════════════════════════════════

const handleReset = () => {
  if (props.type === "clubs") {
    tempFilters.value = {
      status: "all",
      quotaStatus: "all",
      majorLimit: "all",
      sortBy: "default",
    };
  } else {
    tempFilters.value = {
      selectedStatus: "all",
      grade: "all",
      major: "all",
      sortBy: "default",
    };
  }
};

const handleApply = () => {
  emit("change", tempFilters.value);
  emit("close");
};
</script>

<style scoped>
/* ════════════════════════════════════════
   筛选面板整体
════════════════════════════════════════ */
.filter-panel {
  background: #f8fafc;
  border-bottom: 1rpx solid rgba(99, 102, 241, 0.12);
  animation: slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-height: 70vh;
  overflow-y: auto;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-content {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

/* ════════════════════════════════════════
   筛选分组
════════════════════════════════════════ */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-label {
  font-size: 20rpx;
  font-weight: 700;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 1rpx;
}

.filter-badge {
  display: inline-block;
  padding: 6rpx 10rpx;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  border-radius: 6rpx;
  font-size: 14rpx;
  font-weight: 600;
}

/* ════════════════════════════════════════
   筛选选项
════════════════════════════════════════ */
.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.filter-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 14rpx 18rpx;
  background: #ffffff;
  border: 1.5rpx solid rgba(99, 102, 241, 0.12);
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex: 1;
  min-width: 100rpx;
  max-width: calc(50% - 6rpx);
  box-shadow: 0 2rpx 4rpx rgba(99, 102, 241, 0.04);
}

.filter-option:active {
  transform: scale(0.95);
  background: #f0f4f8;
}

.filter-option--active {
  background: linear-gradient(135deg, #eef2ff 0%, #f0f4f8 100%);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow:
    0 8rpx 20rpx rgba(99, 102, 241, 0.12),
    inset 0 0 0 1.5rpx rgba(99, 102, 241, 0.15);
  position: relative;
}

.option-icon {
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32rpx;
}

.option-label {
  font-size: 16rpx;
  color: #64748b;
  font-weight: 600;
  text-align: center;
  line-height: 1.4;
}

.filter-option--active .option-label {
  color: #6366f1;
  font-weight: 700;
}

/* ════════════════════════════════════════
   底部操作按钮
════════════════════════════════════════ */
.filter-footer {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(99, 102, 241, 0.12);
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 18rpx;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}

.btn-reset {
  background: #f1f5f9;
  color: #64748b;
  border: 1.5rpx solid rgba(99, 102, 241, 0.12);
}

.btn-reset:active {
  background: #e2e8f0;
  border-color: rgba(99, 102, 241, 0.25);
  transform: translateY(-1rpx);
}

.btn-apply {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(99, 102, 241, 0.2);
  border: none;
}

.btn-apply:active {
  transform: translateY(-2rpx);
  box-shadow: 0 16rpx 48rpx rgba(99, 102, 241, 0.28);
}

.btn-icon {
  font-size: 18rpx;
  font-weight: 700;
}

/* ════════════════════════════════════════
   响应式布局
════════════════════════════════════════ */
@media (max-width: 480px) {
  .filter-content {
    padding: 16rpx;
    gap: 20rpx;
  }

  .filter-section {
    gap: 20rpx;
  }

  .filter-option {
    max-width: calc(50% - 6rpx);
    padding: 12rpx 14rpx;
    font-size: 12rpx;
  }

  .option-icon {
    font-size: 24rpx;
    height: 28rpx;
  }

  .option-label {
    font-size: 14rpx;
  }

  .filter-label {
    font-size: 18rpx;
  }

  .btn {
    padding: 14rpx;
    font-size: 16rpx;
  }
}

/* ════════════════════════════════════════
   光影效果
════════════════════════════════════════ */
.filter-option {
  position: relative;
  overflow: hidden;
}

.filter-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(99, 102, 241, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.filter-option:active::before {
  left: 100%;
}

/* ════════════════════════════════════════
   滚动条美化
════════════════════════════════════════ */
.filter-panel::-webkit-scrollbar {
  width: 6rpx;
}

.filter-panel::-webkit-scrollbar-track {
  background: transparent;
}

.filter-panel::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.2);
  border-radius: 4rpx;
}

.filter-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.4);
}
</style>
