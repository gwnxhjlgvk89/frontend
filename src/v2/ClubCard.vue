<template>
  <view
    class="card club"
    hover-class="pressed"
    :hover-stay-time="80"
    @tap="open"
  >
    <ClubMark :club="club" :size="128" />
    <view class="grow">
      <view class="row top">
        <text class="h3 grow ellipsis">{{ club.name }}</text>
        <view
          class="fav"
          :class="{ on: favorite }"
          :aria-label="favorite ? '取消收藏' : '收藏'"
          @tap.stop="toggleFavorite(club.id)"
          ><view :class="['heart', { on: favorite }]"
            ><UiIcon :name="favorite ? 'heart-fill' : 'heart'" :size="36" /></view
        ></view>
      </view>
      <view class="meta row">
        <text class="tag" :style="`background:${tone.bg};color:${tone.fg}`">{{
          club.category || "社团"
        }}</text>
        <text v-if="!eligible" class="tag warn">限指定专业</text>
        <text class="caption ellipsis grow">{{ where }}</text>
      </view>
      <view class="meter"
        ><QuotaMeter
          :remaining="club.remaining"
          :capacity="club.capacity"
          :stale="stale"
      /></view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed } from "vue";
import ClubMark from "./ClubMark.vue";
import UiIcon from "./UiIcon.vue";
import QuotaMeter from "./QuotaMeter.vue";
import { categoryTone, eligibleFor } from "./format";
import { toggleFavorite } from "./favorites";
import type { Club } from "./types";
const props = defineProps<{
  club: Club;
  major?: string;
  favorite?: boolean;
  stale?: boolean;
}>();
const eligible = computed(() => eligibleFor(props.club, props.major));
const tone = computed(() => categoryTone(props.club.category));
const where = computed(
  () =>
    [props.club.schedule || "活动时间待公布", props.club.location]
      .filter(Boolean)
      .join(" · "),
);
function open() {
  uni.navigateTo({ url: "/pages/v2/detail?id=" + props.club.id });
}
</script>
<style scoped>
.club.pressed {
  transform: scale(0.985);
}
.heart {
  display: flex;
}
.heart.on {
  animation: pop 380ms var(--ease-out);
}
.club {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  transition: background-color var(--t-fast) ease-out, transform var(--t-fast) ease-out;
  box-shadow: 0 4rpx 16rpx rgba(29, 33, 41, 0.04);
}
.top {
  gap: 8rpx;
}
.fav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  margin: -12rpx -16rpx -12rpx 0;
  color: var(--c-ink-4);
}
.fav.on {
  color: var(--c-hot);
}
.meta {
  gap: 12rpx;
  margin-top: 8rpx;
}
.meter {
  margin-top: 16rpx;
}
</style>
