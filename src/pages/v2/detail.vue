<template>
  <view class="screen" v-if="club">
    <image
      v-if="club.cover"
      class="hero"
      :src="club.cover"
      mode="aspectFill"
    /><text class="eyebrow">{{ club.category || "校园社团" }}</text
    ><view class="title">{{ club.name }}</view>
    <view class="row between"
      ><text :class="['tag', !eligible && 'warning']">{{
        eligible ? "你符合报名条件" : "仅限指定专业"
      }}</text
      ><text class="link" @tap="favorite">{{
        isFavorite ? "已收藏 · 取消" : "收藏这个社团"
      }}</text></view
    >
    <view class="card info"
      ><view class="row between"
        ><text class="muted">招募名额</text
        ><text class="quota"
          >剩余 {{ live?.remaining ?? club.remaining }} /
          {{ club.capacity }}</text
        ></view
      ><view class="divider" /><view class="label">活动时间</view
      ><view>{{ club.schedule || "待通知" }}</view
      ><view class="label space">活动地点</view
      ><view>{{ club.location || "待通知" }}</view></view
    >
    <view class="section-title">关于我们</view
    ><view class="card description">{{
      club.description || "社团介绍正在完善，欢迎联系负责老师了解更多。"
    }}</view>
    <view class="section-title">报名须知</view
    ><view class="card"
      ><view>每位同学本届限选一个社团。</view
      ><view class="muted">{{
        club.allowed_majors.length
          ? "允许专业：" + club.allowed_majors.join("、")
          : "不限专业，欢迎加入。"
      }}</view
      ><view class="muted">{{
        s.activity?.allow_cancel
          ? "退选须在规定截止时间前完成。"
          : "本次活动不开放自主退选。"
      }}</view></view
    >
    <view v-if="message" :class="uncertain ? 'error' : 'card'"
      >{{ message
      }}<button v-if="uncertain" class="secondary small" @tap="confirmResult">
        查询报名结果
      </button></view
    >
    <view class="bottom"
      ><button
        class="primary"
        :disabled="
          busy ||
          uncertain ||
          !!s.enrollment ||
          !eligible ||
          !s.canSelect ||
          (live?.remaining ?? club.remaining) <= 0
        "
        :loading="busy"
        @tap="enroll"
      >
        {{ buttonText }}
      </button></view
    > </view
  ><view v-else class="empty">{{ message || "正在加载社团…" }}</view>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import { ApiError, notifyError, request, requestKey } from "@/v2/api";
import type { Club, Enrollment } from "@/v2/types";
const s = useSession(),
  club = ref<Club | null>(null),
  busy = ref(false),
  uncertain = ref(false),
  message = ref("");
let id = 0;
let key = "";
const live = computed(() => s.clubs.find((c) => c.id === id)),
  eligible = computed(
    () =>
      !!club.value &&
      (!club.value.allowed_majors.length ||
        club.value.allowed_majors.includes(s.user?.major || "")),
  ),
  isFavorite = computed(() => s.favorites.includes(id));
const buttonText = computed(() =>
  busy.value
    ? "正在提交，请稍候"
    : uncertain.value
      ? "正在确认报名结果"
      : s.enrollment
        ? s.enrollment.club_id === id
          ? "你已加入这个社团"
          : "你已选择其他社团"
        : !s.canSelect
          ? s.activityLabel
          : !eligible.value
            ? "暂不符合报名资格"
            : (live.value?.remaining ?? club.value?.remaining ?? 0) <= 0
              ? "名额已满"
              : "确认报名",
);
onLoad(async (q) => {
  id = Number(q?.id);
  try {
    club.value = await request<Club>("/clubs/" + id);
  } catch (e) {
    message.value = (e as Error).message;
  }
});
onShow(() => s.resume().catch(notifyError));
async function favorite() {
  try {
    await request("/favorites/" + id, isFavorite.value ? "DELETE" : "PUT");
    s.favorites = isFavorite.value
      ? s.favorites.filter((x) => x !== id)
      : [...s.favorites, id];
  } catch (e) {
    notifyError(e);
  }
}
async function confirmResult() {
  busy.value = true;
  try {
    const mine = await request<Enrollment | null>("/enrollment");
    s.enrollment = mine;
    if (mine) key = "";
    message.value = mine
      ? "报名已确认：" + mine.club_name
      : "暂未查询到报名记录。可以使用原请求重试，系统不会重复占位。";
    uncertain.value = false;
  } catch {
    message.value = "暂时无法确认，请稍后继续查询，不要重复操作。";
  } finally {
    busy.value = false;
  }
}
async function enroll() {
  if (busy.value) return;
  busy.value = true;
  message.value = "";
  key ||= requestKey();
  try {
    const result = await request<{ enrollment: Enrollment }>(
      "/enrollment",
      "POST",
      { club_id: id },
      { "Idempotency-Key": key },
    );
    s.enrollment = result.enrollment;
    key = "";
    message.value = "报名成功，期待在社团见到你！";
    await s.refresh(true);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 0 || e.status >= 500)) {
      uncertain.value = true;
      message.value = "网络响应中断，正在确认报名是否成功…";
      await confirmResult();
    } else {
      key = "";
      message.value = (e as Error).message;
    }
  } finally {
    busy.value = false;
  }
}
</script>
<style scoped>
.hero {
  width: 100%;
  height: 320rpx;
  border-radius: 24rpx;
  margin-bottom: 28rpx;
}
.info {
  margin-top: 30rpx;
}
.quota {
  font-size: 32rpx;
  font-weight: 700;
  color: #087f83;
}
.space {
  margin-top: 24rpx;
}
.description {
  white-space: pre-wrap;
}
</style>
