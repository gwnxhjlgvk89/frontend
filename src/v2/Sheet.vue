<template>
  <view v-if="mounted" :class="['sheet-root', { open }]" @touchmove.stop.prevent>
    <view class="scrim" @tap="dismiss" />
    <view class="sheet" role="dialog" :aria-label="title">
      <view v-if="title" class="head">
        <text class="h3">{{ title }}</text>
        <view class="icon-btn close" @tap="dismiss" aria-label="关闭"
          ><UiIcon name="x" :size="40"
        /></view>
      </view>
      <scroll-view scroll-y class="body" :class="{ scroll }"
        ><view class="body-inner"><slot /></view
      ></scroll-view>
      <view v-if="$slots.footer" class="foot"><slot name="footer" /></view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import UiIcon from "./UiIcon.vue";
const props = withDefaults(
  defineProps<{
    show: boolean;
    title?: string;
    scroll?: boolean;
    locked?: boolean;
  }>(),
  { scroll: false, locked: false },
);
const emit = defineEmits<{ close: [] }>();
const mounted = ref(props.show),
  open = ref(props.show);
let timer: ReturnType<typeof setTimeout> | undefined;
watch(
  () => props.show,
  (show) => {
    clearTimeout(timer);
    if (show) {
      mounted.value = true;
      // Let the closed state render once so the sheet slides in.
      timer = setTimeout(() => (open.value = true), 20);
    } else {
      open.value = false;
      timer = setTimeout(() => (mounted.value = false), 240);
    }
  },
);
onUnmounted(() => clearTimeout(timer));
function dismiss() {
  if (!props.locked) emit("close");
}
</script>
<style scoped>
.sheet-root {
  position: fixed;
  inset: 0;
  z-index: 50;
}
.scrim {
  position: absolute;
  inset: 0;
  background: var(--c-scrim);
  opacity: 0;
  transition: opacity var(--t-base) ease-out;
}
.sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: var(--c-surface);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  box-shadow: var(--shadow-sheet);
  padding-bottom: env(safe-area-inset-bottom);
  transform: translateY(100%);
  transition: transform 260ms var(--ease-out);
}
.open .scrim {
  opacity: 1;
}
.open .sheet {
  transform: translateY(0);
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 8rpx;
}
.close {
  margin-right: -12rpx;
}
.body {
  width: 100%;
}
.body-inner {
  padding: 16rpx 32rpx 8rpx;
}
.body.scroll {
  max-height: 60vh;
}
.foot {
  padding: 24rpx 32rpx;
}
</style>
