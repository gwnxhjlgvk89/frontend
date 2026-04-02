<template>
  <view class="login-card">
    <!-- 表单区 -->
    <view class="login-form">
      <!-- 用户名 -->
      <view class="form-item">
        <text class="form-item__label">Username</text>
        <input
          :class="[
            'form-item__input',
            errors.username && 'form-item__input--error',
          ]"
          type="text"
          v-model="form.username"
          placeholder="请输入你的用户名"
          placeholder-class="form-item__placeholder"
          @blur="handleBlur('username')"
          @input="handleInput('username')"
        />
        <view
          :class="[
            'form-item__error-wrap',
            errors.username && 'form-item__error-wrap--visible',
          ]"
        >
          <text class="form-item__error-text">⚠ {{ errors.username }}</text>
        </view>
      </view>

      <!-- 密码 -->
      <view class="form-item">
        <text class="form-item__label">Password</text>
        <view
          :class="[
            'form-item__input-wrap',
            errors.password && 'form-item__input-wrap--error',
          ]"
        >
          <input
            class="form-item__input form-item__input--inner"
            :password="!showPassword"
            v-model="form.password"
            placeholder="请输入你的密码"
            placeholder-class="form-item__placeholder"
            @blur="handleBlur('password')"
            @input="handleInput('password')"
          />
          <view class="form-item__eye" @click="showPassword = !showPassword">
            <image
              class="form-item__eye__icon"
              :src="showPassword ? cdn.eye : cdn.eyeoff"
              mode="aspectFit"
            />
          </view>
        </view>
        <view
          :class="[
            'form-item__error-wrap',
            errors.password && 'form-item__error-wrap--visible',
          ]"
        >
          <text class="form-item__error-text">⚠ {{ errors.password }}</text>
        </view>
        <text class="password-description">初始密码默认为姓名，如"张三"。</text>
      </view>

      <!-- 记住我 + 忘记密码 -->
      <view class="login-form__row">
        <label class="checkbox-label" @click="form.remember = !form.remember">
          <view :class="['checkbox', form.remember && 'checkbox--checked']">
            <text v-if="form.remember" class="checkbox__icon">✓</text>
          </view>
          <text class="checkbox-label__text">记住我</text>
        </label>
        <text class="login-form__link" @click="goToResetPassword()"
          >忘记密码?</text
        >
      </view>

      <!-- 登录按钮 -->
      <button
        :class="['btn', 'btn--primary', isSubmitting && 'btn--loading']"
        :disabled="isSubmitting"
        @click="handleLogin"
      >
        <text v-if="isSubmitting">登录中...</text>
        <text v-else>登录</text>
      </button>
    </view>

    <!-- 分割线 -->
    <view class="divider">
      <view class="divider__line" />
      <text class="divider__text">Or continue with</text>
      <view class="divider__line" />
    </view>

    <!-- 第三方登录 -->
    <view class="oauth">
      <view class="oauth__btn" @click="$emit('login-wechat')">
        <image class="oauth__icon" :src="cdn.wechat" mode="aspectFit" />
        <text class="oauth__text">WeChat</text>
      </view>
      <view class="oauth__btn" @click="$emit('login-google')">
        <image class="oauth__icon" :src="cdn.google" mode="aspectFit" />
        <text class="oauth__text">Google</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import cdn from "@/utils/cdn";
import { authApi } from "@/api/auth";
import { loginCardStore } from "@/stores/loginCardStore";

defineEmits(["login-wechat", "login-google"]);

const cardStore = loginCardStore();

// ── 表单状态 ──────────────────────────────────────────────────
const form = reactive({
  username: wx.getStorageSync("username") || "",
  password: wx.getStorageSync("password") || "",
  remember: !!wx.getStorageSync("username"),
});

const errors = reactive({ username: "", password: "" });
const touched = reactive({ username: false, password: false });

const showPassword = ref(true);
const isSubmitting = ref(false);

// ── 校验 ──────────────────────────────────────────────────────
function validateField(name, value) {
  if (name === "username") {
    if (!value.trim()) return "请输入用户名";
    if (value.trim().length < 5) return "用户名不能少于 5 位";
  }
  if (name === "password") {
    if (!value) return "请输入密码";
    if (value.length < 2) return "密码不能少于 2 位";
  }
  return "";
}

function validateAll() {
  let valid = true;
  ["username", "password"].forEach((key) => {
    const msg = validateField(key, form[key]);
    errors[key] = msg;
    if (msg) valid = false;
  });
  return valid;
}

function handleBlur(name) {
  touched[name] = true;
  errors[name] = validateField(name, form[name]);
}

function handleInput(name) {
  if (touched[name]) {
    errors[name] = validateField(name, form[name]);
  }
}

// ── 登录 ──────────────────────────────────────────────────────
async function handleLogin() {
  touched.username = true;
  touched.password = true;
  if (!validateAll()) return;
  try {
    const data = await authApi.login(form);
    if (data.identity === "student") {
      const student = data.student;
      cardStore.onLoginSuccess({ isFirstLogin: !student.is_pwd_changed }); // TODO: 替换为实际登录结果
    } else {
      cardStore.setIdentity(data.identity);
      uni.redirectTo({ url: "/pages/admin/admin" });
    }
    isSubmitting.value = true;
  } catch (err) {
    // notifyLoginFailed(err?.message || "账号或密码错误");
  } finally {
    isSubmitting.value = false;
  }
}
function goToResetPassword() {
  cardStore.goReset();
}
</script>

<style lang="scss" scoped>
page,
view,
text,
image,
input,
textarea,
button,
label,
scroll-view,
swiper,
swiper-item {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ══════════════════════════════════════════════════════════ */
/* 通用组件 */
/* ══════════════════════════════════════════════════════════ */

/* ── .card ────────────────────────────────────────────────── */
.card {
  background-color: #ffffff;
  border-radius: 24rpx;
  box-shadow:
    0 4rpx 24rpx rgba(0, 0, 0, 0.08),
    0 1rpx 4rpx rgba(0, 0, 0, 0.04);
  padding: 60rpx 40rpx;
}

/* ── .btn ─────────────────────────────────────────────────── */
.btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 22rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  &--primary {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #ffffff;
    box-shadow: 0 2rpx 8rpx rgba(99, 102, 241, 0.3);
    &:active {
      opacity: 0.85;
      transform: scale(0.985);
    }
  }

  &--outline {
    background-color: #ffffff;
    color: #111827;
    border: 1.5rpx solid #e5e7eb;
    &:active {
      background-color: #f3f4f6;
    }
  }

  &--loading {
    opacity: 0.65;
  }
}

/* ── .divider ─────────────────────────────────────────────── */
.divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20rpx;

  &__line {
    flex: 1;
    height: 1.5rpx;
    background-color: #e5e7eb;
  }

  &__text {
    font-size: 24rpx;
    font-weight: 500;
    color: #6b7280;
    white-space: nowrap;
  }
}

/* ── .form-item ───────────────────────────────────────────── */
.form-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;

  &__label {
    font-size: 26rpx;
    font-weight: 500;
    color: #111827;
    letter-spacing: 0.3rpx;
  }

  /* 独立输入框 */
  &__input {
    width: 100%;
    height: 84rpx;
    padding: 0 20rpx;
    font-size: 24rpx;
    color: #111827;
    background-color: #ffffff;
    border: 1.5rpx solid #d1d5db;
    border-radius: 12rpx;
    box-shadow: inset 0 1rpx 4rpx rgba(0, 0, 0, 0.04);

    &--error {
      border-color: #f87171;
      background-color: #fef2f2;
      box-shadow: inset 0 1rpx 4rpx rgba(239, 68, 68, 0.06);
    }
  }

  /* 带图标的输入框容器 */
  &__input-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 84rpx;
    padding: 0 20rpx;
    background-color: #ffffff;
    border: 1.5rpx solid #d1d5db;
    border-radius: 12rpx;
    box-shadow: inset 0 1rpx 4rpx rgba(0, 0, 0, 0.04);

    &--error {
      border-color: #f87171;
      background-color: #fef2f2;
    }
  }

  /* 容器内的 input */
  &__input--inner {
    flex: 1;
    height: 84rpx;
    font-size: 24rpx;
    color: #111827;
    background-color: transparent;
    border: none;
    padding: 0;
    box-shadow: none;
  }

  /* 眼睛图标 */
  &__eye {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 16rpx;
    flex-shrink: 0;
    width: 60rpx;
    height: 60rpx;
    opacity: 0.5;
  }

  &__eye__icon {
    width: 36rpx;
    height: 36rpx;
  }

  /* 错误提示动画 */
  &__error-wrap {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition:
      max-height 0.2s ease,
      opacity 0.2s ease;
    &--visible {
      max-height: 48rpx;
      opacity: 1;
    }
  }

  &__error-text {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    font-size: 22rpx;
    color: #ef4444;
    line-height: 1.5;
  }

  &__placeholder {
    color: #9ca3af;
  }
}

/* ── .checkbox ────────────────────────────────────────────── */
.checkbox {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5rpx solid #d1d5db;
  border-radius: 6rpx;
  background-color: transparent;
  transition: all 0.2s ease;

  &--checked {
    background-color: #6366f1;
    border-color: #6366f1;
  }

  &__icon {
    color: #ffffff;
    font-size: 20rpx;
    font-weight: bold;
  }
}

.checkbox-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
  cursor: pointer;

  &__text {
    font-size: 24rpx;
    color: #6b7280;
  }
}

/* ── OAuth 按钮 ────────────────────────────────────────────– */
.oauth {
  display: flex;
  flex-direction: row;
  gap: 16rpx;
}

.oauth__btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 12rpx;
  border-radius: 12rpx;
  border: 1.5rpx solid #e5e7eb;
  background-color: #f9fafb;
  transition: all 0.2s ease;

  &:active {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }
}

.oauth__icon {
  width: 36rpx;
  height: 36rpx;
}

.oauth__text {
  font-size: 20rpx;
  color: #111827;
}

/* ── LoginCard 特定样式 ─────────────────────────────────────── */
// ── 卡片容器 ───────────────────────────────────────────────
.login-card {
  @extend .card;
  display: flex;
  flex-direction: column;
  gap: 48rpx;
  min-width: 80vw;
  max-width: 700rpx;
  margin-top: 40rpx;
}

// ── 表单区 ─────────────────────────────────────────────────
.login-form {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.login-form__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-form__link {
  font-size: 26rpx;
  font-weight: 600;
  color: #4f46e5;
}

// ── 密码提示 ───────────────────────────────────────────────
.password-description {
  padding-left: 8rpx;
  font-size: 20rpx;
  color: #9ca3af;
  line-height: 1.4;
}
</style>
