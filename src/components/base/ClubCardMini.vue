<template>
  <view class="mini-card" @click="handleCardClick">
    <!-- 顶部：状态点 + 专业限制 badge + 收藏 -->
    <view class="mini-card__top">
      <view class="mini-card__top-left">
        <view class="status-dot" :class="statusDotClass" />
        <view v-if="club.has_major_limit" class="badge badge--limit">
          <text class="badge__text">专业限</text>
        </view>
      </view>
      <view class="fav-btn" @click.stop="onToggleFav">
        <text class="fav-btn__icon">{{ isFav ? "⭐" : "☆" }}</text>
      </view>
    </view>

    <!-- 社团名 -->
    <text class="mini-card__name">{{ club.club_name }}</text>

    <!-- 名额大数字 -->
    <text class="mini-card__quota-num" :class="quotaNumClass">
      {{ club.remaining_quota }}
    </text>
    <text class="mini-card__quota-label">名额剩余</text>

    <!-- 进度条 -->
    <view class="progress">
      <view
        class="progress__fill"
        :style="{ width: pct + '%' }"
        :class="progressClass"
      />
    </view>

    <!-- 底部状态文字 -->
    <text class="mini-card__status" :class="statusTextClass">
      {{ statusText }}
    </text>

    <!-- ── 选社按钮 ── -->
    <view class="select-btn" :class="selectBtnClass" @click.stop="onSelectClub">
      <!-- 流光 -->
      <view
        v-if="club.club_status === 1 || isSelecting"
        class="select-btn__glow"
      />

      <!-- spinner / icon -->
      <view class="select-btn__icon-wrap">
        <view v-if="isSelecting" class="select-btn__spinner" />
        <text v-else class="select-btn__icon">{{ currentBtnConfig.icon }}</text>
      </view>

      <!-- 文字 -->
      <text
        class="select-btn__label"
        :class="{ 'select-btn__label--breathing': isSelecting }"
      >
        {{ currentBtnConfig.label }}
      </text>

      <!-- 箭头 -->
      <text
        v-if="club.club_status === 1 && !isSelecting"
        class="select-btn__arrow"
        >›</text
      >
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { useFavStore } from "@/stores/fav";
import { homeApi } from "@/api/home";
import { showToast } from "@/utils/toast";

const props = defineProps({
  club: { type: Object, required: true },
  profile: { type: Object, required: true },
});

// ── 收藏（自管理，与 Full 版一致）──────────────────────────
const favStore = useFavStore();
const isFav = computed(() => favStore.isFav(props.club.club_name));
const onToggleFav = () => favStore.toggleFav(props.club.club_name);

// ── 名额计算 ────────────────────────────────────────────────
const joined = computed(
  () => props.club.total_quota - props.club.remaining_quota,
);
const pct = computed(() =>
  Math.round((joined.value / props.club.total_quota) * 100),
);
const isFull = computed(() => props.club.remaining_quota === 0);
const isUrgent = computed(
  () => props.club.remaining_quota <= 3 && !isFull.value,
);

// ── 状态文字 ────────────────────────────────────────────────
const statusText = computed(() => {
  if (isFull.value) return "已满员";
  if (isUrgent.value) return "即将满员";
  return "招募中";
});

// ── 样式 class ──────────────────────────────────────────────
const statusDotClass = computed(() => ({
  "status-dot--full": isFull.value,
  "status-dot--urgent": isUrgent.value,
  "status-dot--open": !isFull.value && !isUrgent.value,
}));

const statusTextClass = computed(() => ({
  "mini-card__status--full": isFull.value,
  "mini-card__status--urgent": isUrgent.value,
  "mini-card__status--open": !isFull.value && !isUrgent.value,
}));

const quotaNumClass = computed(() => ({
  "mini-card__quota-num--full": isFull.value,
  "mini-card__quota-num--urgent": isUrgent.value,
}));

const progressClass = computed(() => ({
  "progress__fill--full": isFull.value,
  "progress__fill--urgent": isUrgent.value,
}));

// ── 选社按钮配置 ────────────────────────────────────────────
const isSelecting = ref(false);

const currentBtnConfig = computed(() => {
  const map = {
    0: { icon: "🔒", label: "未开放" },
    1: { icon: "⚡", label: "立即选社" },
    2: { icon: "🚫", label: "已满员" },
    3: { icon: "🏁", label: "已结束" },
    4: { icon: "🎫", label: "已选社" },
  };

  if (props.profile.is_reserved || props.profile.has_selected) return map[4];
  if (isSelecting.value) return { icon: "__loading__", label: "选社中…" };

  return map[props.club.club_status] ?? map[0];
});

const selectBtnClass = computed(() => ({
  "select-btn--locked": props.club.club_status === 0,
  "select-btn--active": props.club.club_status === 1 && !isSelecting.value,
  "select-btn--full": props.club.club_status === 2,
  "select-btn--ended": props.club.club_status === 3,
  "select-btn--reserved":
    props.profile.is_reserved || props.profile.has_selected,
  "select-btn--selecting": isSelecting.value,
}));

// ── 点击选社 ────────────────────────────────────────────────
const onSelectClub = async () => {
  if (props.profile.is_reserved) return;
  if (props.club.club_status !== 1) return;
  if (props.profile.has_selected) return;
  if (isSelecting.value) return;

  isSelecting.value = true;
  try {
    await Promise.all([
      homeApi.selectClub(props.club.club_name),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);
    showToast({ title: "选社成功 🎉", icon: "success" });
  } catch (e) {
    showToast({ title: e?.message ?? "选社失败，请重试", icon: "none" });
  } finally {
    isSelecting.value = false;
  }
};

// ── ✨ 跳转到详情页 ──
const handleCardClick = () => {
  // 使用本地存储传递数据（推荐方案）
  uni.setStorageSync("clubData", props.club);
  uni.setStorageSync("profileData", props.profile);

  uni.navigateTo({
    url: "/pages/club/club",
    success: () => {
      console.log("导航成功");
    },
    fail: (err) => {
      console.error("导航失败:", err);
      uni.showToast({
        title: "页面跳转失败",
        icon: "error",
      });
    },
  });
};
</script>

<style scoped>
/* ── 卡片容器 ── */
.mini-card {
  background: #1e293b;
  border-radius: 20rpx;
  padding: 20rpx 20rpx 16rpx;
  box-shadow:
    0 4rpx 20rpx rgba(0, 0, 0, 0.2),
    0 1rpx 6rpx rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  transition: transform 0.2s ease;
  border: 1rpx solid rgba(255, 255, 255, 0.06);
}
.mini-card:active {
  transform: scale(0.96);
}

/* ── 顶部行 ── */
.mini-card__top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rpx;
}
.mini-card__top-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}

/* ── 状态圆点 ── */
.status-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot--open {
  background: #22c55e;
  animation: pulse-green 2s infinite;
}
.status-dot--urgent {
  background: #fbbf24;
  animation: pulse-yellow 2s infinite;
}
.status-dot--full {
  background: #ef4444;
}
@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
  }
  70% {
    box-shadow: 0 0 0 10rpx rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
@keyframes pulse-yellow {
  0% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.5);
  }
  70% {
    box-shadow: 0 0 0 10rpx rgba(251, 191, 36, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
  }
}

/* ── 专业限制 badge ── */
.badge--limit {
  background: rgba(99, 102, 241, 0.3);
  border: 1rpx solid rgba(139, 92, 246, 0.5);
  border-radius: 50rpx;
  padding: 2rpx 10rpx;
}
.badge__text {
  font-size: 16rpx;
  font-weight: 600;
  color: #c4b5fd;
}

/* ── 收藏 ── */
.fav-btn {
  line-height: 1;
}
.fav-btn__icon {
  font-size: 26rpx;
}

/* ── 社团名 ── */
.mini-card__name {
  font-size: 24rpx;
  font-weight: 700;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ── 大数字名额 ── */
.mini-card__quota-num {
  font-size: 60rpx;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  transition: color 0.3s ease;
}
.mini-card__quota-num--full {
  color: #fca5a5;
}
.mini-card__quota-num--urgent {
  color: #fde68a;
}

.mini-card__quota-label {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.4);
  margin-top: -4rpx;
}

/* ── 进度条 ── */
.progress {
  height: 6rpx;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50rpx;
  overflow: hidden;
  margin-top: 4rpx;
}
.progress__fill {
  height: 100%;
  border-radius: 50rpx;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.progress__fill--urgent {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}
.progress__fill--full {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

/* ── 状态文字 ── */
.mini-card__status {
  font-size: 18rpx;
  font-weight: 600;
  margin-top: 4rpx;
}
.mini-card__status--open {
  color: #86efac;
}
.mini-card__status--urgent {
  color: #fde68a;
}
.mini-card__status--full {
  color: #fca5a5;
}

/* ════════════════════════════════════════
   选社按钮（紧凑单行）
════════════════════════════════════════ */
.select-btn {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10rpx;
  margin-top: 8rpx;
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

/* ── 流光 ── */
.select-btn__glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 100%
  );
  transform: translateX(-150%);
  animation: glow-sweep 2.8s ease-in-out infinite;
  z-index: 0;
}
@keyframes glow-sweep {
  0% {
    transform: translateX(-150%);
  }
  60%,
  100% {
    transform: translateX(250%);
  }
}

/* ── 图标容器 ── */
.select-btn__icon-wrap {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}
.select-btn__icon {
  font-size: 28rpx;
}

/* ── spinner ── */
.select-btn__spinner {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-right-color: rgba(255, 255, 255, 0.6);
  animation: btn-spin 0.7s linear infinite;
  box-shadow: 0 0 8rpx rgba(255, 255, 255, 0.2);
}
@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── 标签文字 ── */
.select-btn__label {
  flex: 1;
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
  z-index: 1;
  letter-spacing: 0.5rpx;
}
.select-btn__label--breathing {
  animation: text-breathe 1.2s ease-in-out infinite;
}
@keyframes text-breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* ── 箭头 ── */
.select-btn__arrow {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
  line-height: 1;
  z-index: 1;
  animation: arrow-bounce 1.4s ease-in-out infinite;
}
@keyframes arrow-bounce {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.5;
  }
  50% {
    transform: translateX(6rpx);
    opacity: 1;
  }
}

/* ── 状态 0：未开放 ── */
.select-btn--locked {
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}
.select-btn--locked .select-btn__label {
  color: rgba(255, 255, 255, 0.3);
}
.select-btn--locked .select-btn__icon {
  opacity: 0.35;
}

/* ── 状态 1：招募中 ── */
.select-btn--active {
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 60%, #a855f7 100%);
  box-shadow:
    0 6rpx 24rpx rgba(99, 102, 241, 0.5),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  animation: btn-pulse 2.4s ease-in-out infinite;
}
.select-btn--active:active {
  transform: scale(0.97);
  animation: none;
}
@keyframes btn-pulse {
  0%,
  100% {
    box-shadow:
      0 6rpx 24rpx rgba(99, 102, 241, 0.5),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 10rpx 36rpx rgba(99, 102, 241, 0.75),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }
}

/* ── 状态 2：已满 ── */
.select-btn--full {
  background: rgba(239, 68, 68, 0.12);
  border: 1rpx solid rgba(239, 68, 68, 0.3);
}
.select-btn--full .select-btn__label {
  color: #fca5a5;
}

/* ── 状态 3：已结束 ── */
.select-btn--ended {
  background: rgba(100, 116, 139, 0.15);
  border: 1rpx solid rgba(100, 116, 139, 0.3);
}
.select-btn--ended .select-btn__label {
  color: rgba(148, 163, 184, 0.8);
}
.select-btn--ended .select-btn__icon {
  opacity: 0.5;
}

/* ── 状态 4：已选社 ── */
.select-btn--reserved {
  background: rgba(217, 119, 6, 0.15);
  border: 1rpx solid rgba(245, 158, 11, 0.4);
}
.select-btn--reserved .select-btn__label {
  color: #fcd34d;
}

/* ── 状态：选社中 ── */
.select-btn--selecting {
  background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 60%, #7e22ce 100%);
  box-shadow:
    0 6rpx 24rpx rgba(99, 102, 241, 0.4),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.15);
  pointer-events: none;
  filter: brightness(0.88);
  transform: scale(0.985);
}
</style>
