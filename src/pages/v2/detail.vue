<template>
  <view
    v-if="club"
    class="page with-bar detail"
    :style="`background:linear-gradient(180deg, ${tone.bg} 0%, var(--c-bg) 420rpx)`"
  >
    <image
      v-if="club.cover && !coverBroken"
      class="cover"
      :src="club.cover"
      mode="aspectFill"
      @error="coverBroken = true"
    />

    <view class="head row">
      <view v-if="!club.cover || coverBroken" class="mark-wrap"
        ><ClubMark :club="club" :size="120"
      /></view>
      <view class="grow">
      <view class="h1">{{ club.name }}</view>
      <view class="row tags">
        <text class="tag" :style="`background:${tone.bg};color:${tone.fg}`">{{
          club.category || "社团"
        }}</text>
        <view :class="['tag', eligible ? 'success' : 'warn']"
          ><UiIcon :name="eligible ? 'check' : 'triangle-alert'" :size="24" /><text>{{
            eligible ? "你符合报名条件" : "仅限指定专业"
          }}</text></view
        >
      </view>
      </view>
    </view>

    <view class="card">
      <QuotaMeter
        size="lg"
        :remaining="remaining"
        :capacity="club.capacity"
        :stale="!s.connected"
      />
      <view :class="['sync', { off: !s.connected }]"
        ><text class="dot" />{{
          s.connected
            ? "名额实时更新中"
            : "连接恢复中，名额可能不是最新；最终以报名结果为准"
        }}</view
      >
    </view>

    <view class="card info">
      <view class="info-row">
        <UiIcon name="clock" :size="36" color="var(--c-ink-3)" />
        <view class="grow"
          ><view class="caption">活动时间</view
          ><view>{{ club.schedule || "待社团公布" }}</view></view
        >
      </view>
      <view class="info-row">
        <UiIcon name="map-pin" :size="36" color="var(--c-ink-3)" />
        <view class="grow"
          ><view class="caption">活动地点</view
          ><view>{{ club.location || "待社团公布" }}</view></view
        >
      </view>
      <view class="info-row">
        <UiIcon name="graduation-cap" :size="36" color="var(--c-ink-3)" />
        <view class="grow"
          ><view class="caption">招募对象</view
          ><view>{{
            club.allowed_majors.length
              ? club.allowed_majors.join("、")
              : "不限专业"
          }}</view></view
        >
      </view>
    </view>

    <view class="section-head"><text class="h3">社团介绍</text></view>
    <view v-if="detailLoaded" class="card description">{{
      club.description || "社团介绍正在完善，可以先收藏，稍后再来看看。"
    }}</view>
    <view v-else-if="message" class="card description"
      >介绍暂时加载失败，<text class="retry" @tap="loadClub">点此重试</text></view
    >
    <view v-else class="card" aria-hidden="true"
      ><view class="sk-line" /><view class="sk-line short"
    /></view>

    <view class="section-head"><text class="h3">报名须知</text></view>
    <view class="card rules">
      <view v-for="rule in rules" :key="rule" class="rule row"
        ><view class="ico"
          ><UiIcon name="info" :size="32" color="var(--c-primary)" /></view
        ><text class="grow">{{ rule }}</text></view
      >
    </view>

    <view v-if="uncertain || message" class="gap">
      <StatusBanner
        v-if="uncertain"
        tone="pending"
        title="正在确认报名结果"
        >网络响应中断。系统不会重复占位，请等待确认或手动查询。
        <template #action
          ><button
            class="btn-sm btn-soft"
            :disabled="busy"
            @tap="confirmResult"
          >
            查询报名结果
          </button></template
        >
      </StatusBanner>
      <StatusBanner v-else :tone="messageTone">{{ message }}</StatusBanner>
    </view>

    <view class="bar">
      <view
        class="fav"
        :class="{ on: isFavorite }"
        hover-class="tapped"
        @tap="toggleFavorite(id)"
        ><view :class="['heart', { on: isFavorite }]"
          ><UiIcon :name="isFavorite ? 'heart-fill' : 'heart'" :size="44" /></view
        ><text
          >{{ isFavorite ? "已收藏" : "收藏" }}</text
        ></view
      >
      <button
        class="btn-primary btn-lg grow"
        :disabled="!canEnroll"
        :loading="busy"
        @tap="confirming = true"
      >
        {{ buttonText }}
      </button>
    </view>

    <Sheet :show="confirming" title="确认报名" @close="confirming = false">
      <view class="confirm-club row">
        <ClubMark :club="club" :size="96" />
        <view class="grow">
          <view class="h3 ellipsis">{{ club.name }}</view>
          <view class="caption">{{ club.schedule || "活动时间待公布" }}</view>
        </view>
      </view>
      <view class="confirm-list">
        <view class="row"
          ><view class="ico"
            ><UiIcon name="check" :size="32" color="var(--c-primary)" /></view
          ><text>每位同学本届只能报名 1 个社团</text></view
        >
        <view class="row"
          ><view class="ico"
            ><UiIcon
              :name="s.activity?.allow_cancel ? 'check' : 'triangle-alert'"
              :size="32"
              :color="
                s.activity?.allow_cancel ? 'var(--c-primary)' : 'var(--c-warn)'
              " /></view
          ><text>{{ cancelRule }}</text></view
        >
        <view class="row"
          ><view class="ico"
            ><UiIcon name="check" :size="32" color="var(--c-primary)" /></view
          ><text>名额先到先得，以提交结果为准</text></view
        >
      </view>
      <template #footer>
        <view class="sheet-actions">
          <button class="btn-lg" @tap="confirming = false">再想想</button>
          <button class="btn-primary btn-lg" @tap="submit">
            确认报名
          </button>
        </view>
      </template>
    </Sheet>

    <Sheet :show="succeeded" @close="succeeded = false">
      <view class="success-panel">
        <view class="burst" aria-hidden="true">
          <view
            v-for="(p, i) in confetti"
            :key="i"
            class="piece"
            :style="p"
          />
          <view class="check-ring"><UiIcon name="check" :size="64" /></view>
        </view>
        <view class="h2">报名成功</view>
        <view class="caption">期待在社团见到你</view>
        <view class="voucher">
          <view class="voucher-top row">
            <ClubMark :club="club" :size="88" />
            <view class="grow">
              <view class="h3 ellipsis">{{ s.enrollment?.club_name }}</view>
              <view class="voucher-status"
                ><UiIcon name="circle-check" :size="26" /><text
                  >报名已确认</text
                ></view
              >
            </view>
          </view>
          <view class="perforation"
            ><view class="notch left" /><view class="dash" /><view
              class="notch right"
          /></view>
          <view class="voucher-bottom">
            <view class="row between"
              ><text class="caption">报名人</text
              ><text class="ticket-value"
                >{{ s.user?.name }} · {{ s.user?.username }}</text
              ></view
            >
            <view class="row between"
              ><text class="caption">确认时间</text
              ><text class="ticket-value num">{{
                formatTime(s.enrollment?.created_at)
              }}</text></view
            >
          </view>
        </view>
      </view>
      <template #footer>
        <view class="sheet-actions">
          <button class="btn-lg" @tap="succeeded = false">继续浏览</button>
          <button class="btn-primary btn-lg" @tap="openProfile">
            查看我的报名
          </button>
        </view>
      </template>
    </Sheet>
  </view>
  <view v-else class="page">
    <EmptyState
      v-if="message"
      icon="circle-x"
      title="社团信息加载失败"
      :text="message"
      ><button class="btn-sm btn-soft" @tap="loadClub">重新加载</button></EmptyState
    >
    <view v-else class="loading-cover" />
  </view>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import { ApiError, notifyError, request, requestKey } from "@/v2/api";
import type { Club, Enrollment } from "@/v2/types";
import ClubMark from "@/v2/ClubMark.vue";
import EmptyState from "@/v2/EmptyState.vue";
import QuotaMeter from "@/v2/QuotaMeter.vue";
import Sheet from "@/v2/Sheet.vue";
import StatusBanner from "@/v2/StatusBanner.vue";
import UiIcon from "@/v2/UiIcon.vue";
import { toggleFavorite } from "@/v2/favorites";
import { categoryTone, eligibleFor, formatTime } from "@/v2/format";
const s = useSession(),
  club = ref<Club | null>(null),
  busy = ref(false),
  uncertain = ref(false),
  confirming = ref(false),
  succeeded = ref(false),
  detailLoaded = ref(false),
  coverBroken = ref(false),
  message = ref(""),
  messageTone = ref<"info" | "danger" | "success">("info");
const id = ref(0);
let key = "";
const live = computed(() => s.clubs.find((c) => c.id === id.value)),
  remaining = computed(
    () => live.value?.remaining ?? club.value?.remaining ?? 0,
  ),
  tone = computed(() => categoryTone(club.value?.category || "")),
  eligible = computed(
    () => !!club.value && eligibleFor(club.value, s.user?.major),
  ),
  isFavorite = computed(() => s.favorites.includes(id.value));
const canEnroll = computed(
  () =>
    !busy.value &&
    !uncertain.value &&
    !s.enrollment &&
    eligible.value &&
    s.canSelect &&
    remaining.value > 0,
);
const buttonText = computed(() =>
  busy.value
    ? "正在提交"
    : uncertain.value
      ? "正在确认结果"
      : s.enrollment
        ? s.enrollment.club_id === id.value
          ? "你已加入这个社团"
          : "你已报名其他社团"
        : !s.canSelect
          ? s.activityLabel
          : !eligible.value
            ? "暂不符合报名条件"
            : remaining.value <= 0
              ? "名额已满"
              : "立即报名",
);
// One-shot celebration: pieces fly outward from the check mark.
const confettiColors = ["#2a5ee8", "#6a4bdb", "#c63d17", "#087a54", "#f5b400", "#e84a8a"];
const confetti = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1);
  const dist = 130 + (i % 3) * 36;
  return `--dx:${Math.round(Math.cos(angle) * dist)}rpx;--dy:${Math.round(Math.sin(angle) * dist)}rpx;--rot:${i * 47}deg;background:${confettiColors[i % confettiColors.length]};animation-delay:${(i % 4) * 30}ms;${i % 3 ? "border-radius:50%" : ""}`;
});
const cancelRule = computed(() =>
  s.activity?.allow_cancel
    ? `可在 ${formatTime(s.activity.cancel_until)} 前自行退选`
    : "本次活动提交后不能自行退选",
);
const rules = computed(() => [
  "每位同学本届限报 1 个社团，报名后其他社团将无法选择。",
  s.activity?.allow_cancel
    ? `退选须在 ${formatTime(s.activity.cancel_until)} 前完成，退选后名额立即释放。`
    : "本次活动不开放自主退选，请确认后再提交。",
  "名额实时变化，最终以提交成功的结果为准。",
]);
function tintNav(category: string) {
  uni.setNavigationBarColor({
    frontColor: "#000000",
    backgroundColor: categoryTone(category).bg,
  });
}
async function loadClub() {
  message.value = "";
  // Render at once from the list snapshot; the request only adds the description.
  const cached = s.clubs.find((c) => c.id === id.value);
  if (cached && !club.value) {
    club.value = { ...cached };
    tintNav(cached.category);
  }
  try {
    club.value = await request<Club>("/clubs/" + id.value);
    detailLoaded.value = true;
    tintNav(club.value.category);
  } catch (e) {
    message.value = (e as Error).message;
  }
}
onLoad((q) => {
  id.value = Number(q?.id);
  loadClub();
});
onShow(() => s.resume().catch(notifyError));
async function confirmResult() {
  busy.value = true;
  try {
    const mine = await request<Enrollment | null>("/enrollment");
    s.enrollment = mine;
    uncertain.value = false;
    if (mine) {
      key = "";
      message.value = "";
      if (mine.club_id === id.value) succeeded.value = true;
      else {
        messageTone.value = "info";
        message.value = "已确认你报名了：" + mine.club_name;
      }
    } else {
      messageTone.value = "info";
      message.value = "没有查询到报名记录，可以再次提交，系统不会重复占位。";
    }
  } catch {
    uncertain.value = true;
    notifyError(new Error("暂时无法确认，请稍后再查询，不要重复操作"));
  } finally {
    busy.value = false;
  }
}
async function submit() {
  confirming.value = false;
  if (busy.value) return;
  busy.value = true;
  message.value = "";
  key ||= requestKey();
  try {
    const result = await request<{ enrollment: Enrollment }>(
      "/enrollment",
      "POST",
      { club_id: id.value },
      { "Idempotency-Key": key },
    );
    s.enrollment = result.enrollment;
    key = "";
    succeeded.value = true;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 0 || e.status >= 500)) {
      uncertain.value = true;
      busy.value = false;
      await confirmResult();
    } else {
      key = "";
      messageTone.value = "danger";
      message.value = (e as Error).message;
    }
  } finally {
    busy.value = false;
  }
}
function openProfile() {
  succeeded.value = false;
  uni.switchTab({ url: "/pages/v2/profile" });
}
</script>
<style scoped>
.detail {
  padding-top: 24rpx;
}
.cover {
  display: block;
  width: 100%;
  height: 340rpx;
  border-radius: var(--r-lg);
  margin-bottom: 32rpx;
}
.mark-wrap {
  display: flex;
  border: 6rpx solid #fff;
  border-radius: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(29, 33, 41, 0.08);
}
.head {
  gap: 24rpx;
  margin: 8rpx 4rpx 28rpx;
}
.tags {
  margin-top: 16rpx;
}
.sync {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: var(--c-ink-3);
}
.sync .dot {
  flex-shrink: 0;
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background: var(--c-success);
}
.sync.off .dot {
  background: var(--c-warn);
}
.info {
  padding-top: 8rpx;
  padding-bottom: 8rpx;
}
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 20rpx 0;
}
.info-row + .info-row {
  border-top: 1rpx solid var(--c-line);
}
.info-row .caption {
  line-height: 1.4;
}
.description {
  white-space: pre-wrap;
  line-height: 1.75;
  color: var(--c-ink-2);
}
.ico {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 44rpx;
}
/* CJK glyphs sit below the line-box centre; nudge icons to match. */
.rules .ico,
.confirm-list .ico {
  transform: translateY(4rpx);
}
.rules .rule {
  align-items: flex-start;
  font-size: 26rpx;
  line-height: 44rpx;
  color: var(--c-ink-2);
}
.rule + .rule {
  margin-top: 16rpx;
}
.gap {
  margin-top: 24rpx;
}
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 20rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
  background: var(--c-surface);
  box-shadow: var(--shadow-float);
}
.heart {
  display: flex;
}
.heart.on {
  animation: pop 380ms var(--ease-out);
}
.fav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--r-md);
  font-size: 22rpx;
  color: var(--c-ink-2);
}
.fav.on {
  color: var(--c-hot);
}
.confirm-club {
  gap: 24rpx;
  padding: 24rpx;
  border-radius: var(--r-md);
  background: var(--c-fill);
}
.confirm-list {
  margin: 28rpx 4rpx 8rpx;
  font-size: 28rpx;
}
.confirm-list .row {
  align-items: center;
  gap: 16rpx;
  line-height: 44rpx;
}
.confirm-list .row + .row {
  margin-top: 18rpx;
}
.success-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 32rpx;
}
.burst {
  position: relative;
  display: flex;
  justify-content: center;
}
.piece {
  position: absolute;
  left: 50%;
  top: 60rpx;
  width: 14rpx;
  height: 14rpx;
  margin-left: -7rpx;
  border-radius: 3rpx;
  opacity: 0;
  animation: fly 900ms var(--ease-out) forwards;
}
@keyframes fly {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg) scale(0.6);
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1);
  }
}
.check-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 144rpx;
  height: 144rpx;
  border-radius: 72rpx;
  margin-bottom: 24rpx;
  background: var(--c-success-soft);
  color: var(--c-success);
  animation: pop 420ms var(--ease-out) both;
}
@keyframes pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.voucher {
  width: 100%;
  margin-top: 36rpx;
  border-radius: var(--r-lg);
  background: var(--c-fill);
  text-align: left;
  overflow: hidden;
}
.voucher-top {
  gap: 24rpx;
  padding: 28rpx;
}
.voucher-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 6rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: var(--c-success);
}
.perforation {
  position: relative;
  height: 32rpx;
  display: flex;
  align-items: center;
}
.dash {
  flex: 1;
  margin: 0 28rpx;
  border-top: 2rpx dashed var(--c-fill-strong);
}
.notch {
  position: absolute;
  top: 0;
  width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  background: var(--c-surface);
}
.notch.left {
  left: -16rpx;
}
.notch.right {
  right: -16rpx;
}
.voucher-bottom {
  padding: 8rpx 28rpx 16rpx;
}
.voucher-bottom .row {
  padding: 12rpx 0;
}
.ticket-value {
  font-weight: 500;
  color: var(--c-ink);
}
.sk-line {
  height: 28rpx;
  border-radius: 8rpx;
  background: var(--c-fill);
  animation: breathe 1.4s ease-in-out infinite;
}
.sk-line + .sk-line {
  margin-top: 20rpx;
}
.sk-line.short {
  width: 60%;
}
@keyframes breathe {
  50% {
    opacity: 0.5;
  }
}
.retry {
  color: var(--c-primary);
}
.loading-cover {
  height: 340rpx;
  border-radius: var(--r-lg);
  background: var(--c-fill-strong);
}
</style>
