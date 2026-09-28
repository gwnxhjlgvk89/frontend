<template>
  <view class="page password">
    <view class="h1">设置新密码</view>
    <view class="caption intro">{{
      forced
        ? "首次登录需要把初始密码（姓名）换成只有你知道的密码，保护你的报名结果。"
        : "修改后，其他设备上的登录会失效。"
    }}</view>

    <view class="field">
      <text class="field-label">{{ forced ? "初始密码" : "原密码" }}</text>
      <view :class="['input-box', { focus: focused === 'old' }]">
        <UiIcon name="lock" :size="36" />
        <input
          v-model="oldPassword"
          :password="!visible"
          :placeholder="forced ? '输入你的姓名' : '输入原密码'"
          placeholder-class="placeholder"
          maxlength="72"
          @focus="focused = 'old'"
          @blur="focused = ''"
        />
      </view>
    </view>
    <view class="field">
      <text class="field-label">新密码</text>
      <view :class="['input-box', { focus: focused === 'new' }]">
        <UiIcon name="key-round" :size="36" />
        <input
          v-model="newPassword"
          :password="!visible"
          placeholder="至少 10 位"
          placeholder-class="placeholder"
          maxlength="72"
          @focus="focused = 'new'"
          @blur="focused = ''"
        />
        <view
          class="icon-btn"
          :aria-label="visible ? '隐藏密码' : '显示密码'"
          @tap="visible = !visible"
          ><UiIcon :name="visible ? 'eye-off' : 'eye'" :size="36"
        /></view>
      </view>
    </view>
    <view class="field">
      <text class="field-label">确认新密码</text>
      <view :class="['input-box', { focus: focused === 'confirm' }]">
        <UiIcon name="key-round" :size="36" />
        <input
          v-model="confirm"
          :password="!visible"
          placeholder="再输入一次"
          placeholder-class="placeholder"
          maxlength="72"
          @focus="focused = 'confirm'"
          @blur="focused = ''"
          @confirm="save"
        />
      </view>
    </view>

    <view class="checks">
      <view
        v-for="c in checks"
        :key="c.label"
        :class="['check row', { ok: c.ok }]"
        ><view class="ico"
          ><UiIcon :name="c.ok ? 'circle-check' : 'circle'" :size="32" /></view
        ><text>{{ c.label }}</text></view
      >
    </view>

    <view v-if="error" class="gap"
      ><StatusBanner tone="danger">{{ error }}</StatusBanner></view
    >
    <button
      class="btn-primary btn-lg btn-block submit"
      :disabled="busy || !valid"
      :loading="busy"
      @tap="save"
    >
      {{ forced ? "保存并开始使用" : "保存新密码" }}
    </button>
  </view>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useSession } from "@/v2/session";
import { request, setToken } from "@/v2/api";
import type { User } from "@/v2/types";
import StatusBanner from "@/v2/StatusBanner.vue";
import UiIcon from "@/v2/UiIcon.vue";
const s = useSession(),
  oldPassword = ref(""),
  newPassword = ref(""),
  confirm = ref(""),
  visible = ref(false),
  focused = ref(""),
  error = ref(""),
  busy = ref(false);
const forced = computed(() => !!s.user?.must_change_password);
// The backend trims whitespace and limits passwords to 72 UTF-8 bytes.
const bytes = (v: string) => unescape(encodeURIComponent(v)).length;
const checks = computed(() => {
  const next = newPassword.value.trim();
  return [
    { label: "至少 10 位", ok: next.length >= 10 && bytes(next) <= 72 },
    {
      label: "与原密码不同",
      ok: !!next && next !== oldPassword.value.trim(),
    },
    { label: "两次输入一致", ok: !!next && newPassword.value === confirm.value },
  ];
});
const valid = computed(
  () => !!oldPassword.value && checks.value.every((c) => c.ok),
);
async function save() {
  error.value = "";
  if (!valid.value || busy.value) return;
  busy.value = true;
  try {
    const data = await request<{ token: string; user: User }>(
      "/auth/password",
      "POST",
      { old_password: oldPassword.value, new_password: newPassword.value },
    );
    s.suspend();
    setToken(data.token);
    s.user = data.user;
    uni.showToast({ title: "密码已更新" });
    uni.reLaunch({ url: s.isAdmin ? "/pages/v2/admin" : "/pages/v2/home" });
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
</script>
<style scoped>
.password {
  min-height: 100vh;
  background: var(--c-surface);
  padding: 48rpx 48rpx calc(48rpx + env(safe-area-inset-bottom));
}
.intro {
  margin: 12rpx 0 48rpx;
  font-size: 26rpx;
}
.checks {
  margin: 28rpx 4rpx 8rpx;
}
.ico {
  display: flex;
  align-items: center;
  height: 40rpx;
}
.check {
  gap: 12rpx;
  line-height: 40rpx;
  font-size: 26rpx;
  color: var(--c-ink-3);
  transition: color var(--t-fast) ease-out;
}
.check + .check {
  margin-top: 10rpx;
}
.check.ok {
  color: var(--c-success);
}
.gap {
  margin-top: 24rpx;
}
.submit {
  margin-top: 40rpx;
}
</style>
