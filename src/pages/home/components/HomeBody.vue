<template>
  <view class="body-wrap">
    <!-- ── 视图切换 Tab ── -->
    <view class="view-switcher">
      <view
        v-for="mode in VIEW_MODES"
        :key="mode.value"
        class="view-tab"
        :class="{ 'view-tab--active': viewMode === mode.value }"
        @click="switchView(mode.value)"
      >
        <text class="view-tab__icon">{{ mode.icon }}</text>
        <text class="view-tab__label">{{ mode.label }}</text>
        <view v-if="viewMode === mode.value" class="view-tab__indicator" />
      </view>
    </view>

    <!-- ── Full 模式 ── -->
    <view v-if="viewMode === 'full'" class="club-list">
      <view
        v-for="(club, index) in clubs"
        :key="club.id ?? index"
        class="club-item"
        :style="{ animationDelay: index * 40 + 'ms' }"
      >
        <ClubCardFull :club="club" :profile="profile" />
      </view>
      <view v-if="clubs.length === 0" class="empty-wrap">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">暂无社团数据</text>
      </view>
    </view>

    <!-- ── Row 模式 ── -->
    <view v-else-if="viewMode === 'row'" class="club-list">
      <view
        v-for="(club, index) in clubs"
        :key="club.id ?? index"
        class="club-item"
        :style="{ animationDelay: index * 40 + 'ms' }"
      >
        <ClubCardRow :club="club" :profile="profile" />
      </view>
      <view v-if="clubs.length === 0" class="empty-wrap">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">暂无社团数据</text>
      </view>
    </view>

    <!-- ── Mini 模式 ── -->
    <view v-else-if="viewMode === 'mini'" class="mini-grid">
      <view
        v-for="(club, index) in clubs"
        :key="club.id ?? index"
        class="mini-item"
        :style="{ animationDelay: index * 30 + 'ms' }"
      >
        <ClubCardMini :club="club" :profile="profile" />
      </view>
      <view v-if="clubs.length === 0" class="empty-wrap empty-wrap--grid">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">暂无社团数据</text>
      </view>
    </view>

    <!-- ── 分页器 ── -->
    <view v-if="totalPages > 1" class="pagination">
      <view
        class="page-btn"
        :class="{ disabled: currentPage === 1 }"
        @click="emit('prev-page')"
      >
        <text class="page-btn-text">‹</text>
      </view>

      <view class="page-numbers">
        <view
          v-for="page in visiblePages"
          :key="page"
          class="page-num"
          :class="{ active: page === currentPage, ellipsis: page === '...' }"
          @click="page !== '...' && emit('update:page', page)"
        >
          <text class="page-num-text">{{ page }}</text>
        </view>
      </view>

      <view
        class="page-btn"
        :class="{ disabled: currentPage === totalPages }"
        @click="emit('next-page')"
      >
        <text class="page-btn-text">›</text>
      </view>
    </view>

    <!-- ── 页码说明 ── -->
    <view v-if="totalPages > 1" class="page-info">
      <text class="page-info-text">
        第 {{ currentPage }} / {{ totalPages }} 页，共 {{ totalCount }} 个社团
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import ClubCardFull from "@/components/base/ClubCardFull.vue";
import ClubCardRow from "@/components/base/ClubCardRow.vue";
import ClubCardMini from "@/components/base/ClubCardMini.vue";

// ── 视图模式配置 ──
const VIEW_MODES = [
  { value: "full", icon: "▤", label: "完整" },
  { value: "row", icon: "≡", label: "列表" },
  { value: "mini", icon: "⊞", label: "小卡" },
];

const viewMode = ref("mini");

function switchView(mode) {
  if (viewMode.value === mode) return;
  viewMode.value = mode;
  // 切换视图时回到第一页
  emit("update:page", 1);
}

// ── Props（只接收当前页数据，分页状态全部由父级管理） ──
const props = defineProps({
  clubs: { type: Array, default: () => [] }, // 当前页的数据切片
  profile: { type: Object, required: true },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  totalCount: { type: Number, default: 0 }, // 筛选后总条数，用于页码说明
});

// ── Emits ──
const emit = defineEmits(["update:page", "prev-page", "next-page"]);

// ── 页码显示逻辑（纯计算，不含状态） ──
const visiblePages = computed(() => {
  const total = props.totalPages;
  const cur = props.currentPage;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 3) return [1, 2, 3, 4, "...", total];
  if (cur >= total - 2)
    return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", cur - 1, cur, cur + 1, "...", total];
});
</script>

<style scoped>
/* ══ 整体容器 ══ */
.body-wrap {
  padding: 0 20rpx;
  box-sizing: border-box;
}

/* ══════════════════════════════════════════════
   视图切换 Tab
══════════════════════════════════════════════ */
.view-switcher {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #1e293b;
  border-radius: 20rpx;
  padding: 6rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.view-tab {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx 0;
  border-radius: 14rpx;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.view-tab:active {
  transform: scale(0.94);
}

.view-tab--active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow:
    0 4rpx 16rpx rgba(99, 102, 241, 0.4),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.15);
}

.view-tab__icon {
  font-size: 28rpx;
  color: #64748b;
  line-height: 1;
  transition: color 0.2s ease;
}
.view-tab__label {
  font-size: 24rpx;
  font-weight: 600;
  color: #64748b;
  transition: color 0.2s ease;
}

.view-tab--active .view-tab__icon,
.view-tab--active .view-tab__label {
  color: #ffffff;
}

/* ══════════════════════════════════════════════
   Full / Row 单列列表
══════════════════════════════════════════════ */
.club-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.club-item {
  border-radius: 20rpx;
  overflow: hidden;
  animation: fadeSlideIn 0.35s ease both;
}

/* ══════════════════════════════════════════════
   Mini 两列 Grid
══════════════════════════════════════════════ */
.mini-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
.mini-item {
  animation: fadeSlideIn 0.35s ease both;
}

/* ══════════════════════════════════════════════
   入场动画
══════════════════════════════════════════════ */
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ══════════════════════════════════════════════
   空状态
══════════════════════════════════════════════ */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  gap: 16rpx;
}
.empty-wrap--grid {
  grid-column: 1 / -1;
}
.empty-icon {
  font-size: 64rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #475569;
}

/* ══════════════════════════════════════════════
   分页器
══════════════════════════════════════════════ */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin-top: 48rpx;
  padding: 0 20rpx;
}

.page-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: #1e293b;
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}
.page-btn.disabled {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: none;
  border-color: rgba(255, 255, 255, 0.03);
}
.page-btn-text {
  font-size: 40rpx;
  line-height: 1;
  color: #94a3b8;
  font-weight: 300;
}
.page-btn.disabled .page-btn-text {
  color: #334155;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.page-num {
  min-width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e293b;
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 0 8rpx;
}
.page-num.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  box-shadow: 0 6rpx 20rpx rgba(99, 102, 241, 0.4);
  transform: scale(1.1);
}
.page-num.ellipsis {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}
.page-num-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #64748b;
}
.page-num.active .page-num-text {
  color: #ffffff;
}
.page-num.ellipsis .page-num-text {
  color: #475569;
}

/* ── 页码说明 ── */
.page-info {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
  padding-bottom: 32rpx;
}
.page-info-text {
  font-size: 22rpx;
  color: #475569;
}
</style>
