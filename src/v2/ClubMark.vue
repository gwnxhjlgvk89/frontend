<template>
  <image
    v-if="club.cover && !broken"
    class="mark"
    :style="box"
    :src="club.cover"
    mode="aspectFill"
    lazy-load
    @error="broken = true"
  /><view
    v-else
    class="mark letter"
    :style="`${box};background:${tone.bg};color:${tone.fg};font-size:${Math.round(size * 0.42)}rpx`"
    >{{ initial(club.name) }}</view
  >
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { categoryTone, initial } from "./format";
import type { Club } from "./types";
const props = withDefaults(defineProps<{ club: Club; size?: number }>(), {
  size: 128,
});
const broken = ref(false);
const tone = computed(() => categoryTone(props.club.category));
const box = computed(
  () =>
    `width:${props.size}rpx;height:${props.size}rpx;border-radius:${Math.round(props.size * 0.22)}rpx`,
);
</script>
<style scoped>
.mark {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>
