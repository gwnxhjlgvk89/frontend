<template>
  <view :class="['banner', tone]" role="status">
    <view class="lead"><UiIcon :name="iconName" :size="36" /></view>
    <view class="grow">
      <view v-if="title" class="title">{{ title }}</view>
      <view class="text"><slot /></view>
      <view v-if="$slots.action" class="action"><slot name="action" /></view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed } from "vue";
import UiIcon from "./UiIcon.vue";
import type { IconName } from "./icons";
const props = withDefaults(
  defineProps<{
    tone?: "info" | "success" | "warn" | "danger" | "pending";
    title?: string;
    icon?: IconName;
  }>(),
  { tone: "info" },
);
const iconName = computed<IconName>(
  () =>
    props.icon ||
    {
      info: "info",
      success: "circle-check",
      warn: "triangle-alert",
      danger: "circle-x",
      pending: "refresh-cw",
    }[props.tone] as IconName,
);
</script>
<style scoped>
.banner {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 24rpx 28rpx;
  border-radius: var(--r-md);
  font-size: 26rpx;
  line-height: 1.55;
  background: var(--c-fill);
  color: var(--c-ink-2);
}
.lead {
  display: flex;
  margin-top: 4rpx;
}
.title {
  font-weight: 600;
  color: var(--c-ink);
  margin-bottom: 4rpx;
}
.action {
  margin-top: 16rpx;
}
.info {
  background: var(--c-primary-soft);
}
.info .lead {
  color: var(--c-primary);
}
.success {
  background: var(--c-success-soft);
}
.success .lead,
.success .title {
  color: var(--c-success);
}
.warn {
  background: var(--c-warn-soft);
}
.warn .lead,
.warn .title {
  color: var(--c-warn);
}
.danger {
  background: var(--c-danger-soft);
}
.danger .lead,
.danger .title {
  color: var(--c-danger);
}
.pending .lead {
  color: var(--c-primary);
  animation: spin 1.2s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
