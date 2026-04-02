<template>
  <view class="login__header">
    <image class="login__logo" :src="cdn.logo" mode="aspectFit" />
    <text class="login__title">{{ props.title }}</text>
  </view>
</template>

<script setup>
import cdn from "@/utils/cdn";
const props = defineProps({
  title: {
    type: String,
    default: "Sign in to your account.",
  },
});
</script>

<style lang="scss" scoped>
.login__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  width: 100%;

  .login__logo {
    width: 140rpx;
    height: 140rpx;
  }

  .login__title {
    font-size: 44rpx;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.5rpx;
    white-space: nowrap;
    overflow: hidden;
    max-width: fit-content;
    border-right: 6rpx solid #4f46e5;
    animation:
      typeloop 7s linear infinite,
      blink-caret 0.75s step-start infinite;
  }
}

@keyframes typeloop {
  0% {
    max-width: 0;
    animation-timing-function: steps(23, end);
  }
  33% {
    max-width: 100%;
    animation-timing-function: steps(1, end);
  }
  50% {
    max-width: 100%;
    animation-timing-function: steps(23, end);
  }
  83% {
    max-width: 0;
    animation-timing-function: steps(1, end);
  }
  100% {
    max-width: 0;
  }
}

@keyframes blink-caret {
  0%,
  100% {
    border-color: #4f46e5;
  }
  50% {
    border-color: transparent;
  }
}
</style>
