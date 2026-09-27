<template>
  <view class="screen">
    <view class="row between"
      ><text class="eyebrow">你的校园兴趣地图</text
      ><text class="tag">{{ s.activityLabel }}</text></view
    >
    <view class="title">课余的精彩，<br />从一个社团开始。</view
    ><view class="subtitle"
      >你好，{{ s.user?.name || "同学" }}。找到值得投入的热爱。</view
    >
    <view class="activity card"
      ><view class="row between"
        ><view
          ><text class="muted">{{ s.activity?.name }}</text
          ><view class="activity-time">{{ countdown }}</view></view
        ><text class="tag gray">{{ s.clubs.length }} 个社团</text></view
      ></view
    >
    <view v-if="s.enrollment" class="selected card" @tap="openProfile"
      ><text class="tag">{{
        s.enrollment.source === "reserved" ? "已预报名" : "报名成功"
      }}</text
      ><view class="section-title">{{ s.enrollment.club_name }}</view
      ><text class="link">查看我的报名 →</text></view
    >
    <input
      class="input"
      v-model="keyword"
      placeholder="搜索社团名称、兴趣关键词"
    />
    <view class="tabs"
      ><view
        v-for="item in categories"
        :key="item"
        :class="['chip', category === item && 'active']"
        @tap="category = item"
        >{{ item }}</view
      ></view
    >
    <view class="row between filters"
      ><view class="row"
        ><text
          :class="['link', onlyEligible && 'strong']"
          @tap="onlyEligible = !onlyEligible"
          >{{ onlyEligible ? "✓ " : "" }}仅看可报</text
        ><text class="link" @tap="onlyFav = !onlyFav"
          >{{ onlyFav ? "✓ " : "" }}我的收藏</text
        ></view
      ><text class="muted">{{ filtered.length }} 个结果</text></view
    >
    <view v-if="error" class="error" @tap="load">{{ error }} · 点击重试</view
    ><view v-if="s.loading && !s.clubs.length" class="empty"
      >正在整理社团信息…</view
    >
    <ClubCard
      v-for="c in visible"
      :key="c.id"
      :club="c"
      :major="s.user?.major"
    /><view v-if="!filtered.length && !s.loading" class="empty"
      >暂时没有符合条件的社团，试试其他筛选。</view
    >
    <button
      v-if="visible.length < filtered.length"
      class="secondary small"
      @tap="limit += 12"
    >
      查看更多社团</button
    ><view class="sync-note"
      >{{ s.connected ? "名额实时同步中" : "连接恢复中，名额将自动更新" }} ·
      最终以报名结果为准</view
    >
    <BottomNav active="home" />
  </view>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import ClubCard from "@/v2/ClubCard.vue";
import BottomNav from "@/v2/BottomNav.vue";
const s = useSession(),
  keyword = ref(""),
  category = ref("全部"),
  onlyEligible = ref(false),
  onlyFav = ref(false),
  limit = ref(12),
  error = ref("");
const categories = computed(() => [
  "全部",
  ...new Set(s.clubs.map((c) => c.category).filter(Boolean)),
]);
const filtered = computed(() =>
  s.clubs.filter(
    (c) =>
      (category.value === "全部" || c.category === category.value) &&
      c.name.includes(keyword.value) &&
      (!onlyFav.value || s.favorites.includes(c.id)) &&
      (!onlyEligible.value ||
        (c.remaining > 0 &&
          (!c.allowed_majors.length ||
            c.allowed_majors.includes(s.user?.major || "")))),
  ),
);
const visible = computed(() => filtered.value.slice(0, limit.value));
watch([keyword, category, onlyEligible, onlyFav], () => (limit.value = 12));
const countdown = computed(() => {
  const a = s.activity;
  if (!a?.starts_at) return "开放时间待公布";
  if (s.canSelect) return "正在开放，先到先得";
  const diff = Date.parse(a.starts_at) - s.now;
  if (diff <= 0) return s.activityLabel;
  const sec = Math.ceil(diff / 1000);
  return sec > 86400
    ? Math.ceil(sec / 86400) + " 天后开放"
    : `${Math.floor(sec / 3600)}时 ${Math.floor((sec % 3600) / 60)}分 ${sec % 60}秒后开放`;
});
async function load() {
  error.value = "";
  try {
    await s.resume();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "加载失败";
  }
}
onShow(load);
function openProfile() {
  uni.redirectTo({ url: "/pages/v2/profile" });
}
</script>
<style scoped>
.activity {
  margin-top: 30rpx;
  background: #e8f3f2;
  border-color: #d6e9e6;
}
.activity-time {
  font-size: 29rpx;
  font-weight: 650;
  margin-top: 8rpx;
}
.filters {
  margin-bottom: 24rpx;
}
.strong {
  font-weight: 700;
}
.selected .section-title {
  margin: 14rpx 0;
}
.sync-note {
  font-size: 22rpx;
  text-align: center;
  color: #829598;
  margin: 30rpx 0;
}
</style>
