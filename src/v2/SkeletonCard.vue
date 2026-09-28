<template>
  <view class="card sk row" aria-hidden="true">
    <view class="block tile" />
    <view class="grow">
      <view class="block line w60" />
      <view class="block line w80 thin" />
      <view class="block line w40 thin" />
      <view class="block bar" />
    </view>
  </view>
</template>
<style scoped>
.sk {
  align-items: flex-start;
  gap: 24rpx;
}
.block {
  background: var(--c-fill);
  border-radius: 8rpx;
  animation: breathe 1.4s ease-in-out infinite;
}
.tile {
  width: 128rpx;
  height: 128rpx;
  border-radius: 28rpx;
}
.line {
  height: 32rpx;
  margin-bottom: 16rpx;
}
.thin {
  height: 24rpx;
}
.w40 {
  width: 40%;
}
.w60 {
  width: 60%;
}
.w80 {
  width: 80%;
}
.bar {
  height: 8rpx;
  margin-top: 8rpx;
}
@keyframes breathe {
  50% {
    opacity: 0.5;
  }
}
</style>
