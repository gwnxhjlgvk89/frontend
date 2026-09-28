<template>
  <view class="page login">
    <view class="brand">
      <view class="logo"><UiIcon name="users" :size="56" /></view>
      <view class="h1">社团填报助手</view>
      <view class="caption">新生社团招新报名 · 每人限报 1 个社团</view>
    </view>

    <view v-if="restoring || (getToken() && restoreError)" class="state">
      <template v-if="restoring">
        <view class="spinner"><UiIcon name="loader-circle" :size="56" /></view>
        <view class="h3">正在恢复登录</view>
        <view class="caption">正在验证上次的登录状态，请稍候。</view>
      </template>
      <template v-else>
        <view class="state-banner"
          ><StatusBanner tone="warn" title="暂时无法连接">{{
            restoreError
          }}</StatusBanner></view
        >
        <button class="btn-primary btn-lg btn-block act" @tap="restore">
          重试连接
        </button>
        <button class="btn-plain btn-block" @tap="switchAccount">
          使用其他账号登录
        </button>
      </template>
    </view>

    <view v-else class="form">
      <view class="field">
        <text class="field-label">学号 / 管理员账号</text>
        <view :class="['input-box', { focus: focused === 'user' }]">
          <UiIcon name="user" :size="36" />
          <input
            v-model="username"
            placeholder="请输入学号"
            placeholder-class="placeholder"
            maxlength="64"
            confirm-type="next"
            @focus="focused = 'user'"
            @blur="focused = ''"
          />
        </view>
      </view>
      <view class="field">
        <text class="field-label">密码</text>
        <view
          :class="['input-box', { focus: focused === 'pwd', invalid: !!error }]"
        >
          <UiIcon name="lock" :size="36" />
          <input
            v-model="password"
            :password="!showPassword"
            placeholder="请输入密码"
            placeholder-class="placeholder"
            maxlength="72"
            confirm-type="done"
            @focus="focused = 'pwd'"
            @blur="focused = ''"
            @confirm="submit"
          />
          <view
            class="icon-btn"
            :aria-label="showPassword ? '隐藏密码' : '显示密码'"
            @tap="showPassword = !showPassword"
            ><UiIcon :name="showPassword ? 'eye-off' : 'eye'" :size="36"
          /></view>
        </view>
        <text v-if="error" class="error-text">{{ error }}</text>
      </view>
      <view class="row between remember">
        <text class="body-sm muted">记住学号</text>
        <switch
          :checked="remember"
          color="#2a5ee8"
          style="transform: scale(0.8); transform-origin: right center"
          @change="changeRemember"
        />
      </view>
      <button
        class="btn-primary btn-lg btn-block"
        :loading="busy"
        :disabled="busy || !username.trim() || !password"
        @tap="submit"
      >
        登录
      </button>
      <view class="hint">
        <StatusBanner tone="info"
          >初始密码为本人姓名，例如“张三”。首次登录后需要设置新密码；账号有疑问请联系老师。</StatusBanner
        >
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import { clearSession, getToken } from "@/v2/api";
import StatusBanner from "@/v2/StatusBanner.vue";
import UiIcon from "@/v2/UiIcon.vue";
const s = useSession(),
  username = ref(uni.getStorageSync("v2_username") || ""),
  password = ref(""),
  showPassword = ref(false),
  focused = ref(""),
  remember = ref(true),
  busy = ref(false),
  error = ref(""),
  restoring = ref(!!getToken()),
  restoreError = ref("");
function go() {
  uni.reLaunch({
    url: s.user?.must_change_password
      ? "/pages/v2/password"
      : s.isAdmin
        ? "/pages/v2/admin"
        : "/pages/v2/home",
  });
}
async function restore() {
  if (!getToken()) {
    restoring.value = false;
    return;
  }
  restoring.value = true;
  restoreError.value = "";
  try {
    await s.resume();
    if (s.user && getToken()) go();
  } catch (e) {
    if (getToken())
      restoreError.value = e instanceof Error ? e.message : "请检查网络后重试";
  } finally {
    restoring.value = false;
  }
}
function changeRemember(e: any) {
  remember.value = e.detail.value;
}
function switchAccount() {
  clearSession();
  restoreError.value = "";
  password.value = "";
}
onShow(() => {
  uni.removeStorageSync("password");
  void restore();
});
async function submit() {
  if (busy.value || !username.value.trim() || !password.value) return;
  busy.value = true;
  error.value = "";
  try {
    await s.login(username.value.trim(), password.value);
    if (remember.value)
      uni.setStorageSync("v2_username", username.value.trim());
    else uni.removeStorageSync("v2_username");
    password.value = "";
    go();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "登录失败，请重试";
  } finally {
    busy.value = false;
  }
}
</script>
<style scoped>
.login {
  min-height: 100vh;
  background: var(--c-surface);
  padding: 64rpx 48rpx calc(48rpx + env(safe-area-inset-bottom));
}
.brand {
  margin-bottom: 64rpx;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  border-radius: 32rpx;
  margin-bottom: 32rpx;
  background: var(--c-primary);
  color: #fff;
}
.brand .caption {
  margin-top: 8rpx;
}
.input-box {
  height: 100rpx;
}
.error-text {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: var(--c-danger);
}
.remember {
  margin: 24rpx 0 32rpx;
}
.hint {
  margin-top: 40rpx;
}
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 32rpx;
}
.state-banner {
  width: 100%;
  text-align: left;
}
.state .act {
  margin: 40rpx 0 16rpx;
}
.spinner {
  color: var(--c-primary);
  margin-bottom: 24rpx;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
