<template>
  <view class="card" @click="$emit('click', club)">
    <!-- 顶部渐变封面区 -->
    <view class="card__cover" :style="coverStyle">
      <view class="card__cover-mask" />

      <!-- 状态 badge -->
      <view class="card__badges">
        <view v-if="isFull" class="badge badge--full">
          <text class="badge__text">已满员</text>
        </view>
        <view v-else-if="isUrgent" class="badge badge--urgent">
          <text class="badge__text">仅剩 {{ club.remaining_quota }} 名</text>
        </view>
        <view v-else class="badge badge--open">
          <text class="badge__text">招募中</text>
        </view>

        <view v-if="club.has_major_limit" class="badge badge--limit">
          <text class="badge__text">专业限制</text>
        </view>
      </view>

      <!-- 收藏 -->
      <view class="fav-btn" @click.stop="onToggleFav">
        <text class="fav-btn__icon">{{ isFav ? "⭐" : "☆" }}</text>
      </view>

      <!-- 社团名 -->
      <view class="card__title-wrap">
        <text class="card__name">{{ club.club_name }}</text>
        <text v-if="club.super_club" class="card__super">
          隶属：{{ club.super_club }}
        </text>
      </view>
    </view>

    <!-- 内容区 -->
    <view class="card__body">
      <!-- 简介 -->
      <text class="card__desc">{{ club.description }}</text>

      <!-- 信息网格 -->
      <view class="card__meta-grid">
        <view class="meta-item">
          <text class="meta-item__label">指导老师</text>
          <text class="meta-item__value">{{
            club.teacher_advisor ?? "暂无"
          }}</text>
        </view>
        <view class="meta-item">
          <text class="meta-item__label">社长</text>
          <text class="meta-item__value">{{
            club.club_president ?? "暂无"
          }}</text>
        </view>
        <view v-if="club.activity_time" class="meta-item">
          <text class="meta-item__label">活动时间</text>
          <text class="meta-item__value">{{ club.activity_time }}</text>
        </view>
        <view v-if="club.activity_position" class="meta-item">
          <text class="meta-item__label">活动地点</text>
          <text class="meta-item__value">{{ club.activity_position }}</text>
        </view>
        <view v-if="club.foundation_year" class="meta-item">
          <text class="meta-item__label">成立年份</text>
          <text class="meta-item__value">{{ club.foundation_year }}</text>
        </view>
      </view>

      <!-- 名额区 -->
      <view class="card__quota">
        <view class="quota__left">
          <text class="quota__label">剩余名额</text>
          <text class="quota__num" :class="quotaNumClass">
            {{ club.remaining_quota }}
          </text>
        </view>
        <view class="quota__right">
          <view class="quota__stats">
            <text class="quota__stat-label">已选</text>
            <text class="quota__stat-value">{{ joined }}</text>
            <text class="quota__stat-sep">/</text>
            <text class="quota__stat-label">总额</text>
            <text class="quota__stat-value">{{ club.total_quota }}</text>
          </view>
          <text class="quota__pct">{{ pct }}% 已满</text>
        </view>
      </view>

      <!-- 进度条 -->
      <view class="progress">
        <view
          class="progress__fill"
          :style="{ width: pct + '%' }"
          :class="progressClass"
        />
      </view>

      <!-- ✅ 选社按钮 -->
      <view
        class="select-btn"
        :class="selectBtnClass"
        @click.stop="onSelectClub"
      >
        <!-- 流光：active / selecting 时才渲染 -->
        <view
          v-if="club.club_status === 1 || isSelecting"
          class="select-btn__glow"
        />

        <!-- 图标 -->
        <view class="select-btn__icon-wrap">
          <view v-if="isSelecting" class="select-btn__spinner" />
          <text v-else class="select-btn__icon">{{
            currentBtnConfig.icon
          }}</text>
        </view>

        <!-- 文字 -->
        <view class="select-btn__text-wrap">
          <text class="select-btn__label">{{ currentBtnConfig.label }}</text>
          <text class="select-btn__sub">{{ currentBtnConfig.sub }}</text>
        </view>

        <!-- 箭头：只在 active 非 selecting 时显示 -->
        <text
          v-if="club.club_status === 1 && !isSelecting"
          class="select-btn__arrow"
          >›</text
        >
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { useFavStore } from "@/stores/fav";
import { homeApi } from "@/api/home";

const favStore = useFavStore();
const isFav = computed(() => favStore.isFav(props.club.club_name));
const onToggleFav = async () => await favStore.toggleFav(props.club.club_name);

const props = defineProps({
  club: { type: Object, required: true },
  profile: { type: Object, required: true },
});

defineEmits(["click"]);

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

const coverStyle = computed(() => {
  if (props.club.cover_image) {
    return {
      backgroundImage: `url(${props.club.cover_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
});

const quotaNumClass = computed(() => ({
  "quota__num--full": isFull.value,
  "quota__num--urgent": isUrgent.value,
}));

const progressClass = computed(() => ({
  "progress__fill--full": isFull.value,
  "progress__fill--urgent": isUrgent.value,
}));

// ── 选社按钮配置 ──────────────────────────────────────────────
const currentBtnConfig = computed(() => {
  const map = {
    0: { icon: "🔒", label: "尚未开放", sub: "敬请期待" },
    1: { icon: "⚡", label: "立即选社", sub: "点击填报志愿" },
    2: { icon: "🚫", label: "名额已满", sub: "该社团已无剩余名额" },
    3: { icon: "🏁", label: "报名已结束", sub: "本轮招募已截止" },
    4: { icon: "🎫", label: "已选社", sub: "你已成功选择社团，无法再选" },
  };

  if (props.profile.is_reserved || props.profile.has_selected) return map[4];

  // ✅ selecting 优先级最高，放最前面
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
  "select-btn--selecting": isSelecting.value, // ✅ 新增
}));

// ── 点击处理 ──────────────────────────────────────────────────
const isSelecting = ref(false);

const onSelectClub = async () => {
  if (props.profile.is_reserved) return;
  if (props.club.club_status !== 1) return;
  if (props.profile.has_selected) return;
  if (isSelecting.value) return;

  isSelecting.value = true;

  // ✅ 选社中提示

  try {
    // ✅ 请求和最短等待时间并行，谁慢听谁的
    await Promise.all([
      homeApi.selectClub(props.club.club_name),
      new Promise((resolve) => setTimeout(resolve, 1000)), // 最短展示 800ms
    ]);
  } catch (e) {
    throw e;
  } finally {
    isSelecting.value = false;
  }
};
</script>

<style scoped>
/* ── 卡片容器 ── */
.card {
  width: 100%;
  border-radius: 28rpx;
  background: #1e293b;
  box-shadow:
    0 8rpx 32rpx rgba(0, 0, 0, 0.25),
    0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  margin-bottom: 24rpx;
}
.card:active {
  transform: scale(0.985);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

/* ── 封面区 ── */
.card__cover {
  position: relative;
  height: 200rpx;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card__cover-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.45) 100%
  );
}

/* ── badges ── */
.card__badges {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  gap: 10rpx;
}
.badge {
  padding: 6rpx 16rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
}
.badge--open {
  background: rgba(34, 197, 94, 0.25);
  border: 1rpx solid rgba(34, 197, 94, 0.6);
}
.badge--open .badge__text {
  color: #86efac;
  font-size: 20rpx;
  font-weight: 600;
}
.badge--full {
  background: rgba(239, 68, 68, 0.25);
  border: 1rpx solid rgba(239, 68, 68, 0.6);
}
.badge--full .badge__text {
  color: #fca5a5;
  font-size: 20rpx;
  font-weight: 600;
}
.badge--urgent {
  background: rgba(251, 191, 36, 0.25);
  border: 1rpx solid rgba(251, 191, 36, 0.6);
}
.badge--urgent .badge__text {
  color: #fde68a;
  font-size: 20rpx;
  font-weight: 600;
}
.badge--limit {
  background: rgba(99, 102, 241, 0.35);
  border: 1rpx solid rgba(139, 92, 246, 0.6);
}
.badge--limit .badge__text {
  color: #c4b5fd;
  font-size: 20rpx;
  font-weight: 600;
}

/* ── 收藏 ── */
.fav-btn {
  position: absolute;
  z-index: 2;
  top: 24rpx;
  right: 24rpx;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}
.fav-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.9);
}
.fav-btn__icon {
  font-size: 32rpx;
}

/* ── 标题 ── */
.card__title-wrap {
  position: relative;
  z-index: 1;
}
.card__name {
  display: block;
  font-size: 36rpx;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}
.card__super {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 6rpx;
}

/* ── 内容区 ── */
.card__body {
  padding: 24rpx;
}
.card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 28rpx;
}

/* ── 信息网格 ── */
.card__meta-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 28rpx;
}
.meta-item {
  background: rgba(255, 255, 255, 0.07);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  padding: 10rpx 18rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.meta-item__label {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.45);
}
.meta-item__value {
  font-size: 22rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* ── 名额 ── */
.card__quota {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20rpx;
}
.quota__label {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4rpx;
}
.quota__num {
  font-size: 80rpx;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  transition: color 0.3s ease;
}
.quota__num--full {
  color: #fca5a5;
}
.quota__num--urgent {
  color: #fde68a;
}
.quota__right {
  text-align: right;
}
.quota__stats {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 6rpx;
  margin-bottom: 6rpx;
}
.quota__stat-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.45);
}
.quota__stat-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #fff;
}
.quota__stat-sep {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.3);
}
.quota__pct {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

/* ── 进度条 ── */
.progress {
  height: 8rpx;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50rpx;
  overflow: hidden;
  margin-bottom: 32rpx; /* ← 给按钮留空间 */
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

/* ════════════════════════════════════════
   选社按钮
════════════════════════════════════════ */
.select-btn {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  gap: 16rpx;
  width: 100%;
  padding: 24rpx 32rpx;
  border-radius: 20rpx;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

/* 图标 */
.select-btn__icon {
  font-size: 40rpx;
  flex-shrink: 0;
  z-index: 1;
}

/* 文字 */
.select-btn__text-wrap {
  flex: 1;
  z-index: 1;
}
.select-btn__label {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1rpx;
}
.select-btn__sub {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 4rpx;
}

/* 右箭头 */
.select-btn__arrow {
  font-size: 56rpx;
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
    transform: translateX(8rpx);
    opacity: 1;
  }
}

/* ── 状态 0：未开放 ── */
.select-btn--locked {
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
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

/* ── 状态 1：抢课中 ── */
.select-btn--active {
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 60%, #a855f7 100%);
  box-shadow:
    0 8rpx 32rpx rgba(99, 102, 241, 0.5),
    0 2rpx 8rpx rgba(139, 92, 246, 0.4),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  animation: btn-pulse 2.4s ease-in-out infinite;
}
.select-btn--active:active {
  transform: scale(0.97);
  box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.4);
  animation: none;
}
@keyframes btn-pulse {
  0%,
  100% {
    box-shadow:
      0 8rpx 32rpx rgba(99, 102, 241, 0.5),
      0 2rpx 8rpx rgba(139, 92, 246, 0.4),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 12rpx 48rpx rgba(99, 102, 241, 0.75),
      0 4rpx 16rpx rgba(139, 92, 246, 0.6),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }
}

/* 抢课中 - 流光扫过动画 */
.select-btn__glow {
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 100%
  );
  animation: glow-sweep 2.8s ease-in-out infinite;
  z-index: 0;
}
@keyframes glow-sweep {
  0% {
    left: -75%;
  }
  60%,
  100% {
    left: 125%;
  }
}

/* ── 状态 2：名额已满 ── */
.select-btn--full {
  background: rgba(239, 68, 68, 0.12);
  border: 1rpx solid rgba(239, 68, 68, 0.3);
  cursor: not-allowed;
}
.select-btn--full .select-btn__label {
  color: #fca5a5;
}
.select-btn--full .select-btn__sub {
  color: rgba(252, 165, 165, 0.6);
}

/* ── 状态 3：已结束 ── */
.select-btn--ended {
  background: rgba(100, 116, 139, 0.15);
  border: 1rpx solid rgba(100, 116, 139, 0.3);
  cursor: not-allowed;
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

/* ── 状态 4：已预留 ── */
.select-btn--reserved {
  background: rgba(217, 119, 6, 0.15);
  border: 1rpx solid rgba(245, 158, 11, 0.45);
  cursor: not-allowed;
}
.select-btn--reserved .select-btn__label {
  color: #fcd34d;
}
.select-btn--reserved .select-btn__sub {
  color: rgba(252, 211, 77, 0.6);
}
.select-btn--reserved .select-btn__icon {
  opacity: 0.9;
  filter: drop-shadow(0 0 6rpx rgba(252, 211, 77, 0.4));
}
/* ── 状态：选社中 ── */
.select-btn--selecting {
  background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 60%, #7e22ce 100%);
  box-shadow:
    0 8rpx 32rpx rgba(99, 102, 241, 0.4),
    0 2rpx 8rpx rgba(109, 40, 217, 0.3),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.15);
  pointer-events: none;
  /* ✅ 亮度略暗 + 轻微缩小，传递"正在处理"的感觉 */
  filter: brightness(0.88);
  transform: scale(0.985);
  transition:
    transform 0.18s ease,
    filter 0.18s ease;
}

/* selecting 时 label 变为脉冲呼吸 */
.select-btn--selecting .select-btn__label {
  animation: text-breathe 1.2s ease-in-out infinite;
}
@keyframes text-breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

/* ── 图标容器，保持宽度稳定避免文字抖动 ── */
.select-btn__icon-wrap {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

/* ── 转圈 spinner ── */
.select-btn__spinner {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-right-color: rgba(255, 255, 255, 0.6);
  animation: btn-spin 0.7s linear infinite;
  box-shadow: 0 0 12rpx rgba(255, 255, 255, 0.25);
}
@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── 流光：改用 transform，修掉 left 动画 ── */
.select-btn__glow {
  position: absolute;
  top: 0;
  left: 0; /* ✅ 固定 left */
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 100%
  );
  transform: translateX(-150%); /* ✅ 初始在左侧外 */
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
</style>
