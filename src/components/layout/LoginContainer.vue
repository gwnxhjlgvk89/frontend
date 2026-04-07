<template>
  <view class="login-container">
    <view class="login-header">
      <slot name="header" />
    </view>
    <view class="login-body">
      <slot name="body" />
    </view>
    <!-- <view class="login-footer">
      <slot name="footer" />
    </view> -->
  </view>
</template>

<script setup></script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 120rpx 60rpx;
  background-color: #f9fafb;
  box-sizing: border-box;
}
</style>
