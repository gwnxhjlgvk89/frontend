<template>
  <view
    :class="['card', 'club', { full: club.remaining <= 0 }]"
    hover-class="pressed"
    :hover-stay-time="80"
    @tap="open"
  >
    <view class="mark"><ClubMark :club="club" :size="112" /></view>
    <view class="grow body">
      <view class="row top">
        <text class="name grow ellipsis">{{ club.name }}</text>
        <view
          class="fav"
          hover-class="tapped"
          hover-stop-propagation
          :aria-label="favorite ? '取消收藏' : '收藏'"
          @tap.stop="toggleFavorite(club.id)"
          ><view :class="['heart', { on: favorite }]"
            ><UiIcon :name="favorite ? 'heart-fill' : 'heart'" :size="34" /></view
        ></view>
      </view>
      <view class="meta row"
        ><UiIcon name="clock" :size="24" /><text class="ellipsis grow">{{
          where
        }}</text></view
      >
      <view class="foot row between">
        <view class="row tags"
          ><text class="tag" :style="`background:${tone.bg};color:${tone.fg}`">{{
            club.category || "社团"
          }}</text
          ><text v-if="!eligible" class="tag warn">限专业</text></view
        >
        <QuotaMeter
          size="inline"
          :remaining="club.remaining"
          :capacity="club.capacity"
          :stale="stale"
        />
      </view>
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
.club {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 28rpx 28rpx 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(29, 33, 41, 0.02), 0 8rpx 24rpx rgba(29, 33, 41, 0.04);
  transition: transform var(--t-fast) ease-out, background-color var(--t-fast) ease-out;
}
.club.pressed {
  transform: scale(0.985);
  background: var(--c-surface);
}
.club.full .mark,
.club.full .name {
  opacity: 0.55;
}
.mark {
  display: flex;
  border-radius: 32rpx;
  box-shadow: inset 0 0 0 1rpx rgba(29, 33, 41, 0.04);
}
.top {
  gap: 8rpx;
  min-height: 48rpx;
}
.name {
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.5rpx;
}
.fav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  margin: -10rpx -16rpx -10rpx 0;
  color: var(--c-ink-4);
}
.heart {
  display: flex;
}
.heart.on {
  color: var(--c-hot);
  animation: pop 380ms var(--ease-out);
}
.meta {
  gap: 8rpx;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: var(--c-ink-3);
}
.foot {
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid var(--c-line);
}
.tags {
  gap: 10rpx;
}
</style>
