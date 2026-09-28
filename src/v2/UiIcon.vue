<template>
  <view class="icon" :style="style" aria-hidden="true" />
</template>
<script setup lang="ts">
import { computed } from "vue";
import { icons, type IconName } from "./icons";
const props = withDefaults(
  defineProps<{ name: IconName; size?: number; color?: string }>(),
  { size: 36, color: "currentColor" },
);
const style = computed(() => {
  const url = `url("data:image/svg+xml,${icons[props.name]}")`;
  return `width:${props.size}rpx;height:${props.size}rpx;background-color:${props.color};-webkit-mask-image:${url};mask-image:${url}`;
});
</script>
<style scoped>
.icon {
  display: inline-block;
  flex-shrink: 0;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
</style>
