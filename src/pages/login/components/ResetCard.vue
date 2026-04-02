<template>
  <view class="page">
    <view class="login-card">
      <!-- 用 v-if 代替 v-show，key 变化触发重新挂载 + 动画 -->
      <view :class="['login-form', animClass]" :key="step">
        <!-- Step 1 -->
        <template v-if="step === 1">
          <view class="step-header">
            <text class="step-header__title">找回密码</text>
            <text class="step-header__desc">
              请输入学号，我们将向绑定的邮箱发送验证码。
            </text>
          </view>
          <view class="form-item">
            <text class="form-item__label">Student ID</text>
            <input
              class="form-item__input"
              type="text"
              v-model="form.studentId"
              placeholder="请输入你的学号"
              placeholder-class="form-item__placeholder"
            />
          </view>
          <button class="btn btn--primary" @click="handleSendCode">
            发送验证码
          </button>
          <button class="btn btn--ghost" @click="handleBack">← 返回登录</button>
        </template>

        <!-- Step 2 -->
        <template v-else-if="step === 2">
          <view class="step-header">
            <text class="step-header__title">输入验证码</text>
            <text class="step-header__desc">
              验证码已发送至你的绑定邮箱，请注意查收。
            </text>
          </view>
          <view class="form-item">
            <text class="form-item__label">验证码</text>
            <view class="code-row">
              <input
                class="form-item__input code-input"
                type="number"
                v-model="form.code"
                placeholder="请输入 6 位验证码"
                placeholder-class="form-item__placeholder"
                maxlength="6"
              />
              <view
                :class="['code-btn', countdown > 0 && 'code-btn--disabled']"
                @click="handleResend"
              >
                <text class="code-btn__text">
                  {{ countdown > 0 ? `${countdown}s` : "重新发送" }}
                </text>
              </view>
            </view>
          </view>
          <button class="btn btn--primary" @click="handleVerifyCode">
            验证
          </button>
          <button class="btn btn--ghost" @click="goStep(1)">← 上一步</button>
        </template>

        <!-- Step 3 -->
        <template v-else-if="step === 3">
          <view class="step-header">
            <text class="step-header__title">设置新密码</text>
            <text class="step-header__desc">
              请输入你的新密码，长度不少于 8 位。
            </text>
          </view>
          <view class="form-item">
            <text class="form-item__label">新密码</text>
            <input
              class="form-item__input"
              password
              v-model="form.newPassword"
              placeholder="请输入新密码"
              placeholder-class="form-item__placeholder"
            />
          </view>
          <view class="form-item">
            <text class="form-item__label">确认密码</text>
            <input
              class="form-item__input"
              password
              v-model="form.confirmPassword"
              placeholder="请再次输入新密码"
              placeholder-class="form-item__placeholder"
            />
            <text v-if="passwordMismatch" class="form-item__error">
              两次输入的密码不一致
            </text>
          </view>
          <button class="btn btn--primary" @click="handleSubmit">
            确认重置
          </button>
          <button class="btn btn--ghost" @click="goStep(2)">← 上一步</button>
        </template>

        <!-- Step 4 -->
        <template v-else-if="step === 4">
          <view class="success-block">
            <view class="success-icon">✓</view>
            <text class="success-title">密码重置成功！</text>
            <text class="success-desc">你可以使用新密码登录了。</text>
            <button class="btn btn--primary" @click="handleBackToLogin">
              返回登录
            </button>
          </view>
        </template>
      </view>
    </view>

    <!-- 步骤指示器 -->
    <view class="step-indicator" v-if="step < 4">
      <view
        v-for="i in 3"
        :key="i"
        :class="['step-dot', step >= i && 'step-dot--active']"
      />
    </view>
  </view>
</template>

<script setup>
import { reactive, ref, computed, onUnmounted, nextTick } from "vue";
import { loginCardStore } from "@/stores/loginCardStore";
import { showToast } from "@/utils/toast";

const cardStore = loginCardStore();

// ── 步骤 & 动画 ───────────────────────────────────────────
const step = ref(1);
const animClass = ref("anim-slide-in-right");

function goStep(target) {
  const nextClass =
    target > step.value ? "anim-slide-in-right" : "anim-slide-in-left";

  // 1. 先清空 class，让 Vue 感知到变化
  animClass.value = "";
  step.value = target;

  // 2. 下一帧再挂上动画 class，触发重播
  nextTick(() => {
    animClass.value = nextClass;
  });
}

// ── 其余逻辑 ─────────────────────────────────────────────
const countdown = ref(0);
let timer = null;

const form = reactive({
  studentId: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordMismatch = computed(
  () =>
    form.confirmPassword.length > 0 &&
    form.newPassword !== form.confirmPassword,
);

const handleBack = () => cardStore.goLogin();

const handleSendCode = () => {
  if (!form.studentId) {
    showToast({ title: "请输入学号", icon: "none" });
    return;
  }
  // TODO: 调用发送验证码接口
  goStep(2);
  startCountdown();
};

const handleResend = () => {
  if (countdown.value > 0) return;
  // TODO: 重新发送验证码
  startCountdown();
};

const startCountdown = () => {
  countdown.value = 60;
  clearInterval(timer);
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
};

const handleVerifyCode = () => {
  if (form.code.length !== 6) {
    showToast({ title: "请输入 6 位验证码", icon: "none" });
    return;
  }
  // TODO: 调用验证码校验接口
  goStep(3);
};

const handleSubmit = () => {
  if (!form.newPassword || form.newPassword.length < 8) {
    showToast({ title: "密码不少于 8 位", icon: "none" });
    return;
  }
  if (passwordMismatch.value) {
    showToast({ title: "两次密码不一致", icon: "none" });
    return;
  }
  // TODO: 调用重置密码接口
  goStep(4);
};

const handleBackToLogin = () => cardStore.goLogin();

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
/* ── 动画 keyframes ─────────────────────────────────────── */

/* 向前：从右侧滑入 */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 向后：从左侧滑入 */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.anim-slide-in-right {
  animation: slideInRight 0.4s ease both;
}

.anim-slide-in-left {
  animation: slideInLeft 0.4s ease both;
}

/* ── 步骤指示器动画 ─────────────────────────────────────── */
.step-dot {
  transition:
    width 0.4s ease,
    background-color 0.4s ease;
}

/* ── 以下样式与原版相同 ─────────────────────────────────── */
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb;
}

.login-card {
  position: relative; /* 子步骤绝对定位的锚点 */
  overflow: hidden; /* 防止滑入时出现横向滚动条 */
  display: flex;
  flex-direction: column;
  gap: 48rpx;
  width: 75vw;
  max-width: 700rpx;
  margin-top: 60rpx;
  padding: 60rpx 48rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.step-header {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.step-header__title {
  font-size: 34rpx;
  font-weight: 700;
  color: #111827;
}
.step-header__desc {
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.6;
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
.form-item__input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
  color: #111827;
  background-color: #ffffff;
  border: 2rpx solid #d1d5db;
  border-radius: 13rpx;
  box-sizing: border-box;
}
.form-item__error {
  font-size: 22rpx;
  color: #ef4444;
  padding-left: 8rpx;
}

.code-row {
  display: flex;
  flex-direction: row;
  gap: 16rpx;
  align-items: center;
}
.code-input {
  flex: 1;
}
.code-btn {
  min-width: 160rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4f46e5;
  border-radius: 13rpx;
  padding: 0 20rpx;
}
.code-btn--disabled {
  background-color: #a5b4fc;
}
.code-btn__text {
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

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
.btn--ghost {
  background-color: transparent;
  color: #4f46e5;
  border: 2rpx solid #e5e7eb;
}
.btn--ghost:active {
  background-color: #f5f3ff;
}

.step-indicator {
  display: flex;
  flex-direction: row;
  gap: 16rpx;
  margin-top: 40rpx;
}
.step-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #d1d5db;
  /* 宽度过渡在小程序中 CSS transition 可用 */
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}
.step-dot--active {
  background-color: #4f46e5;
  width: 40rpx;
  border-radius: 8rpx;
}

.success-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40rpx;
  gap: 30rpx;
}
.success-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 60rpx;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: successPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.success-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
}
.success-desc {
  font-size: 26rpx;
  color: #6b7280;
}

/* ── 成功图标弹出动画 ─────────────────────────────────── */
@keyframes successPop {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
