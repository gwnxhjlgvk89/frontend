<template>
  <view class="page home wash">
    <view
      v-if="s.enrollment"
      class="hero done"
      hover-class="pressed"
      @tap="openProfile"
    >
      <view class="row">
        <view class="done-icon"><UiIcon name="circle-check" :size="44" /></view>
        <view class="grow">
          <view class="caption">{{
            s.enrollment.source === "reserved" ? "预报名已确认" : "你已报名成功"
          }}</view>
          <view class="h2 ellipsis">{{ s.enrollment.club_name }}</view>
        </view>
        <UiIcon name="chevron-right" :size="36" color="var(--c-ink-4)" />
      </view>
    </view>
    <view v-else-if="phase === 'upcoming' || phase === 'open'" class="hero live">
      <view class="deco" aria-hidden="true"
        ><view class="ring r1" /><view class="ring r2" /><view class="disc"
      /></view>
      <view class="row between">
        <text class="h2 hero-head ellipsis">{{ s.activity?.name }}</text>
        <text class="hero-pill"
          ><text v-if="phase === 'open'" class="dot" />{{
            phase === "open" ? "报名进行中" : "即将开放"
          }}</text
        >
      </view>
      <template v-if="phase === 'upcoming'">
        <view class="hero-label">距离开放还有</view>
        <view class="clock num" role="timer">
          <template v-if="left.days"
            ><text class="seg" :key="'d' + left.days">{{ left.days }}</text
            ><text class="sep">天</text></template
          ><text class="seg" :key="'h' + left.hours">{{ left.hours }}</text
          ><text class="sep">:</text
          ><text class="seg" :key="'m' + left.minutes">{{ left.minutes }}</text
          ><text class="sep">:</text
          ><text class="seg" :key="'s' + left.seconds">{{ left.seconds }}</text>
        </view>
        <view class="hero-foot"
          >{{ formatTime(s.activity?.starts_at) }} 开放 · 每人限报 1
          个社团</view
        >
      </template>
      <template v-else>
        <view class="hero-label">剩余名额</view>
        <view class="clock num" role="status" :aria-label="`剩余 ${totalRemaining} 个名额`">
          <text
            v-for="(d, i) in remainingDigits"
            :key="remainingDigits.length - i + '-' + d"
            class="seg digit"
            >{{ d }}</text
          ><text class="sep unit">个</text>
        </view>
        <view class="hero-foot"
          >先到先得，每人限报 1 个社团 ·
          {{ formatTime(s.activity?.ends_at) }} 截止</view
        >
      </template>
    </view>
    <view v-else class="hero quiet">
      <view class="row">
        <view class="quiet-icon"
          ><UiIcon
            :name="phase === 'paused' ? 'triangle-alert' : 'calendar'"
            :size="40"
        /></view>
        <view class="grow">
          <view class="h3">{{ s.activityLabel }}</view>
          <view class="caption">{{ quietText }}</view>
        </view>
      </view>
    </view>

    <view class="toolbar">
      <view :class="['input-box', { focus: searching }]">
        <UiIcon name="search" :size="36" />
        <input
          v-model="keyword"
          placeholder="搜索社团名称或分类"
          placeholder-class="placeholder"
          confirm-type="search"
          @focus="searching = true"
          @blur="searching = false"
        />
        <view
          v-if="keyword"
          class="icon-btn"
          aria-label="清空搜索"
          @tap="keyword = ''"
          ><UiIcon name="circle-x" :size="36"
        /></view>
      </view>
      <scroll-view scroll-x class="cats" :show-scrollbar="false" enhanced>
        <view class="chips">
          <view
            v-for="item in categories"
            :key="item"
            :class="['chip', category === item && 'on']"
            hover-class="tapped"
            @tap="category = item"
            >{{ item }}</view
          >
        </view>
      </scroll-view>
    </view>

    <view id="list-top" />
    <view class="row between list-head">
      <view class="row filters">
        <view
          :class="['chip', 'filter', onlyEligible && 'on']"
          hover-class="tapped"
          @tap="onlyEligible = !onlyEligible"
          ><UiIcon v-if="onlyEligible" name="check" :size="28" />只看可报</view
        >
        <view
          :class="['chip', 'filter', onlyFav && 'on']"
          hover-class="tapped"
          @tap="onlyFav = !onlyFav"
          ><UiIcon :name="onlyFav ? 'heart-fill' : 'heart'" :size="28" />我的收藏</view
        >
      </view>
      <view :class="['sync', { off: !s.connected }]"
        ><text class="dot" />{{ s.connected ? "名额实时更新" : "正在重连" }}</view
      >
    </view>

    <view v-if="error" class="gap"
      ><StatusBanner tone="danger" title="社团信息加载失败">
        {{ error }}
        <template #action
          ><button class="btn-sm btn-danger" @tap="load">
            重新加载
          </button></template
        >
      </StatusBanner></view
    >
    <view v-else-if="!s.connected && s.clubs.length && hasLoaded" class="gap"
      ><StatusBanner tone="warn"
        >名额可能不是最新，连接恢复后会自动更新；最终以报名结果为准。</StatusBanner
      ></view
    >

    <template v-if="s.loading && !s.clubs.length">
      <SkeletonCard v-for="n in 3" :key="n" />
    </template>
    <view v-else>
      <view
        v-for="(c, i) in visible"
        :key="c.id"
        :class="{ enter: intro }"
        :style="intro ? `animation-delay:${(i % 12) * 45}ms` : ''"
        ><ClubCard
          :club="c"
          :major="s.user?.major"
          :favorite="s.favorites.includes(c.id)"
          :stale="!s.connected"
      /></view>
    </view>
    <EmptyState
      v-if="!filtered.length && !s.loading && hasLoaded"
      :icon="onlyFav ? 'heart' : 'search'"
      :title="onlyFav && !s.favorites.length ? '还没有收藏社团' : '没有找到符合条件的社团'"
      :text="
        onlyFav && !s.favorites.length
          ? '在社团卡片上点心形即可收藏，方便开放时快速找到。'
          : '换个关键词或分类试试。'
      "
    >
      <button class="btn-sm btn-soft" @tap="resetFilters">清除筛选</button>
    </EmptyState>
    <view v-if="visible.length && visible.length >= filtered.length" class="end"
      >已显示全部 {{ filtered.length }} 个社团 · 名额以报名结果为准</view
    >
    <view v-else-if="visible.length" class="end">继续上滑加载更多</view>
  </view>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { onReachBottom, onShow } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import ClubCard from "@/v2/ClubCard.vue";
import EmptyState from "@/v2/EmptyState.vue";
import UiIcon from "@/v2/UiIcon.vue";
import SkeletonCard from "@/v2/SkeletonCard.vue";
import StatusBanner from "@/v2/StatusBanner.vue";
import { eligibleFor, formatTime, splitDuration } from "@/v2/format";
const s = useSession(),
  keyword = ref(""),
  searching = ref(false),
  category = ref("全部"),
  onlyEligible = ref(false),
  onlyFav = ref(false),
  limit = ref(12),
  error = ref(""),
  hasLoaded = ref(false),
  intro = ref(true);
const categories = computed(() => [
  "全部",
  ...new Set(s.clubs.map((c) => c.category).filter(Boolean)),
]);
const filtered = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  return s.clubs.filter(
    (c) =>
      (category.value === "全部" || c.category === category.value) &&
      (!k ||
        c.name.toLowerCase().includes(k) ||
        c.category.toLowerCase().includes(k)) &&
      (!onlyFav.value || s.favorites.includes(c.id)) &&
      (!onlyEligible.value ||
        (c.remaining > 0 && eligibleFor(c, s.user?.major))),
  );
});
const visible = computed(() => filtered.value.slice(0, limit.value));
watch([keyword, category, onlyEligible, onlyFav], () => {
  limit.value = 12;
  intro.value = false;
  keepListInView();
});
// After a filter change, bring the list start back under the sticky toolbar,
// but only when the user has already scrolled past it.
function keepListInView() {
  uni
    .createSelectorQuery()
    .select("#list-top")
    .boundingClientRect((rect: any) => {
      const toolbar = uni.upx2px(220);
      if (rect && rect.top < toolbar)
        uni.pageScrollTo({
          selector: "#list-top",
          offsetTop: -toolbar,
          duration: 200,
        });
    })
    .exec();
}
onReachBottom(() => {
  if (limit.value < filtered.value.length) limit.value += 12;
});
const phase = computed(() => {
  const a = s.activity;
  if (!a) return "loading";
  if (a.configured_state === "paused") return "paused";
  if (a.configured_state === "draft") return "draft";
  if (s.canSelect) return "open";
  if (a.starts_at && s.now < Date.parse(a.starts_at)) return "upcoming";
  return "ended";
});
const left = computed(() =>
  splitDuration(Date.parse(s.activity?.starts_at || "") - s.now),
);
const totalRemaining = computed(() =>
  s.clubs.reduce((sum, c) => sum + Math.max(0, c.remaining), 0),
);
// One tile per digit, keyed by place value so only changed digits flip.
const remainingDigits = computed(() => String(totalRemaining.value).split(""));
const quietText = computed(
  () =>
    ({
      loading: "正在获取活动信息…",
      paused: "报名暂时暂停，已提交的结果会保留。恢复后可继续报名。",
      draft: "开放时间公布后，这里会显示倒计时。可以先浏览和收藏社团。",
      ended: "本届报名已结束，感谢参与。",
    })[phase.value as string] || "",
);
async function load() {
  error.value = "";
  try {
    await s.resume();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "请检查网络后重试";
  } finally {
    hasLoaded.value = true;
    // Entrance motion is for the first paint only; later updates stay instant.
    setTimeout(() => (intro.value = false), 900);
  }
}
onShow(load);
function resetFilters() {
  keyword.value = "";
  category.value = "全部";
  onlyEligible.value = false;
  onlyFav.value = false;
}
function openProfile() {
  uni.switchTab({ url: "/pages/v2/profile" });
}
</script>
<style scoped>
.home {
  padding-top: 16rpx;
}
.hero {
  border-radius: var(--r-lg);
  padding: 32rpx;
  margin-bottom: 24rpx;
}
.live {
  position: relative;
  overflow: hidden;
  background: var(--g-brand);
  box-shadow: var(--shadow-brand);
  color: #fff;
}
.live > .row,
.live > view:not(.deco) {
  position: relative;
}
.deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.ring {
  position: absolute;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.18);
}
.r1 {
  width: 360rpx;
  height: 360rpx;
  right: -120rpx;
  top: -150rpx;
}
.r2 {
  width: 220rpx;
  height: 220rpx;
  right: -50rpx;
  top: -80rpx;
  border-color: rgba(255, 255, 255, 0.12);
}
.disc {
  position: absolute;
  width: 280rpx;
  height: 280rpx;
  right: 40rpx;
  bottom: -190rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}
.hero-head {
  min-width: 0;
  flex: 1;
}
.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  height: 48rpx;
  padding: 0 18rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.16);
  font-size: 24rpx;
  font-weight: 500;
}
.hero-pill .dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background: var(--c-live);
}
.hero-label {
  margin-top: 28rpx;
  font-size: 26rpx;
  color: var(--c-on-primary-2);
}
.clock {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 12rpx;
}
.seg {
  min-width: 96rpx;
  height: 104rpx;
  line-height: 104rpx;
  padding: 0 12rpx;
  text-align: center;
  border-radius: var(--r-md);
  background: var(--c-surface);
  color: var(--c-primary);
  font-size: 60rpx;
  font-weight: 700;
}
.seg {
  animation: flip 360ms var(--ease-out);
}
@keyframes flip {
  from {
    opacity: 0.2;
    transform: translateY(-16rpx) scale(0.96);
  }
}
.sep {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--c-on-primary-2);
}
.hero-foot {
  margin-top: 24rpx;
  font-size: 24rpx;
  color: var(--c-on-primary-2);
}
.digit {
  min-width: 72rpx;
  padding: 0 8rpx;
}
.unit {
  margin-left: 6rpx;
  font-size: 28rpx;
}
.done {
  background: linear-gradient(120deg, #ffffff 40%, var(--c-success-soft) 100%);
  box-shadow: 0 8rpx 24rpx rgba(8, 122, 84, 0.08);
}
.done-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: var(--c-success-soft);
  color: var(--c-success);
}
.quiet {
  background: var(--c-surface);
}
.quiet-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: var(--c-fill);
  color: var(--c-ink-2);
}
.toolbar {
  position: sticky;
  top: 0;
  z-index: 5;
  margin: 0 -32rpx;
  padding: 16rpx 32rpx 20rpx;
  background: var(--c-bg);
}
.toolbar .input-box {
  background: var(--c-surface);
}
.cats {
  margin-top: 20rpx;
  width: 100%;
  white-space: nowrap;
}
.list-head {
  margin: 4rpx 0 20rpx;
}
.filters {
  gap: 16rpx;
}
.filter {
  height: 56rpx;
  font-size: 24rpx;
  padding: 0 20rpx;
}
.sync {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: var(--c-ink-3);
}
.sync .dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background: var(--c-success);
}
.sync.off .dot {
  background: var(--c-warn);
}
.gap {
  margin-bottom: 24rpx;
}
.end {
  text-align: center;
  font-size: 24rpx;
  color: var(--c-ink-3);
  margin: 40rpx 0 16rpx;
}
</style>
