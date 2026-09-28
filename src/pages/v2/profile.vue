<template>
  <view class="page profile">
    <view class="identity row">
      <view class="avatar" aria-hidden="true">{{ initial(s.user?.name, "学") }}</view>
      <view class="grow">
        <view class="h2 ellipsis">{{ s.user?.name || "同学" }}</view>
        <view class="caption ellipsis"
          >{{ s.user?.username
          }}<template v-if="s.user?.class_name"> · {{ s.user?.class_name }}</template
          ><template v-if="s.user?.major"> · {{ s.user?.major }}</template></view
        >
      </view>
    </view>

    <view v-if="s.enrollment" class="card pass">
      <view class="row between">
        <text class="tag success"
          ><UiIcon name="circle-check" :size="24" />{{
            s.enrollment.source === "reserved" ? "预报名已确认" : "报名已确认"
          }}</text
        >
        <text class="caption num">{{ formatTime(s.enrollment.created_at) }}</text>
      </view>
      <view
        class="pass-club row"
        hover-class="pressed"
        @tap="openClub(s.enrollment.club_id)"
      >
        <view class="grow">
          <view class="h1 ellipsis">{{ s.enrollment.club_name }}</view>
          <view class="caption">查看社团详情</view>
        </view>
        <UiIcon name="chevron-right" :size="36" color="var(--c-ink-4)" />
      </view>
      <view v-if="s.canCancel || uncertain" class="pass-foot">
        <view v-if="uncertain" class="gap"
          ><StatusBanner tone="pending" title="正在确认退选结果"
            >网络响应中断，请查询最新结果，不要重复操作。
            <template #action
              ><button class="btn-sm btn-soft" @tap="confirmResult">
                查询退选结果
              </button></template
            ></StatusBanner
          ></view
        >
        <view v-else class="row between">
          <text class="caption"
            >可在 {{ formatTime(s.activity?.cancel_until) }} 前退选</text
          >
          <button class="btn-sm btn-danger" :disabled="busy" @tap="cancel">
            退选
          </button>
        </view>
      </view>
    </view>
    <view v-else class="card">
      <EmptyState
        icon="ticket"
        title="还没有报名社团"
        :text="
          s.canSelect
            ? '报名正在进行，名额先到先得。'
            : '先去看看有哪些社团，收藏感兴趣的。'
        "
        ><button class="btn-primary btn-sm" @tap="home">
          去发现社团
        </button></EmptyState
      >
    </view>

    <view class="section-head"><text class="h3">联系方式</text></view>
    <view class="card">
      <view class="field">
        <text class="field-label">手机号</text>
        <view :class="['input-box', { focus: focused === 'phone' }]">
          <input
            v-model="phone"
            type="number"
            maxlength="32"
            placeholder="便于社团联系你"
            placeholder-class="placeholder"
            @focus="focused = 'phone'"
            @blur="focused = ''"
          />
        </view>
      </view>
      <view class="field">
        <text class="field-label">邮箱（选填）</text>
        <view :class="['input-box', { focus: focused === 'email' }]">
          <input
            v-model="email"
            maxlength="254"
            placeholder="name@example.com"
            placeholder-class="placeholder"
            @focus="focused = 'email'"
            @blur="focused = ''"
          />
        </view>
      </view>
      <button
        class="btn-soft btn-block save"
        :disabled="busy || !dirty"
        @tap="save"
      >
        {{ dirty ? "保存联系方式" : "联系方式已保存" }}
      </button>
    </view>

    <view class="section-head"><text class="h3">账号</text></view>
    <view class="list">
      <view class="list-row" hover-class="pressed" @tap="password">
        <UiIcon name="key-round" :size="40" color="var(--c-ink-2)" />
        <text class="grow">修改密码</text>
        <UiIcon name="chevron-right" :size="36" color="var(--c-ink-4)" />
      </view>
      <view class="list-row danger-row" hover-class="pressed" @tap="logout">
        <UiIcon name="log-out" :size="40" />
        <text class="grow">退出登录</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import { ApiError, notifyError, request, requestKey } from "@/v2/api";
import type { Enrollment } from "@/v2/types";
import EmptyState from "@/v2/EmptyState.vue";
import StatusBanner from "@/v2/StatusBanner.vue";
import UiIcon from "@/v2/UiIcon.vue";
import { formatTime, initial } from "@/v2/format";
const s = useSession(),
  phone = ref(""),
  email = ref(""),
  focused = ref(""),
  busy = ref(false),
  uncertain = ref(false);
const dirty = computed(
  () =>
    phone.value !== (s.user?.phone || "") ||
    email.value !== (s.user?.email || ""),
);
onShow(async () => {
  try {
    await s.resume();
    if (!dirty.value || (!phone.value && !email.value)) {
      phone.value = s.user?.phone || "";
      email.value = s.user?.email || "";
    }
  } catch (e) {
    notifyError(e);
  }
});
function home() {
  uni.switchTab({ url: "/pages/v2/home" });
}
function openClub(id: number) {
  uni.navigateTo({ url: "/pages/v2/detail?id=" + id });
}
function password() {
  uni.navigateTo({ url: "/pages/v2/password" });
}
function logout() {
  uni.showModal({
    title: "退出登录？",
    content: "退出后需要重新输入学号和密码。",
    confirmText: "退出",
    confirmColor: "#c8281c",
    success: (r) => {
      if (r.confirm) s.logout();
    },
  });
}
async function save() {
  busy.value = true;
  try {
    await request("/profile", "PUT", {
      phone: phone.value,
      email: email.value,
    });
    if (s.user) s.user = { ...s.user, phone: phone.value, email: email.value };
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
    content: "退选后名额会立即释放给其他同学，再次报名不保证还有名额。",
    confirmText: "确认退选",
    confirmColor: "#c8281c",
    success: async (r) => {
      if (!r.confirm) return;
      busy.value = true;
      try {
        await request("/enrollment", "DELETE", undefined, {
          "Idempotency-Key": requestKey(),
        });
        await s.refresh(true);
        uni.showToast({ title: "已退选", icon: "none" });
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
.profile {
  padding-top: 32rpx;
}
.identity {
  gap: 24rpx;
  margin: 0 4rpx 32rpx;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 112rpx;
  height: 112rpx;
  border-radius: 56rpx;
  background: var(--c-primary);
  color: #fff;
  font-size: 44rpx;
  font-weight: 600;
}
.pass-club {
  gap: 16rpx;
  margin: 20rpx -16rpx 0;
  padding: 16rpx;
  border-radius: var(--r-md);
}
.pass-foot {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid var(--c-line);
}
.save {
  margin-top: 32rpx;
}
.danger-row {
  color: var(--c-danger);
}
</style>
