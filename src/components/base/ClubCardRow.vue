<template>
  <view class="row-card" @click="handleCardClick">
    <!-- 左侧色条：selecting 时换色 -->
    <view class="row-card__accent" :class="accentClass" />

    <!-- 内容 -->
    <view class="row-card__body">
      <!-- 第一行：名字 + badges -->
      <view class="row-card__top">
        <text class="row-card__name">{{ club.club_name }}</text>

        <view v-if="isFull" class="badge badge--full">
          <text class="badge__text">已满</text>
        </view>
        <view v-else-if="isUrgent" class="badge badge--urgent">
          <text class="badge__text">剩 {{ club.remaining_quota }}</text>
        </view>
        <view v-if="club.has_major_limit" class="badge badge--limit">
          <text class="badge__text">专业限制</text>
        </view>
      </view>

      <!-- 第二行：简介 -->
      <text class="row-card__desc">{{ club.description }}</text>

      <!-- 第三行：老师 + 进度条 + 名额 -->
      <view class="row-card__bottom">
        <text class="row-card__teacher">
          👤 {{ club.teacher_advisor ?? "暂无" }}
        </text>

        <view class="row-card__progress-wrap">
          <view class="progress">
            <view
              class="progress__fill"
              :style="{ width: pct + '%' }"
              :class="progressClass"
            />
          </view>
        </view>

        <text class="row-card__quota" :class="quotaClass">
          {{ club.remaining_quota }}/{{ club.total_quota }}
        </text>
      </view>

      <!-- 选社按钮 -->
      <view
        class="select-btn"
        :class="selectBtnClass"
        @click.stop="onSelectClub"
      >
        <!-- 流光 -->
        <view
          v-if="club.club_status === 1 || isSelecting"
          class="select-btn__glow"
        />

        <!-- 图标 / spinner -->
        <view class="select-btn__icon-wrap">
          <view v-if="isSelecting" class="select-btn__spinner" />
          <text v-else class="select-btn__icon">
            {{ currentBtnConfig.icon }}
          </text>
        </view>

        <!-- 文字 -->
        <view class="select-btn__text-wrap">
          <text class="select-btn__label">{{ currentBtnConfig.label }}</text>
          <text class="select-btn__sub">{{ currentBtnConfig.sub }}</text>
        </view>

        <!-- 箭头 -->
        <text
          v-if="club.club_status === 1 && !isSelecting"
          class="select-btn__arrow"
          >›</text
        >
      </view>
    </view>

    <!-- 右侧收藏 -->
    <view class="fav-btn" @click.stop="onToggleFav">
      <text class="fav-btn__icon">{{ isFav ? "⭐" : "☆" }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { useFavStore } from "@/stores/fav";
import { homeApi } from "@/api/home";
import { showToast } from "@/utils/toast";

// ── Props ────────────────────────────────────────────────────
const props = defineProps({
  club: { type: Object, required: true },
  profile: { type: Object, required: true },
});

defineEmits(["click"]);

// ── 收藏 ────────────────────────────────────────────────────
const favStore = useFavStore();
const isFav = computed(() => favStore.isFav(props.club.club_name));
const onToggleFav = async () => await favStore.toggleFav(props.club.club_name);

// ── 基础计算 ─────────────────────────────────────────────────
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

// ── 样式 class ───────────────────────────────────────────────
const progressClass = computed(() => ({
  "progress__fill--full": isFull.value,
  "progress__fill--urgent": isUrgent.value,
}));

const quotaClass = computed(() => ({
  "row-card__quota--full": isFull.value,
  "row-card__quota--urgent": isUrgent.value,
}));

// 左侧色条
const accentClass = computed(() => ({
  "row-card__accent--selecting": isSelecting.value,
  "row-card__accent--full": isFull.value && !isSelecting.value,
  "row-card__accent--urgent": isUrgent.value && !isSelecting.value,
}));

// ── 选社按钮 ─────────────────────────────────────────────────
const isSelecting = ref(false);

const currentBtnConfig = computed(() => {
  const map = {
    0: { icon: "🔒", label: "尚未开放", sub: "敬请期待" },
    1: { icon: "⚡", label: "立即选社", sub: "点击填报志愿" },
    2: { icon: "🚫", label: "名额已满", sub: "该社团已无剩余名额" },
    3: { icon: "🏁", label: "报名已结束", sub: "本轮招募已截止" },
    4: { icon: "🎫", label: "已选社", sub: "你已成功选择社团，无法再选" },
  };

  if (props.profile.is_reserved || props.profile.has_selected) return map[4];

  if (isSelecting.value) {
    return {
      icon: "__loading__",
      label: "选社中",
      sub: "正在为你提交志愿，请稍候…",
    };
  }

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
/* ── 卡片 ── */
.row-card {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: #1e293b;
  border-radius: 20rpx;
  box-shadow:
    0 4rpx 20rpx rgba(0, 0, 0, 0.2),
    0 1rpx 6rpx rgba(0, 0, 0, 0.12);
  overflow: hidden;
  margin-bottom: 16rpx;
  transition: transform 0.2s ease;
}
.row-card:active {
  transform: scale(0.985);
}

/* ── 左侧色条 ── */
.row-card__accent {
  width: 8rpx;
  flex-shrink: 0;
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  transition: background 0.3s ease;
}
.row-card__accent--urgent {
  background: linear-gradient(180deg, #f59e0b, #fbbf24);
}
.row-card__accent--full {
  background: linear-gradient(180deg, #ef4444, #f87171);
}
.row-card__accent--selecting {
  background: linear-gradient(180deg, #4f46e5, #7e22ce);
  animation: accent-breathe 1.2s ease-in-out infinite;
}
@keyframes accent-breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* ── 内容 ── */
.row-card__body {
  flex: 1;
  padding: 20rpx 16rpx;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

/* 第一行 */
.row-card__top {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
}
.row-card__name {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* badges */
.badge {
  padding: 4rpx 14rpx;
  border-radius: 50rpx;
  flex-shrink: 0;
}
.badge--full {
  background: rgba(239, 68, 68, 0.2);
  border: 1rpx solid rgba(239, 68, 68, 0.5);
}
.badge--full .badge__text {
  color: #fca5a5;
  font-size: 18rpx;
  font-weight: 600;
}
.badge--urgent {
  display: flex;
  align-items: center;
  background: rgba(251, 191, 36, 0.2);
  border: 1rpx solid rgba(251, 191, 36, 0.5);
}
.badge--urgent .badge__text {
  color: #fde68a;
  font-size: 18rpx;
  font-weight: 600;
}
.badge--limit {
  display: flex;
  align-items: center;
  background: rgba(99, 102, 241, 0.25);
  border: 1rpx solid rgba(139, 92, 246, 0.5);
}
.badge--limit .badge__text {
  color: #c4b5fd;
  font-size: 18rpx;
  font-weight: 600;
}

/* 简介 */
.row-card__desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.55);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 底部行 */
.row-card__bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
}
.row-card__teacher {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.45);
  flex-shrink: 0;
}
.row-card__progress-wrap {
  flex: 1;
}
.progress {
  height: 6rpx;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50rpx;
  overflow: hidden;
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
.row-card__quota {
  font-size: 22rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}
.row-card__quota--full {
  color: #fca5a5;
}
.row-card__quota--urgent {
  color: #fde68a;
}

/* ════════════════════════════════════════
   选社按钮（行内紧凑版）
════════════════════════════════════════ */
.select-btn {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  gap: 12rpx;
  width: 100%;
  padding: 18rpx 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-top: 4rpx;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
}

/* 流光 */
.select-btn__glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
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

/* 图标容器 */
.select-btn__icon-wrap {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}
.select-btn__icon {
  font-size: 32rpx;
}

/* spinner */
.select-btn__spinner {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-right-color: rgba(255, 255, 255, 0.6);
  animation: btn-spin 0.7s linear infinite;
  box-shadow: 0 0 10rpx rgba(255, 255, 255, 0.2);
}
@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

/* 文字 */
.select-btn__text-wrap {
  flex: 1;
  z-index: 1;
}
.select-btn__label {
  display: block;
  font-size: 26rpx;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1rpx;
}
.select-btn__sub {
  display: block;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2rpx;
}

/* 箭头 */
.select-btn__arrow {
  font-size: 48rpx;
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

/* 状态 0：未开放 */
.select-btn--locked {
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}
.select-btn--locked .select-btn__label {
  color: rgba(255, 255, 255, 0.35);
}
.select-btn--locked .select-btn__sub {
  color: rgba(255, 255, 255, 0.2);
}
.select-btn--locked .select-btn__icon {
  opacity: 0.4;
}

/* 状态 1：立即选社 */
.select-btn--active {
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 60%, #a855f7 100%);
  box-shadow:
    0 6rpx 24rpx rgba(99, 102, 241, 0.45),
    0 2rpx 8rpx rgba(139, 92, 246, 0.35),
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
      0 6rpx 24rpx rgba(99, 102, 241, 0.45),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 10rpx 40rpx rgba(99, 102, 241, 0.7),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }
}

/* 状态 2：名额已满 */
.select-btn--full {
  background: rgba(239, 68, 68, 0.12);
  border: 1rpx solid rgba(239, 68, 68, 0.3);
}
.select-btn--full .select-btn__label {
  color: #fca5a5;
}
.select-btn--full .select-btn__sub {
  color: rgba(252, 165, 165, 0.6);
}

/* 状态 3：已结束 */
.select-btn--ended {
  background: rgba(100, 116, 139, 0.15);
  border: 1rpx solid rgba(100, 116, 139, 0.3);
}
.select-btn--ended .select-btn__label {
  color: rgba(148, 163, 184, 0.8);
}
.select-btn--ended .select-btn__sub {
  color: rgba(148, 163, 184, 0.45);
}
.select-btn--ended .select-btn__icon {
  opacity: 0.5;
}

/* 状态 4：已选社 */
.select-btn--reserved {
  background: rgba(217, 119, 6, 0.15);
  border: 1rpx solid rgba(245, 158, 11, 0.45);
}
.select-btn--reserved .select-btn__label {
  color: #fcd34d;
}
.select-btn--reserved .select-btn__sub {
  color: rgba(252, 211, 77, 0.6);
}

/* 状态：选社中 */
.select-btn--selecting {
  background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 60%, #7e22ce 100%);
  box-shadow:
    0 6rpx 24rpx rgba(99, 102, 241, 0.35),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.15);
  pointer-events: none;
  filter: brightness(0.88);
  transform: scale(0.985);
}
.select-btn--selecting .select-btn__label {
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

/* ── 收藏 ── */
.fav-btn {
  width: 72rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border-left: 1rpx solid rgba(255, 255, 255, 0.07);
  transition: background 0.2s ease;
}
.fav-btn:active {
  background: rgba(255, 255, 255, 0.1);
}
.fav-btn__icon {
  font-size: 32rpx;
}
</style>
