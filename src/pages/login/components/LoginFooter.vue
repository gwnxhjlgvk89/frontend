<template>
  <view class="login__footer">
    <text class="login__footer-text">需要帮助？&nbsp;</text>
    <text class="login__footer-link" @click="contactAdmin">联系管理员</text>
  </view>
</template>

<script setup>
import { showToast, hideToast } from "@/utils/toast";
// 纯展示组件，无需任何逻辑

function contactAdmin() {
  showToast({ title: "Not Supported Yet", icon: "error" });
}
</script>

<style lang="scss" scoped>
.login__footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 48rpx;

  .login__footer-text {
    font-size: 24rpx;
    color: #6b7280;
  }

  .login__footer-link {
    font-size: 24rpx;
    font-weight: 600;
    color: #4f46e5;
  }
}
</style>
