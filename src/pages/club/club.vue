<template>
  <view class="club-detail">
    <!-- ── 滚动容器 ── -->
    <scroll-view class="scroll-container" scroll-y @scroll="onScroll">
      <!-- ── 封面区 ── -->
      <view class="cover-section" :style="coverStyle">
        <!-- 收藏按钮放在右上角 -->
        <view class="cover-fav" @click.stop="onToggleFav">
          <text class="cover-fav__icon">{{ isFav ? "⭐" : "☆" }}</text>
        </view>

        <view class="cover-mask" />

        <!-- Badge 区域 -->
        <view class="cover-badges">
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

        <!-- 标题 -->
        <view class="cover-title">
          <text class="cover-name">{{ club.club_name }}</text>
          <text v-if="club.super_club" class="cover-super">
            隶属：{{ club.super_club }}
          </text>
        </view>
      </view>

      <!-- ── 内容区 ── -->
      <view class="content">
        <!-- 基础信息卡片 -->
        <view class="info-card">
          <view class="info-card__header">
            <text class="info-card__title">基础信息</text>
          </view>

          <!-- 简介 -->
          <view class="info-section">
            <text class="info-label">社团简介</text>
            <text class="info-text">{{ club.description || "暂无介绍" }}</text>
          </view>

          <!-- 联系人信息 -->
          <view class="info-grid">
            <view class="info-item">
              <text class="info-item__label">指导老师</text>
              <text class="info-item__value">{{
                club.teacher_advisor ?? "暂无"
              }}</text>
            </view>
            <view class="info-item">
              <text class="info-item__label">社长</text>
              <text class="info-item__value">{{
                club.club_president ?? "暂无"
              }}</text>
            </view>
            <view class="info-item">
              <text class="info-item__label">成立年份</text>
              <text class="info-item__value">{{
                club.foundation_year ?? "暂无"
              }}</text>
            </view>
          </view>
        </view>

        <!-- 活动信息卡片 -->
        <view class="info-card">
          <view class="info-card__header">
            <text class="info-card__title">活动信息</text>
          </view>

          <view v-if="club.activity_time" class="info-section">
            <text class="info-label">活动时间</text>
            <text class="info-text">{{ club.activity_time }}</text>
          </view>

          <view v-if="club.activity_position" class="info-section">
            <text class="info-label">活动地点</text>
            <text class="info-text">{{ club.activity_position }}</text>
          </view>

          <view
            v-if="!club.activity_time && !club.activity_position"
            class="empty-state"
          >
            <text class="empty-state__text">暂无活动信息</text>
          </view>
        </view>

        <!-- 名额信息卡片 -->
        <view class="info-card">
          <view class="info-card__header">
            <text class="info-card__title">名额信息</text>
          </view>

          <!-- 大数字展示 -->
          <view class="quota-display">
            <view class="quota-display__item">
              <text class="quota-display__label">总名额</text>
              <text class="quota-display__value">{{ club.total_quota }}</text>
            </view>
            <view class="quota-display__divider" />
            <view class="quota-display__item">
              <text class="quota-display__label">已报名</text>
              <text class="quota-display__value">{{ joined }}</text>
            </view>
            <view class="quota-display__divider" />
            <view class="quota-display__item">
              <text class="quota-display__label">剩余名额</text>
              <text class="quota-display__value" :class="quotaNumClass">
                {{ club.remaining_quota }}
              </text>
            </view>
          </view>

          <!-- 进度条 -->
          <view class="progress-section">
            <view class="progress-header">
              <text class="progress-label">报名进度</text>
              <text class="progress-pct">{{ pct }}% 已满</text>
            </view>
            <view class="progress">
              <view
                class="progress__fill"
                :style="{ width: pct + '%' }"
                :class="progressClass"
              />
            </view>
          </view>
        </view>

        <!-- 详细介绍卡片 -->
        <view v-if="club.description_detail" class="info-card">
          <view class="info-card__header">
            <text class="info-card__title">详细介绍</text>
          </view>

          <view class="detail-content">
            <text class="detail-text">{{ club.description_detail }}</text>
          </view>
        </view>

        <!-- 底部空白，为固定按钮预留空间 -->
        <view class="spacer" />
      </view>
    </scroll-view>

    <!-- ── 底部固定按钮 ── -->
    <view class="footer">
      <view class="footer__content">
        <!-- 状态指示 -->
        <view class="footer__status">
          <text class="footer__status-text">
            {{
              club.club_status === 0
                ? "社团尚未开放"
                : club.club_status === 2
                  ? "名额已满，无法报名"
                  : club.club_status === 3
                    ? "报名已结束"
                    : ""
            }}
          </text>
        </view>

        <!-- 按钮 -->
        <view
          class="action-btn"
          :class="actionBtnClass"
          @click.stop="onSelectClub"
        >
          <view
            v-if="club.club_status === 1 || isSelecting"
            class="action-btn__glow"
          />

          <view class="action-btn__icon-wrap">
            <view v-if="isSelecting" class="action-btn__spinner" />
            <text v-else class="action-btn__icon">{{
              currentBtnConfig.icon
            }}</text>
          </view>

          <view class="action-btn__text-wrap">
            <text class="action-btn__label">{{ currentBtnConfig.label }}</text>
            <text class="action-btn__sub">{{ currentBtnConfig.sub }}</text>
          </view>

          <text
            v-if="club.club_status === 1 && !isSelecting"
            class="action-btn__arrow"
            >›</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useFavStore } from "@/stores/fav";
import { homeApi } from "@/api/home";
import { onLoad } from "@dcloudio/uni-app";
import { showToast } from "@/utils/toast";

const club = ref({});
const profile = ref({});
const favStore = useFavStore();

// ✨ 使用 onLoad 获取页面参数和本地存储的数据
onLoad(() => {
  club.value = uni.getStorageSync("clubData") || {};
  profile.value = uni.getStorageSync("profileData") || {};

  console.log("详情页接收到的数据：", {
    club: club.value,
    profile: profile.value,
  });
});

const isFav = computed(() => favStore.isFav(club.value.club_name));
const onToggleFav = async () => await favStore.toggleFav(club.value.club_name);

// ── 返回上一页 ──
const onBack = () => {
  uni.navigateBack({
    delta: 1, // 返回上一页
  });
};

// ── 计算属性 ──
const joined = computed(
  () => club.value.total_quota - club.value.remaining_quota,
);
const pct = computed(() =>
  Math.round((joined.value / club.value.total_quota) * 100),
);
const isFull = computed(() => club.value.remaining_quota === 0);
const isUrgent = computed(
  () => club.value.remaining_quota <= 3 && !isFull.value,
);

const coverStyle = computed(() => {
  if (club.value.cover_image) {
    return {
      backgroundImage: `url(${club.value.cover_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
});

const quotaNumClass = computed(() => ({
  "quota-display__value--full": isFull.value,
  "quota-display__value--urgent": isUrgent.value,
}));

const progressClass = computed(() => ({
  "progress__fill--full": isFull.value,
  "progress__fill--urgent": isUrgent.value,
}));

// ── 按钮配置 ──
const currentBtnConfig = computed(() => {
  const map = {
    0: { icon: "🔒", label: "尚未开放", sub: "敬请期待" },
    1: { icon: "⚡", label: "立即选社", sub: "点击填报志愿" },
    2: { icon: "🚫", label: "名额已满", sub: "该社团已无剩余名额" },
    3: { icon: "🏁", label: "报名已结束", sub: "本轮招募已截止" },
    4: { icon: "🎫", label: "已选社", sub: "你已成功选择社团，无法再选" },
  };

  if (profile.value.is_reserved || profile.value.has_selected) return map[4];
  if (isSelecting.value) {
    return {
      icon: "__loading__",
      label: "报名中",
      sub: "正在为你提交志愿，请稍候…",
    };
  }

  return map[club.value.club_status] ?? map[0];
});

const actionBtnClass = computed(() => ({
  "action-btn--locked": club.value.club_status === 0,
  "action-btn--active": club.value.club_status === 1 && !isSelecting.value,
  "action-btn--full": club.value.club_status === 2,
  "action-btn--ended": club.value.club_status === 3,
  "action-btn--reserved":
    profile.value.is_reserved || profile.value.has_selected,
  "action-btn--selecting": isSelecting.value,
}));

// ── 滚动和选社逻辑 ──
const isSelecting = ref(false);
const headerHidden = ref(false);

const onScroll = (e) => {
  headerHidden.value = e.detail.scrollTop > 100;
};

const onSelectClub = async () => {
  if (profile.value.is_reserved) return;
  if (club.value.club_status !== 1) return;
  if (profile.value.has_selected) return;
  if (isSelecting.value) return;

  isSelecting.value = true;

  try {
    await Promise.all([
      homeApi.selectClub(club.value.club_name),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);

    // ✅ 选社成功后，可选：返回上一页或显示成功提示
    showToast({
      title: "报名成功",
      icon: "success",
      duration: 1500,
    });

    // 延迟后返回，让用户看到成功提示
    setTimeout(() => {
      uni.navigateBack({
        delta: 1,
      });
    }, 1500);
  } catch (e) {
    // ✅ 错误处理
    showToast({
      title: e.message || "报名失败，请重试",
      icon: "error",
      duration: 1500,
    });
    throw e;
  } finally {
    isSelecting.value = false;
  }
};
</script>

<style scoped>
/* ════════════════════════════════════════  
   整体布局  
════════════════════════════════════════ */
.club-detail {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: #0f172a;
  overflow: hidden;
}

/* ── 收藏按钮（右上角） ── */
.cover-fav {
  position: absolute;
  z-index: 10;
  top: 24rpx;
  right: 70rpx;
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

.cover-fav:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.9);
}

.cover-fav__icon {
  font-size: 32rpx;
}

/* ── 滚动容器 ── */
.scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ════════════════════════════════════════  
   封面区  
════════════════════════════════════════ */
.cover-section {
  position: relative;
  width: 100%;
  height: 320rpx;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32rpx 28rpx;
  overflow: hidden;
}

.cover-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

.cover-badges {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  gap: 10rpx;
  margin-bottom: 20rpx;
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

.cover-title {
  position: relative;
  z-index: 2;
}
.cover-name {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}
.cover-super {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 8rpx;
}

/* ════════════════════════════════════════  
   内容区  
════════════════════════════════════════ */
.content {
  padding: 32rpx 24rpx;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}

.info-card__header {
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.08);
}

.info-card__title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1rpx;
}

/* ── 信息段落 ── */
.info-section {
  margin-bottom: 24rpx;
}
.info-section:last-child {
  margin-bottom: 0;
}

.info-label {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 8rpx;
  font-weight: 600;
}

.info-text {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  letter-spacing: 0.5rpx;
}

/* ── 信息网格 ── */
.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 0;
}

.info-item {
  flex: 1;
  min-width: 100rpx;
  background: rgba(99, 102, 241, 0.08);
  border: 1rpx solid rgba(99, 102, 241, 0.2);
  border-radius: 16rpx;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.info-item__label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
}

.info-item__value {
  font-size: 24rpx;
  font-weight: 700;
  color: #c4b5fd;
}

/* ── 空状态 ── */
.empty-state {
  padding: 40rpx 0;
  text-align: center;
}
.empty-state__text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.35);
}

/* ════════════════════════════════════════  
   名额信息卡片  
════════════════════════════════════════ */
.quota-display {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 32rpx;
  padding: 24rpx 0;
  border-top: 1rpx solid rgba(255, 255, 255, 0.08);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.08);
}

.quota-display__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.quota-display__label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
}

.quota-display__value {
  font-size: 56rpx;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
}

.quota-display__value--full {
  color: #fca5a5;
}

.quota-display__value--urgent {
  color: #fde68a;
}

.quota-display__divider {
  width: 1rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
}

/* ── 进度条区 ── */
.progress-section {
  margin: 0;
}

.progress-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.progress-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
}

.progress-pct {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 600;
}

.progress {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.1);
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

/* ── 详细介绍 ── */
.detail-content {
  padding: 16rpx 0;
}

.detail-text {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 2;
  letter-spacing: 0.5rpx;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ── 底部空白 ── */
.spacer {
  height: 205rpx;
}

/* ════════════════════════════════════════  
   底部固定区域  
════════════════════════════════════════ */
.footer {
  position: fixed;
  z-index: 99;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0),
    rgba(15, 23, 42, 0.95)
  );
  backdrop-filter: blur(12px);
  border-top: 1rpx solid rgba(255, 255, 255, 0.08);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.footer__content {
  padding: 10rpx 24rpx;
  max-width: 100%;
}

.footer__status {
  text-align: center;
  margin-bottom: 12rpx;
  min-height: 28rpx;
}

.footer__status-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.45);
}

/* ════════════════════════════════════════  
   action 按钮  
════════════════════════════════════════ */
.action-btn {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  gap: 16rpx;
  width: 100%;
  padding: 20rpx 32rpx;
  border-radius: 20rpx;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

.action-btn__icon-wrap {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

.action-btn__icon {
  font-size: 40rpx;
  z-index: 1;
}

.action-btn__text-wrap {
  flex: 1;
  z-index: 1;
}

.action-btn__label {
  display: block;
  font-size: 28rpx;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1rpx;
}

.action-btn__sub {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 4rpx;
}

.action-btn__arrow {
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
.action-btn--locked {
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
}
.action-btn--locked .action-btn__label {
  color: rgba(255, 255, 255, 0.35);
}
.action-btn--locked .action-btn__sub {
  color: rgba(255, 255, 255, 0.2);
}
.action-btn--locked .action-btn__icon {
  opacity: 0.4;
}

/* ── 状态 1：抢课中 ── */
.action-btn--active {
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 60%, #a855f7 100%);
  box-shadow:
    0 8rpx 32rpx rgba(99, 102, 241, 0.5),
    0 2rpx 8rpx rgba(139, 92, 246, 0.4),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  animation: btn-pulse 2.4s ease-in-out infinite;
}
.action-btn--active:active {
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

/* 流光扫过动画 */
.action-btn__glow {
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

/* ── 状态 2：名额已满 ── */
.action-btn--full {
  background: rgba(239, 68, 68, 0.12);
  border: 1rpx solid rgba(239, 68, 68, 0.3);
  cursor: not-allowed;
}
.action-btn--full .action-btn__label {
  color: #fca5a5;
}
.action-btn--full .action-btn__sub {
  color: rgba(252, 165, 165, 0.6);
}

/* ── 状态 3：已结束 ── */
.action-btn--ended {
  background: rgba(100, 116, 139, 0.15);
  border: 1rpx solid rgba(100, 116, 139, 0.3);
  cursor: not-allowed;
}
.action-btn--ended .action-btn__label {
  color: rgba(148, 163, 184, 0.8);
}
.action-btn--ended .action-btn__sub {
  color: rgba(148, 163, 184, 0.45);
}
.action-btn--ended .action-btn__icon {
  opacity: 0.5;
}

/* ── 状态 4：已预留/已选社 ── */
.action-btn--reserved {
  background: rgba(217, 119, 6, 0.15);
  border: 1rpx solid rgba(245, 158, 11, 0.45);
  cursor: not-allowed;
}
.action-btn--reserved .action-btn__label {
  color: #fcd34d;
}
.action-btn--reserved .action-btn__sub {
  color: rgba(252, 211, 77, 0.6);
}
.action-btn--reserved .action-btn__icon {
  opacity: 0.9;
  filter: drop-shadow(0 0 6rpx rgba(252, 211, 77, 0.4));
}

/* ── 状态：报名中 ── */
.action-btn--selecting {
  background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 60%, #7e22ce 100%);
  box-shadow:
    0 8rpx 32rpx rgba(99, 102, 241, 0.4),
    0 2rpx 8rpx rgba(109, 40, 217, 0.3),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.15);
  pointer-events: none;
  filter: brightness(0.88);
  transform: scale(0.985);
  transition:
    transform 0.18s ease,
    filter 0.18s ease;
}

/* selecting 时文字脉冲呼吸 */
.action-btn--selecting .action-btn__label {
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

/* ── Spinner 动画 ── */
.action-btn__spinner {
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

/* ════════════════════════════════════════
   响应式设计
════════════════════════════════════════ */
@media (max-width: 320px) {
  .cover-name {
    font-size: 36rpx;
  }

  .action-btn__label {
    font-size: 24rpx;
  }

  .quota-display__value {
    font-size: 48rpx;
  }
}

@media (min-width: 768px) {
  .cover-section {
    height: 400rpx;
  }

  .info-grid {
    gap: 20rpx;
  }

  .info-card {
    padding: 36rpx;
  }
}

/* ════════════════════════════════════════
   滚动条美化（仅支持部分浏览器）
════════════════════════════════════════ */
.scroll-container::-webkit-scrollbar {
  width: 4rpx;
}

.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4rpx;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
