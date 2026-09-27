<template>
  <view class="screen"
    ><text class="eyebrow">MY CAMPUS LIFE</text
    ><view class="title">我的报名</view
    ><view class="card row"
      ><view class="identity-mark" aria-hidden="true">{{ nameInitial }}</view
      ><view class="grow"
        ><view class="section-title name">{{ s.user?.name }}</view
        ><view class="muted"
          >{{ s.user?.username }} · {{ s.user?.class_name }}</view
        ><view class="muted">{{ s.user?.major }}</view></view
      ></view
    >
    <view class="card enrolled"
      ><text class="tag">{{
        s.enrollment
          ? s.enrollment.source === "reserved"
            ? "预报名已确认"
            : "报名已确认"
          : "尚未选择"
      }}</text
      ><view class="section-title">{{
        s.enrollment?.club_name || "你的下一段精彩，等你开启。"
      }}</view
      ><view class="muted">{{
        s.enrollment
          ? "报名记录已保存，可在此随时查看。"
          : "先去发现社团，了解活动内容和报名条件。"
      }}</view
      ><button v-if="!s.enrollment" class="primary discover" @tap="home">
        发现社团</button
      ><button
        v-if="s.canCancel"
        class="danger small discover"
        :disabled="busy"
        @tap="cancel"
      >
        退出当前社团</button
      ><button
        v-if="uncertain"
        class="secondary small discover"
        @tap="confirmResult"
      >
        查询退选结果
      </button></view
    >
    <view class="section-title">联系方式</view
    ><view class="card"
      ><view class="field"
        ><text class="label">手机号</text
        ><input
          class="input"
          v-model="phone"
          type="text"
          placeholder="用于社团联系" /></view
      ><view class="field"
        ><text class="label">邮箱</text
        ><input class="input" v-model="email" placeholder="可选" /></view
      ><button class="secondary" :disabled="busy" @tap="save">
        保存联系方式
      </button></view
    >
    <view class="card row between" @tap="password"
      ><text>修改密码</text><text class="link">前往设置 →</text></view
    ><button class="secondary" @tap="s.logout">退出登录</button
    ><BottomNav active="profile" />
  </view>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import { ApiError, notifyError, request, requestKey } from "@/v2/api";
import type { Enrollment } from "@/v2/types";
import BottomNav from "@/v2/BottomNav.vue";
const s = useSession(),
  phone = ref(""),
  email = ref(""),
  busy = ref(false),
  uncertain = ref(false);
const nameInitial = computed(() => Array.from(s.user?.name?.trim() || "学")[0]);
onShow(async () => {
  try {
    await s.resume();
    phone.value = s.user?.phone || "";
    email.value = s.user?.email || "";
  } catch (e) {
    notifyError(e);
  }
});
function home() {
  uni.redirectTo({ url: "/pages/v2/home" });
}
function password() {
  uni.navigateTo({ url: "/pages/v2/password" });
}
async function save() {
  busy.value = true;
  try {
    await request("/profile", "PUT", {
      phone: phone.value,
      email: email.value,
    });
    uni.showToast({ title: "已保存" });
  } catch (e) {
    notifyError(e);
  } finally {
    busy.value = false;
  }
}
async function confirmResult() {
  try {
    s.enrollment = await request<Enrollment | null>("/enrollment");
    uncertain.value = false;
    uni.showToast({
      title: s.enrollment ? "仍保留当前报名" : "退选已完成",
      icon: "none",
    });
  } catch (e) {
    notifyError(e);
  }
}
function cancel() {
  uni.showModal({
    title: "确认退选？",
    content: "退选后名额将立即释放，再次报名不保证仍有名额。",
    success: async (r) => {
      if (!r.confirm) return;
      busy.value = true;
      try {
        await request("/enrollment", "DELETE", undefined, {
          "Idempotency-Key": requestKey(),
        });
        await s.refresh(true);
      } catch (e) {
        if (e instanceof ApiError && (e.status === 0 || e.status >= 500)) {
          uncertain.value = true;
          await confirmResult();
        } else notifyError(e);
      } finally {
        busy.value = false;
      }
    },
  });
}
</script>
<style scoped>
.identity-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #167d75;
  background: #e9f4f1;
  font-size: 38rpx;
  font-weight: 600;
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
}
.name {
  margin: 0;
  font-size: 34rpx;
}
.enrolled {
  background: #e9f4f1;
}
.discover {
  margin-top: 26rpx;
}
</style>
