<template>
  <view class="home-header">
    <!-- ── 顶部：问候 + 头像 ── -->
    <view class="header__top">
      <view class="header__greet-wrap">
        <text class="header__greeting">你好，{{ profile.name }}同学 👋</text>
        <text class="header__subtitle">找到适合你的社团</text>
      </view>
      <view class="header__avatar-wrap">
        <image
          class="header__avatar"
          :src="profile.avatar || cdn.defaultavatar"
          mode="aspectFill"
        />
        <view class="header__avatar-ring" />
      </view>
    </view>

    <!-- ── 统计卡片行 ── -->
    <view class="stats-cards">
      <view class="stats-card">
        <text class="stats-card__num">{{ totalCount }}</text>
        <text class="stats-card__label">全部社团</text>
      </view>
      <view class="stats-card__divider" />
      <view class="stats-card">
        <text class="stats-card__num stats-card__num--purple">{{
          filteredCount
        }}</text>
        <text class="stats-card__label">筛选结果</text>
      </view>
      <view class="stats-card__divider" />
      <view class="stats-card">
        <text class="stats-card__num stats-card__num--yellow">{{
          favCount
        }}</text>
        <text class="stats-card__label">已收藏</text>
      </view>
      <view class="stats-card__divider" />
      <view class="stats-card">
        <text class="stats-card__num">{{ currentPage }}/{{ totalPages }}</text>
        <text class="stats-card__label">当前页</text>
      </view>
    </view>

    <!-- ── 搜索框 ── -->
    <view class="search-bar" :class="{ 'search-bar--focused': isFocused }">
      <text class="search-bar__icon">🔍</text>
      <input
        class="search-bar__input"
        v-model="keyword"
        placeholder="搜索社团名称..."
        placeholder-class="search-bar__placeholder"
        @input="onSearch"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <view v-if="keyword" class="search-bar__clear" @click="clearKeyword">
        <text class="search-bar__clear-icon">✕</text>
      </view>
    </view>

    <!-- ── 过滤 + 排序栏 ── -->
    <view class="filter-bar">
      <scroll-view class="filter-bar__scroll" scroll-x show-scrollbar="false">
        <view class="filter-tags">
          <view
            v-for="tag in majorTags"
            :key="tag.value"
            class="filter-tag"
            :class="{ 'filter-tag--active': activeMajor === tag.value }"
            @click="onMajorFilter(tag.value)"
          >
            <text class="filter-tag__text">{{ tag.label }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 排序按钮 -->
      <view
        class="sort-btn"
        :class="`sort-btn--${sortMode}`"
        @click="toggleSort"
      >
        <text class="sort-btn__icon">{{ sortIcon }}</text>
        <text class="sort-btn__text">{{ sortLabel }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import cdn from "@/utils/cdn";

// ── Props：统计数据由父层传入 ────────────────
const props = defineProps({
  totalCount: { type: Number, default: 0 },
  majorTags: { type: Array, default: () => [] },
  filteredCount: { type: Number, default: 0 },
  favCount: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  profile: { type: Object, default: {} },
});

const emit = defineEmits(["update:keyword", "update:major", "update:sort"]);

// ── 静态标签 ─────────────────────────────────
const majorTags = ref(
  props.majorTags.length
    ? props.majorTags
    : [
        { label: "全部", value: "all" },
        { label: "文艺", value: "art" },
        { label: "体育", value: "sport" },
        { label: "科技", value: "tech" },
        { label: "公益", value: "public" },
        { label: "学术", value: "study" },
      ],
);

// ── 本地状态 ──────────────────────────────────
const keyword = ref("");
const activeMajor = ref("all");
const sortMode = ref("default"); // default | asc | desc
const isFocused = ref(false);

// ── 排序 ──────────────────────────────────────
const sortIcon = computed(() => {
  if (sortMode.value === "asc") return "↑";
  if (sortMode.value === "desc") return "↓";
  return "⇅";
});
const sortLabel = computed(() => {
  if (sortMode.value === "asc") return "名额升序";
  if (sortMode.value === "desc") return "名额降序";
  return "默认排序";
});

function toggleSort() {
  const map = { default: "asc", asc: "desc", desc: "default" };
  sortMode.value = map[sortMode.value];
  emit("update:sort", sortMode.value);
}

// ── 搜索 ──────────────────────────────────────
function onSearch() {
  emit("update:keyword", keyword.value);
}
function clearKeyword() {
  keyword.value = "";
  emit("update:keyword", "");
}

// ── 标签过滤 ──────────────────────────────────
function onMajorFilter(val) {
  activeMajor.value = val;
  emit("update:major", val);
}
</script>

<style scoped>
/* ══ 整体容器 ══════════════════════════════════ */
.home-header {
  background: #0f172a;
  padding-bottom: 20rpx;
}

/* ══ 顶部问候区 ════════════════════════════════ */
.header__top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 56rpx 32rpx 28rpx;
}

.header__greeting {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: 1rpx;
}

.header__subtitle {
  display: block;
  font-size: 24rpx;
  color: #64748b;
  margin-top: 6rpx;
}

/* 头像 + 光圈 */
.header__avatar-wrap {
  position: relative;
  width: 88rpx;
  height: 88rpx;
}

.header__avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  position: relative;
  z-index: 1;
}

.header__avatar-ring {
  position: absolute;
  inset: -4rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  z-index: 0;
  opacity: 0.8;
}

/* ══ 统计卡片 ══════════════════════════════════ */
.stats-cards {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 32rpx 28rpx;
  padding: 24rpx 28rpx;
  background: #1e293b;
  border-radius: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
}

.stats-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  flex: 1;
}

.stats-card__divider {
  width: 1rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.08);
}

.stats-card__num {
  font-size: 36rpx;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1;
}

.stats-card__num--purple {
  color: #a78bfa;
}
.stats-card__num--yellow {
  color: #fbbf24;
}

.stats-card__label {
  font-size: 18rpx;
  color: #64748b;
}

/* ══ 搜索框 ════════════════════════════════════ */
.search-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 32rpx 20rpx;
  padding: 0 24rpx;
  height: 80rpx;
  background: #1e293b;
  border-radius: 40rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.search-bar--focused {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 0 6rpx rgba(99, 102, 241, 0.12);
}

.search-bar__icon {
  font-size: 28rpx;
  margin-right: 16rpx;
  opacity: 0.6;
}

.search-bar__input {
  flex: 1;
  font-size: 28rpx;
  color: #f1f5f9;
  height: 80rpx;
  background: transparent;
}

.search-bar__placeholder {
  color: #475569;
  font-size: 28rpx;
}

.search-bar__clear {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.search-bar__clear:active {
  background: rgba(255, 255, 255, 0.2);
}

.search-bar__clear-icon {
  font-size: 20rpx;
  color: #94a3b8;
}

/* ══ 过滤栏 ════════════════════════════════════ */
.filter-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 32rpx;
  gap: 16rpx;
}

.filter-bar__scroll {
  flex: 1;
  overflow: hidden;
}

.filter-tags {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  padding: 4rpx 0;
}

/* 标签 */
.filter-tag {
  padding: 10rpx 26rpx;
  border-radius: 32rpx;
  background: #1e293b;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.filter-tag:active {
  transform: scale(0.94);
}

.filter-tag--active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.4);
  transform: scale(1.05);
}

.filter-tag__text {
  font-size: 24rpx;
  color: #64748b;
  white-space: nowrap;
  font-weight: 500;
}

.filter-tag--active .filter-tag__text {
  color: #ffffff;
  font-weight: 700;
}

/* 排序按钮 */
.sort-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  background: #1e293b;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  gap: 6rpx;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.sort-btn--asc,
.sort-btn--desc {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.4);
}

.sort-btn:active {
  transform: scale(0.94);
}

.sort-btn__icon {
  font-size: 24rpx;
  color: #94a3b8;
}

.sort-btn__text {
  font-size: 22rpx;
  color: #94a3b8;
  white-space: nowrap;
}

.sort-btn--asc .sort-btn__icon,
.sort-btn--asc .sort-btn__text,
.sort-btn--desc .sort-btn__icon,
.sort-btn--desc .sort-btn__text {
  color: #a78bfa;
}
</style>
