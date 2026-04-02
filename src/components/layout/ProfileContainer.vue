<!-- components/layout/HomeContainer.vue -->
<template>
  <view class="profile-container">
    <scroll-view
      class="profile-body"
      scroll-y
      :style="{ padding: bodyPadding }"
      enhanced
      :show-scrollbar="false"
    >
      <slot />
    </scroll-view>

    <view class="profile-footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  bodyPadding: { type: String, default: "32rpx" },
  bgColor: { type: String, default: "#F9FAFB" },
});
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: v-bind(bgColor);
}

.profile-body {
  flex: 1;
  overflow: hidden;
}

.profile-footer {
  flex-shrink: 0;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.06);
  z-index: 100;
}
</style>
