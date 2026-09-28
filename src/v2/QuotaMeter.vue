<template>
  <view :class="['quota', size, { stale }]">
    <view class="row between line">
      <view class="figure" :class="state"
        ><template v-if="remaining > 0"
          ><text class="label">剩余</text
          ><text :class="['num value', { bump }]">{{ remaining }}</text
          ><text class="unit num">/ 共 {{ capacity }}</text></template
        ><text v-else class="value full">名额已满</text></view
      ><text v-if="state === 'scarce'" class="tag hot">仅剩 {{ remaining }}</text
      ><slot />
    </view>
    <view class="track"
      ><view class="fill" :class="state" :style="`transform:scaleX(${ratio})`"
    /></view>
  </view>
</template>
<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { isScarce } from "./format";
const props = withDefaults(
  defineProps<{
    remaining: number;
    capacity: number;
    size?: "sm" | "lg";
    stale?: boolean;
  }>(),
  { size: "sm", stale: false },
);
const ratio = computed(() =>
  props.capacity > 0
    ? Math.min(1, Math.max(0, props.remaining / props.capacity))
    : 0,
);
const state = computed(() =>
  props.remaining <= 0
    ? "empty"
    : isScarce(props.remaining, props.capacity)
      ? "scarce"
      : "ok",
);
// Briefly highlight the number when a live quota update arrives.
const bump = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
watch(
  () => props.remaining,
  (next, prev) => {
    if (prev === undefined || next === prev) return;
    bump.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (bump.value = false), 700);
  },
);
onUnmounted(() => clearTimeout(timer));
</script>
<style scoped>
.line {
  gap: 12rpx;
}
.figure {
  display: flex;
  align-items: baseline;
  color: var(--c-ink);
}
.value {
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 8rpx;
  transition: color var(--t-base) var(--ease-out), background-color var(--t-base) var(--ease-out);
}
.value.bump {
  background: var(--c-primary-soft);
  color: var(--c-primary);
}
.label {
  margin-right: 8rpx;
  font-size: 24rpx;
  color: var(--c-ink-3);
}
.unit {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: var(--c-ink-3);
}
.figure.scarce .value {
  color: var(--c-hot);
}
.value.full {
  font-size: 26rpx;
  font-weight: 500;
  color: var(--c-ink-3);
}
.track {
  margin-top: 14rpx;
  height: 8rpx;
  border-radius: 4rpx;
  background: var(--c-fill-strong);
  overflow: hidden;
}
.fill {
  height: 100%;
  width: 100%;
  border-radius: 4rpx;
  background: #8faaf3;
  transform-origin: left center;
  transition: transform 400ms var(--ease-out);
}
.fill.scarce {
  background: var(--c-hot);
}
.lg .value {
  font-size: 64rpx;
  line-height: 1.1;
  letter-spacing: -1rpx;
}
.lg .unit {
  font-size: 28rpx;
}
.lg .label {
  font-size: 28rpx;
  margin-right: 12rpx;
}
.lg .value.full {
  font-size: 44rpx;
}
.lg .track {
  height: 12rpx;
  border-radius: 6rpx;
  margin-top: 20rpx;
}
.stale .value,
.stale .fill {
  opacity: 0.45;
}
</style>
