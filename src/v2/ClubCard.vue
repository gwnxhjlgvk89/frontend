<template>
  <view class="card club-card" @tap="open">
    <view class="row"
      ><view class="grow"
        ><text class="tag gray">{{ club.category || "校园社团" }}</text
        ><view class="club-name">{{ club.name }}</view></view
      ><image
        v-if="club.cover"
        class="cover"
        :src="club.cover"
        mode="aspectFill"
        lazy-load
    /></view>
    <view class="muted">{{ club.schedule || "活动时间待通知" }}</view
    ><view class="muted">{{ club.location || "活动地点待通知" }}</view>
    <view class="divider" /><view class="row between"
      ><text :class="['tag', !eligible && 'warning']">{{
        eligible ? "符合报名条件" : "限指定专业"
      }}</text
      ><text class="quota">{{
        club.remaining > 0
          ? "剩余 " + club.remaining + " / " + club.capacity + " 名"
          : "名额已满"
      }}</text></view
    >
  </view>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { Club } from "./types";
const props = defineProps<{ club: Club; major?: string }>();
const eligible = computed(
  () =>
    !props.club.allowed_majors.length ||
    props.club.allowed_majors.includes(props.major || ""),
);
function open() {
  uni.navigateTo({ url: "/pages/v2/detail?id=" + props.club.id });
}
</script>
<style scoped>
.club-name {
  font-size: 34rpx;
  font-weight: 650;
  margin: 14rpx 0;
}
.cover {
  width: 116rpx;
  height: 116rpx;
  border-radius: 18rpx;
}
.quota {
  font-size: 25rpx;
  font-weight: 600;
  color: #087f83;
}
.club-card {
  margin-bottom: 22rpx;
}
</style>
