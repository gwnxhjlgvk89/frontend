<template>
  <view class="screen login">
    <view class="brand"
      ><text class="eyebrow">CAMPUS · CLUBS</text
      ><view class="title">找到你的热爱，<br />从这里开始。</view
      ><view class="subtitle">社团填报助手 · 让校园生活多一种可能</view></view
    >
    <view
      v-if="restoring || (getToken() && restoreError)"
      class="card login-card"
    >
      <view class="section-title">{{
        restoring ? "正在恢复登录" : "暂时无法连接"
      }}</view>
      <view class="muted">{{
        restoring ? "正在验证上次的登录状态，请稍候。" : restoreError
      }}</view>
      <button v-if="!restoring" class="primary" @tap="restore">重试连接</button>
      <button :disabled="restoring" @tap="switchAccount">使用其他账号</button>
    </view>
    <view v-else class="card login-card"
      ><view class="section-title">欢迎回来</view
      ><view class="muted">使用学校提供的账号登录</view><view class="divider" />
      <view class="field"
        ><text class="label">学号 / 管理员账号</text
        ><input
          class="input"
          v-model="username"
          placeholder="请输入账号"
          maxlength="64"
      /></view>
      <view class="field"
        ><text class="label">密码</text
        ><input
          class="input"
          v-model="password"
          password
          placeholder="请输入密码"
          maxlength="72"
          @confirm="submit"
      /></view>
      <view v-if="error" class="error">{{ error }}</view
      ><button
        class="primary"
        :loading="busy"
        :disabled="busy || !username || !password"
        @tap="submit"
      >
        登录并探索社团
      </button>
      <view class="remember" @tap="remember = !remember"
        ><text :class="['tag', !remember && 'gray']">{{
          remember ? "已开启" : "未开启"
        }}</text
        ><text>记住账号</text></view
      > </view
    ><view class="login-foot"
      >初始密码为姓名小写全拼，ü 使用 v。<br />多音字或账号有疑问，请联系老师；首次登录需修改密码。</view
    >
  </view>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import { clearSession, getToken } from "@/v2/api";
const s = useSession(),
  username = ref(uni.getStorageSync("v2_username") || ""),
  password = ref(""),
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
  if (busy.value) return;
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
    error.value = e instanceof Error ? e.message : "登录失败";
  } finally {
    busy.value = false;
  }
}
</script>
<style scoped>
.login {
  padding-top: 70rpx;
}
.brand {
  margin: 0 6rpx 52rpx;
}
.login-card {
  padding: 36rpx;
}
.login-card .section-title {
  margin-top: 0;
}
.remember {
  display: flex;
  gap: 16rpx;
  align-items: center;
  margin-top: 24rpx;
  font-size: 24rpx;
  color: #6f8388;
}
.login-foot {
  font-size: 23rpx;
  line-height: 1.8;
  color: #829396;
  text-align: center;
  margin-top: 30rpx;
}
</style>
