<template>
  <view class="empty">
    <view class="badge"><UiIcon :name="icon" :size="48" /></view>
    <view class="h3 title">{{ title }}</view>
    <view v-if="text" class="caption">{{ text }}</view>
    <view v-if="$slots.default" class="action"><slot /></view>
  </view>
</template>
<script setup lang="ts">
import UiIcon from "./UiIcon.vue";
import type { IconName } from "./icons";
withDefaults(defineProps<{ icon?: IconName; title: string; text?: string }>(), {
  icon: "search",
});
</script>
<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 72rpx 48rpx;
}
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  border-radius: 56rpx;
  background: var(--c-fill-strong);
  color: var(--c-ink-3);
}
.title {
  margin: 28rpx 0 8rpx;
}
.action {
  margin-top: 32rpx;
}
</style>
