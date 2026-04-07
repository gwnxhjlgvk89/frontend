<template>
  <view class="pagination-wrapper">
    <view class="pagination-container">
      <!-- 上一页按钮 -->
      <view
        class="pagination-btn"
        :class="{ 'pagination-btn--disabled': currentPage === 1 }"
        @click="handlePrevious"
      >
        <text class="pagination-btn-text">← 上一页</text>
      </view>

      <!-- 页码按钮 -->
      <view class="pagination-pages">
        <view
          v-for="page in pageNumbers"
          :key="page"
          class="pagination-page"
          :class="{ 'pagination-page--active': page === currentPage }"
          @click="page !== '...' && handlePageClick(page)"
        >
          <text>{{ page }}</text>
        </view>
      </view>

      <!-- 下一页按钮 -->
      <view
        class="pagination-btn"
        :class="{ 'pagination-btn--disabled': currentPage === totalPages }"
        @click="handleNext"
      >
        <text class="pagination-btn-text">下一页 →</text>
      </view>

      <!-- 页码信息 -->
      <view class="pagination-info">
        <text class="pagination-info-text">
          第 {{ currentPage }}/{{ totalPages }} 页 (共 {{ totalItems }} 条)
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["change"]);

// ── 计算展示的页码（智能显示，避免过多） ──
const pageNumbers = computed(() => {
  const pages = [];
  const maxButtons = 5; // 最多显示 5 个页码按钮

  if (props.totalPages <= maxButtons) {
    // 总页数少于等于 5，全部显示
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 总页数大于 5，采用省略号方案
    const current = props.currentPage;

    // 第一页
    pages.push(1);

    // 左侧省略
    if (current > 3) {
      pages.push("...");
    }

    // 当前页周围的页码
    const start = Math.max(2, current - 1);
    const end = Math.min(props.totalPages - 1, current + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // 右侧省略
    if (current < props.totalPages - 2) {
      pages.push("...");
    }

    // 最后一页
    if (!pages.includes(props.totalPages)) {
      pages.push(props.totalPages);
    }
  }

  return pages;
});

// ── 上一页 ──
const handlePrevious = () => {
  if (props.currentPage > 1) {
    emit("change", props.currentPage - 1);
  }
};

// ── 下一页 ──
const handleNext = () => {
  if (props.currentPage < props.totalPages) {
    emit("change", props.currentPage + 1);
  }
};

// ── 点击页码 ──
const handlePageClick = (page) => {
  if (typeof page === "number" && page !== props.currentPage) {
    emit("change", page);
  }
};
</script>

<style scoped>
.pagination-wrapper {
  flex-shrink: 0;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f35 100%);
  /* border-top: 1rpx solid rgba(99, 102, 241, 0.2); */
  padding: 10rpx 24rpx;
  min-height: 100rpx;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  flex-wrap: wrap;
  background: rgba(99, 102, 241, 0.08);
  border: 1rpx solid rgba(99, 102, 241, 0.15);
  border-radius: 12rpx;
  padding: 16rpx;
}

/* ════════════════════════════════════════
   分页按钮（上一页/下一页）
════════════════════════════════════════ */
.pagination-btn {
  padding: 10rpx 20rpx;
  background: rgba(99, 102, 241, 0.2);
  border: 1rpx solid rgba(99, 102, 241, 0.3);
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  user-select: none;
}

.pagination-btn:active:not(.pagination-btn--disabled) {
  background: rgba(99, 102, 241, 0.35);
  box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.2);
  transform: translateY(-2rpx);
}

.pagination-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-btn-text {
  font-size: 16rpx;
  color: rgba(165, 243, 252, 0.8);
  font-weight: 600;
}

.pagination-btn--disabled .pagination-btn-text {
  color: rgba(255, 255, 255, 0.3);
}

/* ════════════════════════════════════════
   页码按钮
════════════════════════════════════════ */
.pagination-pages {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
  justify-content: center;
  user-select: none;
}

.pagination-page {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.pagination-page:active:not(.pagination-page--disabled) {
  transform: scale(0.95);
}

.pagination-page--active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: rgba(99, 102, 241, 0.5);
  color: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.3);
  font-weight: 700;
}

/* ════════════════════════════════════════
   分页信息
════════════════════════════════════════ */
.pagination-info {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
}

.pagination-info-text {
  font-size: 16rpx;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}
</style>
