<template>
  <view class="body">
    <!-- ── 基本信息 ── -->
    <view class="section">
      <text class="section__title">📋 基本信息</text>
      <view class="card">
        <view
          v-for="(row, i) in infoRows"
          :key="row.key"
          class="info-row"
          :style="{ animationDelay: `${i * 0.06}s` }"
        >
          <view class="info-row__left">
            <text class="info-row__icon">{{ row.icon }}</text>
            <text class="info-row__label">{{ row.label }}</text>
          </view>
          <text class="info-row__value">{{
            profile[row.key] || "未填写"
          }}</text>
        </view>
      </view>
    </view>

    <!-- ── 社团状态 ── -->
    <view class="section">
      <text class="section__title">🏅 社团状态</text>

      <!-- 已报名 -->
      <view
        v-if="profile.is_reserved || profile.has_selected"
        class="club-card"
      >
        <view class="club-card__top">
          <view class="club-card__icon-wrap">
            <text class="club-card__icon">🎯</text>
          </view>
          <view class="club-card__tag">
            <text class="club-card__tag__text">{{
              profile.is_reserved ? "已预留" : "已报名 ✓"
            }}</text>
          </view>
        </view>
        <text class="club-card__name">{{
          profile.reserved_club_name || profile.selected_club_name
        }}</text>
        <text class="club-card__sub">
          {{ "🎉 已通过选拔" }}
        </text>
        <view
          class="club-card__quit"
          v-if="profile.has_selected"
          @click="$emit('quit-club')"
        >
          <text class="club-card__quit__text">退出社团</text>
        </view>
      </view>

      <!-- 未报名 -->
      <view v-else class="empty-club">
        <text class="empty-club__icon">🎯</text>
        <text class="empty-club__title">尚未报名任何社团</text>
        <text class="empty-club__sub">快去首页抢名额吧！</text>
        <view class="empty-club__btn" @click="goHome">
          <text class="empty-club__btn__text">去报名 →</text>
        </view>
      </view>
    </view>

    <!-- ── 退出登录 ── -->
    <view class="logout" @click="$emit('logout')">
      <text class="logout__icon">🚪</text>
      <text class="logout__text">退出登录</text>
    </view>
  </view>
</template>

<script setup>
defineProps({ profile: { type: Object, required: true } });
defineEmits(["logout", "quit-club"]);

const infoRows = [
  { key: "email", icon: "📧", label: "邮箱" },
  { key: "phone", icon: "📱", label: "手机" },
  { key: "department", icon: "🏛️", label: "学院" },
  { key: "major_name", icon: "🎓", label: "专业" },
  { key: "class_name", icon: "🏫", label: "班级" },
];
// 切换页面
const goHome = () => uni.switchTab({ url: "/pages/home/home" });
</script>

<style scoped lang="scss">
@import "@/styles/themes.scss";

.body {
  padding: 28rpx 28rpx 0;
  @include theme-aware(background-color, semantic, bg-canvas);
  // min-height: 100vh;
  transition: background-color 0.3s ease;
}

/* ════════════════════════════════════════════════════════════
   Section 区域
   ════════════════════════════════════════════════════════════ */
.section {
  margin-bottom: 28rpx;
  animation: fadeIn 0.5s ease both;
}

.section__title {
  font-size: 28rpx;
  font-weight: 700;
  @include theme-aware(color, semantic, fg-primary);
  margin-bottom: 16rpx;
  display: block;
  letter-spacing: 0.5rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
  padding: 0 4rpx;
}

/* ════════════════════════════════════════════════════════════
   信息卡片 (三层背景中的 L2)
   ════════════════════════════════════════════════════════════ */
.card {
  @include theme-aware(background-color, semantic, bg-raised);
  @include theme-aware(box-shadow, semantic, shadow-md);
  border-radius: 24rpx;
  overflow: hidden;
  border: 1.5rpx solid;
  @include theme-aware(border-color, semantic, border-subtle);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    @include theme-aware(box-shadow, semantic, shadow-lg);
    @include theme-aware(border-color, semantic, border-light);
  }
}

.info-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1.5rpx solid;
  @include theme-aware(border-bottom-color, semantic, border-subtle);
  @include theme-aware(background-color, semantic, bg-raised);
  animation: slideInLeft 0.4s ease both;
  transition: all 0.2s ease;

  &:hover {
    @include theme-aware(background-color, semantic, bg-interactive);
    @include theme-aware(border-bottom-color, semantic, border-light);
  }

  &:last-child {
    border-bottom: none;
  }
}

.info-row__left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.info-row__icon {
  font-size: 32rpx;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  @include theme-aware(background-color, semantic, bg-interactive);
  @include theme-aware(color, effect, glow-primary);
  flex-shrink: 0;
  transition: all 0.2s ease;

  .info-row:hover & {
    @include theme-aware(background-color, semantic, bg-interactive-hover);
    transform: scale(1.08);
  }
}

.info-row__label {
  font-size: 28rpx;
  @include theme-aware(color, semantic, fg-secondary);
  font-weight: 500;
  transition: color 0.2s ease;
}

.info-row__value {
  font-size: 28rpx;
  @include theme-aware(color, semantic, fg-primary);
  font-weight: 600;
  max-width: 380rpx;
  text-align: right;
  word-break: break-word;
  letter-spacing: 0.2rpx;
  transition: color 0.2s ease;
}

/* ════════════════════════════════════════════════════════════
   社团卡片 (视觉焦点 - 使用英雄渐变)
   ════════════════════════════════════════════════════════════ */
.club-card {
  @include theme-aware(background, effect, gradient-hero);
  border-radius: 24rpx;
  padding: 36rpx;
  margin: 10rpx 14rpx;
  @include theme-aware(box-shadow, semantic, shadow-brand);
  animation: slideInUp 0.5s ease both;
  border: 1.5rpx solid;
  @include theme-aware(border-color, semantic, border-accent);
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // 背景光晕效果
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    @include theme-aware(background, effect, glow-gradient);
    opacity: 0.3;
    animation: rotate 8s linear infinite;
    pointer-events: none;
  }

  &:hover {
    @include theme-aware(box-shadow, semantic, shadow-xl);
    transform: translateY(-4rpx);
  }

  &:active {
    transform: translateY(-2rpx);
  }
}

.club-card__top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  position: relative;
  z-index: 1;
}

.club-card__icon-wrap {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  @include theme-aware(background-color, semantic, bg-interactive-pressed);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2rpx solid;
  @include theme-aware(border-color, semantic, border-light);
  flex-shrink: 0;
  box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);

  &:hover {
    transform: scale(1.05) rotateZ(-2deg);
    box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  }
}

.club-card__icon {
  font-size: 48rpx;
  @include theme-aware(color, component, club-text-primary);
  transition: transform 0.3s ease;

  .club-card__icon-wrap:hover & {
    transform: scale(1.1);
  }
}

.club-card__tag {
  @include theme-aware(background-color, semantic, bg-interactive-pressed);
  border: 1.5rpx solid;
  @include theme-aware(border-color, semantic, border-light);
  border-radius: 50rpx;
  padding: 10rpx 24rpx;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    @include theme-aware(background-color, semantic, bg-interactive-active);
    @include theme-aware(border-color, semantic, border-strong);
  }
}

.club-card__tag__text {
  font-size: 22rpx;
  @include theme-aware(color, component, club-text-primary);
  font-weight: 700;
  letter-spacing: 0.5rpx;
}

.club-card__name {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  @include theme-aware(color, component, club-text-primary);
  margin-bottom: 12rpx;
  position: relative;
  z-index: 1;
  text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
  letter-spacing: 1rpx;
}

.club-card__sub {
  display: block;
  font-size: 24rpx;
  @include theme-aware(color, component, club-text-secondary);
  margin-bottom: 32rpx;
  position: relative;
  z-index: 1;
  opacity: 0.95;
}

.club-card__quit {
  @include theme-aware(background-color, semantic, bg-interactive-pressed);
  border: 1.5rpx solid;
  @include theme-aware(border-color, semantic, border-light);
  border-radius: 16rpx;
  padding: 22rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  cursor: pointer;
  backdrop-filter: blur(8px);

  &:hover {
    @include theme-aware(background-color, semantic, bg-interactive-active);
    @include theme-aware(border-color, semantic, border-strong);
    transform: translateY(-2rpx);
  }

  &:active {
    @include theme-aware(background-color, semantic, bg-interactive-active);
    transform: scale(0.98);
  }
}

.club-card__quit__text {
  font-size: 26rpx;
  @include theme-aware(color, component, club-text-primary);
  font-weight: 700;
  letter-spacing: 0.5rpx;
}

/* ════════════════════════════════════════════════════════════
   未报名状态 (空态)
   ════════════════════════════════════════════════════════════ */
.empty-club {
  @include theme-aware(background-color, semantic, bg-raised);
  @include theme-aware(box-shadow, semantic, shadow-md);
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  animation: slideInUp 0.5s ease both;
  border: 1.5rpx dashed;
  @include theme-aware(border-color, semantic, border-light);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  // 背景装饰
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    @include theme-aware(background, effect, glow-gradient);
    opacity: 0.05;
    pointer-events: none;
  }

  &:hover {
    @include theme-aware(border-color, semantic, border-accent);
    @include theme-aware(background-color, semantic, bg-interactive);
    transform: translateY(-2rpx);
    @include theme-aware(box-shadow, semantic, shadow-lg);
  }
}

.empty-club__icon {
  font-size: 88rpx;
  @include theme-aware(color, effect, glow-primary);
  opacity: 0.7;
  animation: float 3s ease-in-out infinite;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4rpx 12rpx rgba(0, 0, 0, 0.1));
}

.empty-club__title {
  font-size: 32rpx;
  font-weight: 800;
  @include theme-aware(color, semantic, fg-primary);
  text-align: center;
  margin: 12rpx 0;
  letter-spacing: 0.5rpx;
  position: relative;
  z-index: 1;
}

.empty-club__sub {
  font-size: 24rpx;
  @include theme-aware(color, semantic, fg-secondary);
  text-align: center;
  opacity: 0.85;
  position: relative;
  z-index: 1;
  line-height: 1.5;
}

.empty-club__btn {
  margin-top: 24rpx;
  @include theme-aware(background, effect, gradient-primary);
  border: none;
  border-radius: 50rpx;
  padding: 20rpx 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  @include theme-aware(box-shadow, effect, btn-active-shadow);
  position: relative;
  overflow: hidden;
  z-index: 2;

  // 按钮光晕
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @include theme-aware(background, effect, glow-gradient);
    opacity: 0;
    animation: shimmer 2s infinite;
  }

  &:hover {
    transform: translateY(-4rpx);
    @include theme-aware(box-shadow, effect, btn-pulse-shadow);
  }

  &:active {
    transform: translateY(-1rpx);
    opacity: 0.95;
  }
}

.empty-club__btn__text {
  font-size: 28rpx;
  @include theme-aware(color, semantic, fg-inverse-primary);
  font-weight: 700;
  letter-spacing: 0.5rpx;
  position: relative;
  z-index: 1;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

/* ════════════════════════════════════════════════════════════
   退出登录按钮 (使用错误色)
   ════════════════════════════════════════════════════════════ */
.logout {
  @include theme-aware(background-color, semantic, bg-raised);
  @include theme-aware(box-shadow, semantic, shadow-md);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  border: 1.5rpx solid;
  @include theme-aware(border-color, state, error-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  user-select: none;

  // 背景光圈效果
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    @include theme-aware(background-color, state, error-bg-subtle);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover {
    @include theme-aware(background-color, state, error-bg-subtle);
    @include theme-aware(box-shadow, semantic, shadow-lg);
    @include theme-aware(border-color, state, error-text);
    transform: translateY(-2rpx);
  }

  &:active {
    transform: scale(0.98);
  }
}

.logout__icon {
  font-size: 32rpx;
  @include theme-aware(color, state, error-text);
  flex-shrink: 0;
  animation: shake 0.4s ease-in-out;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;

  .logout:hover & {
    animation: shake 0.5s ease-in-out;
  }
}

.logout__text {
  font-size: 28rpx;
  @include theme-aware(color, state, error-text);
  font-weight: 700;
  letter-spacing: 0.5rpx;
  position: relative;
  z-index: 1;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
}

/* ════════════════════════════════════════════════════════════
   动画定义
   ════════════════════════════════════════════════════════════ */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12rpx);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4rpx);
  }
  50% {
    transform: translateX(0);
  }
  75% {
    transform: translateX(4rpx);
  }
}

/* ════════════════════════════════════════════════════════════
   响应式设计
   ════════════════════════════════════════════════════════════ */
@media (max-height: 800px) {
  .body {
    padding: 20rpx 20rpx 0;
  }

  .section {
    margin-bottom: 20rpx;
  }

  .empty-club {
    padding: 40rpx 32rpx;
  }
}

@media (max-width: 750px) {
  .info-row__value {
    max-width: 280rpx;
    font-size: 26rpx;
  }

  .club-card {
    padding: 28rpx;
  }

  .club-card__name {
    font-size: 36rpx;
  }
}
</style>
