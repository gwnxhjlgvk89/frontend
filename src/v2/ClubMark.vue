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
    class="mark"
    :style="`${box};background:radial-gradient(circle at 28% 22%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 58%), ${tone.bg};color:${tone.fg};font-size:${Math.round(size * 0.42)}rpx`"
    ><view v-if="icon" class="glyph"
      ><UiIcon :name="icon" :size="Math.round(size * 0.46)" /></view
    ><text v-else>{{
      initial(club.name)
    }}</text></view
  >
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import UiIcon from "./UiIcon.vue";
import { categoryIcon, categoryTone, initial } from "./format";
import type { Club } from "./types";
const props = withDefaults(defineProps<{ club: Club; size?: number }>(), {
  size: 128,
});
const broken = ref(false);
const tone = computed(() => categoryTone(props.club.category));
const icon = computed(() => categoryIcon(props.club.category));
const box = computed(
  () =>
    `width:${props.size}rpx;height:${props.size}rpx;border-radius:${Math.round(props.size * 0.28)}rpx`,
);
</script>
<style scoped>
.glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}
.mark {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>
