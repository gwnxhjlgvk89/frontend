<template>
  <view class="hero">
    <!-- 背景装饰 -->
    <view class="hero__bg" />
    <view class="hero__circle hero__circle--1" />
    <view class="hero__circle hero__circle--2" />

    <!-- 头像 -->
    <view class="avatar-wrap" @click="$emit('change-avatar')">
      <image
        class="avatar"
        :src="profile.avatar || cdn.defaultavatar"
        mode="aspectFill"
      />
      <view class="avatar__badge">
        <text class="avatar__badge__icon">📷</text>
      </view>
    </view>

    <!-- 姓名 / 学号 -->
    <text class="hero__name">{{ profile.name || "未设置姓名" }}</text>
    <text class="hero__dept">{{ profile.department || "——" }}</text>
    <text class="hero__id">学号：{{ profile.student_id || "——" }}</text>

    <!-- 统计徽章行 -->
    <view class="hero__badges">
      <view class="badge">
        <text class="badge__val">{{ profile.major_name || "——" }}</text>
        <text class="badge__key">专业</text>
      </view>
      <view class="badge__divider" />
      <view class="badge">
        <text class="badge__val">{{ profile.class_name || "——" }}</text>
        <text class="badge__key">班级</text>
      </view>
      <view class="badge__divider" />
      <view class="badge">
        <text class="badge__val">{{
          profile.is_reserved
            ? "已预留"
            : profile.has_selected
              ? "已报名"
              : "未报名"
        }}</text>
        <text class="badge__key">社团</text>
      </view>
    </view>

    <!-- 编辑按钮 -->
    <view class="edit-btn" @click="$emit('edit')">
      <text class="edit-btn__icon">✏️</text>
      <text class="edit-btn__text">编辑资料</text>
    </view>
  </view>
</template>

<script setup>
import cdn from "@/utils/cdn";

defineProps({ profile: { type: Object, required: true } });
defineEmits(["edit", "change-avatar"]);
</script>

<style scoped>
/* ── Hero 容器 ── */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 72rpx 40rpx 52rpx;
  overflow: hidden;
}

/* 渐变背景 */
.hero__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #4338ca 0%, #6d28d9 55%, #a855f7 100%);
  z-index: 0;
}

/* 装饰圆 */
.hero__circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  z-index: 0;
  animation: float 5s ease-in-out infinite;
}
.hero__circle--1 {
  width: 420rpx;
  height: 420rpx;
  top: -150rpx;
  right: -100rpx;
}
.hero__circle--2 {
  width: 300rpx;
  height: 300rpx;
  bottom: -80rpx;
  left: -80rpx;
  animation-delay: -3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-40rpx);
  }
}

/* 头像 */
.avatar-wrap {
  position: relative;
  z-index: 1;
  margin-bottom: 24rpx;
  animation: fadeDown 0.5s ease both;
}
.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 6rpx solid rgba(255, 255, 255, 0.85);
  background: #c4b5fd;
  display: block;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.25);
}
.avatar__badge {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}
.avatar__badge__icon {
  font-size: 24rpx;
}

/* 文字 */
.hero__name {
  position: relative;
  z-index: 1;
  font-size: 42rpx;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2rpx;
  animation: fadeDown 0.5s 0.1s ease both;
}
.hero__dept {
  position: relative;
  z-index: 1;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 6rpx;
  animation: fadeDown 0.5s 0.15s ease both;
}
.hero__id {
  position: relative;
  z-index: 1;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4rpx;
  margin-bottom: 32rpx;
  animation: fadeDown 0.5s 0.2s ease both;
}

/* 徽章行 */
.hero__badges {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  padding: 20rpx 32rpx;
  margin-bottom: 32rpx;
  gap: 24rpx;
  backdrop-filter: blur(8px);
  animation: fadeDown 0.5s 0.25s ease both;
}
.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.badge__val {
  font-size: 22rpx;
  font-weight: 700;
  color: #fff;
}
.badge__key {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.65);
}
.badge__divider {
  width: 1.5rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.25);
}

/* 编辑按钮 */
.edit-btn {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 50rpx;
  padding: 16rpx 40rpx;
  transition: background 0.2s;
  animation: fadeDown 0.5s 0.3s ease both;
}
.edit-btn:active {
  background: rgba(255, 255, 255, 0.35);
}
.edit-btn__icon {
  font-size: 24rpx;
}
.edit-btn__text {
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
}

@keyframes fadeDown {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
