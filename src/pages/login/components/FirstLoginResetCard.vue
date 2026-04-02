<template>
  <view class="page">
    <!-- 提示横幅 -->
    <view class="banner">
      <text class="banner__icon">🔒</text>
      <text class="banner__text">初次登录需要修改密码，请设置你的新密码。</text>
    </view>

    <!-- 卡片 -->
    <view class="login-card">
      <view class="login-form">
        <!-- 旧密码 -->
        <view class="form-item">
          <text class="form-item__label">Current Password</text>
          <view class="input-wrapper">
            <input
              class="form-item__input"
              :password="showOld"
              v-model="form.oldPassword"
              placeholder="请输入当前密码（默认为姓名）"
              placeholder-class="form-item__placeholder"
            />
            <text class="input-eye" @click="showOld = !showOld">
              {{ showOld ? "🙈" : "👁️" }}
            </text>
          </view>
        </view>

        <!-- 新密码 -->
        <view class="form-item">
          <text class="form-item__label">New Password</text>
          <view class="input-wrapper">
            <input
              class="form-item__input"
              :password="showNew"
              v-model="form.newPassword"
              placeholder="请输入新密码"
              placeholder-class="form-item__placeholder"
            />
            <text class="input-eye" @click="showNew = !showNew">
              {{ showNew ? "🙈" : "👁️" }}
            </text>
          </view>
          <!-- 强度指示器 -->
          <view class="strength">
            <view
              v-for="i in 4"
              :key="i"
              :class="[
                'strength__bar',
                i <= strengthLevel && `strength__bar--${strengthColor}`,
              ]"
            />
            <text class="strength__label" :style="{ color: strengthTextColor }">
              {{ strengthText }}
            </text>
          </view>
        </view>

        <!-- 确认新密码 -->
        <view class="form-item">
          <text class="form-item__label">Confirm New Password</text>
          <view class="input-wrapper">
            <input
              class="form-item__input"
              :password="showConfirm"
              v-model="form.confirmPassword"
              placeholder="请再次输入新密码"
              placeholder-class="form-item__placeholder"
            />
            <text class="input-eye" @click="showConfirm = !showConfirm">
              {{ showConfirm ? "🙈" : "👁️" }}
            </text>
          </view>
          <!-- 不一致提示 -->
          <text
            v-if="form.confirmPassword && !passwordMatch"
            class="form-item__error"
          >
            两次密码输入不一致
          </text>
        </view>

        <!-- 密码规则说明 -->
        <view class="rules">
          <view v-for="rule in rules" :key="rule.label" class="rules__item">
            <text :class="['rules__dot', rule.pass && 'rules__dot--pass']">
              {{ rule.pass ? "✓" : "·" }}
            </text>
            <text :class="['rules__text', rule.pass && 'rules__text--pass']">
              {{ rule.label }}
            </text>
          </view>
        </view>

        <!-- 提交按钮 -->
        <button
          :class="['btn', 'btn--primary', !canSubmit && 'btn--disabled']"
          @click="handleSubmit"
          :disabled="!canSubmit"
        >
          确认修改并登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { loginCardStore } from "@/stores/loginCardStore";
import { authApi } from "@/api/auth";

const cardStore = loginCardStore();

const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 密码显示切换
const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

// ── 密码规则 ──────────────────────────────────
const rules = computed(() => [
  {
    label: "至少 8 个字符",
    pass: form.newPassword.length >= 8,
  },
  {
    label: "包含大写字母",
    pass: /[A-Z]/.test(form.newPassword),
  },
  {
    label: "包含数字",
    pass: /[0-9]/.test(form.newPassword),
  },
  {
    label: "包含特殊字符（如 !@#$）",
    pass: /[^A-Za-z0-9]/.test(form.newPassword),
  },
]);

// ── 密码强度 ──────────────────────────────────
const strengthLevel = computed(() => rules.value.filter((r) => r.pass).length);

const strengthColor = computed(() => {
  if (strengthLevel.value <= 1) return "weak";
  if (strengthLevel.value <= 2) return "medium";
  if (strengthLevel.value <= 3) return "good";
  return "strong";
});

const strengthTextColor = computed(
  () =>
    ({
      weak: "#ef4444",
      medium: "#f59e0b",
      good: "#3b82f6",
      strong: "#10b981",
    })[strengthColor.value],
);

const strengthText = computed(() => {
  if (!form.newPassword) return "";
  return { weak: "弱", medium: "一般", good: "良好", strong: "强" }[
    strengthColor.value
  ];
});

// ── 表单校验 ──────────────────────────────────
const passwordMatch = computed(() => form.newPassword === form.confirmPassword);

const canSubmit = computed(
  () =>
    form.oldPassword &&
    form.newPassword &&
    form.confirmPassword &&
    passwordMatch.value &&
    strengthLevel.value >= 2, // 至少"一般"强度才能提交
);

// ── 提交 ──────────────────────────────────────
const handleSubmit = async () => {
  if (!canSubmit.value) return;

  // TODO: 调用修改密码接口
  console.log("提交修改密码", form);
  try {
    await authApi.resetPassword({
      old_password: form.oldPassword,
      new_password: form.newPassword,
    });
  } catch (err) {
    throw err;
  }
  // 修改成功后跳转 home，关闭当前页面栈
  setTimeout(() => {
    uni.reLaunch({ url: "/pages/home/home" });
  }, 1500);
};
</script>

<style scoped>
/* ── 页面（复用登录页基础结构） ── */
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb;
}

/* ── 提示横幅 ── */
.banner {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16rpx;
  width: 100%;
  max-width: 700rpx;
  margin-top: 30rpx;
  padding: 24rpx 28rpx;
  background-color: #eef2ff;
  border-left: 6rpx solid #4f46e5;
  border-radius: 10rpx;
  box-sizing: border-box;
}

.banner__icon {
  font-size: 28rpx;
  line-height: 1.6;
}

.banner__text {
  flex: 1;
  font-size: 24rpx;
  color: #4338ca;
  line-height: 1.6;
}

/* ── 卡片（与登录页完全一致） ── */
.login-card {
  display: flex;
  flex-direction: column;
  gap: 48rpx;
  width: 100%;
  max-width: 700rpx;
  margin-top: 32rpx;
  padding: 60rpx 48rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

/* ── 表单 ── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.form-item__label {
  font-size: 26rpx;
  font-weight: 500;
  color: #111827;
}

/* ── Input + 眼睛图标 ── */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-item__input {
  width: 100%;
  height: 80rpx;
  padding: 0 70rpx 0 20rpx; /* 右侧留出眼睛位置 */
  font-size: 24rpx;
  color: #111827;
  background-color: #ffffff;
  border: 2rpx solid #d1d5db;
  border-radius: 13rpx;
  box-sizing: border-box;
}

.input-eye {
  position: absolute;
  right: 20rpx;
  font-size: 32rpx;
  line-height: 1;
  color: #9ca3af;
}

.form-item__error {
  font-size: 22rpx;
  color: #ef4444;
  padding-left: 8rpx;
}

/* ── 密码强度 ── */
.strength {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10rpx;
  padding-left: 4rpx;
}

.strength__bar {
  flex: 1;
  height: 6rpx;
  border-radius: 99rpx;
  background-color: #e5e7eb;
  transition: background-color 0.3s;
}

.strength__bar--weak {
  background-color: #ef4444;
}
.strength__bar--medium {
  background-color: #f59e0b;
}
.strength__bar--good {
  background-color: #3b82f6;
}
.strength__bar--strong {
  background-color: #10b981;
}

.strength__label {
  font-size: 22rpx;
  font-weight: 600;
  min-width: 48rpx;
  text-align: right;
}

/* ── 规则列表 ── */
.rules {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 20rpx 24rpx;
  background-color: #f9fafb;
  border-radius: 10rpx;
}

.rules__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14rpx;
}

.rules__dot {
  font-size: 28rpx;
  color: #d1d5db;
  width: 28rpx;
  text-align: center;
  transition: color 0.2s;
}

.rules__dot--pass {
  color: #10b981;
}

.rules__text {
  font-size: 24rpx;
  color: #9ca3af;
  transition: color 0.2s;
}

.rules__text--pass {
  color: #10b981;
}

/* ── 按钮 ── */
.btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 22rpx;
  border-radius: 15rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.btn--primary {
  background-color: #4f46e5;
  color: #ffffff;
}

.btn--primary:active {
  background-color: #4338ca;
}

.btn--disabled {
  background-color: #c7d2fe;
  color: #ffffff;
}

/* ── 底部 ── */
.page__footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 48rpx;
}

.page__footer-text {
  font-size: 24rpx;
  color: #6b7280;
}

.page__footer-link {
  font-size: 24rpx;
  font-weight: 600;
  color: #4f46e5;
}
</style>
