<template>
  <view class="mask" @click.self="$emit('close')">
    <view class="modal" :class="{ 'modal--in': mounted }" @click.stop>
      <view class="modal__header">
        <text class="modal__title">编辑个人资料</text>
        <text class="modal__close" @click="$emit('close')">✕</text>
      </view>

      <scroll-view class="modal__body" scroll-y>
        <view v-for="field in editFields" :key="field.key" class="field">
          <text class="field__label">
            {{ field.icon }} {{ field.label }}
            <text v-if="field.required" class="field__required"> *</text>
          </text>
          <input
            class="field__input"
            v-model="form[field.key]"
            :placeholder="field.placeholder"
            :maxlength="field.maxLen || 50"
            placeholder-class="field__placeholder"
          />
        </view>
      </scroll-view>

      <view class="modal__footer">
        <view class="btn btn--cancel" @click="$emit('close')">
          <text class="btn__text btn__text--cancel">取消</text>
        </view>
        <view class="btn btn--save" @click="onSave">
          <text class="btn__text btn__text--save">保存</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { showToast, hideToast } from "@/utils/toast";

const props = defineProps({ profile: { type: Object, required: true } });
const emit = defineEmits(["close", "save"]);

// 动画触发
const mounted = ref(false);
onMounted(() => setTimeout(() => (mounted.value = true), 16));

// 表单数据（浅拷贝，不污染原始 profile）
const form = reactive({ ...props.profile });

const editFields = [
  {
    key: "email",
    icon: "📧",
    label: "邮箱",
    placeholder: "请输入邮箱(用于重置密码)",
    required: true,
    maxLen: 50,
  },
  {
    key: "phone",
    icon: "📱",
    label: "手机号",
    placeholder: "请输入手机号",
    required: false,
    maxLen: 20,
  },
];

const onSave = () => {
  if (!form.email?.trim()) {
    showToast({ title: "邮箱不能为空", icon: "none" });
    return;
  }
  emit("save", { ...form });
};
</script>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.modal {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  display: flex;
  flex-direction: column;
  max-height: 88vh;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.12);
}
.modal--in {
  transform: translateY(0);
}

.modal__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 36rpx 40rpx 24rpx;
  border-bottom: 1.5rpx solid #f3f4f6;
  flex-shrink: 0;
}
.modal__title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}
.modal__close {
  font-size: 32rpx;
  color: #9ca3af;
  padding: 8rpx;
}

.modal__body {
  flex: 1;
  padding: 24rpx 40rpx;
  max-height: 60vh;
}

.field {
  margin-bottom: 32rpx;
}
.field__label {
  display: block;
  font-size: 26rpx;
  color: #374151;
  font-weight: 600;
  margin-bottom: 12rpx;
}
.field__required {
  color: #ef4444;
}
.field__input {
  width: 100%;
  box-sizing: border-box;
  height: 84rpx;
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #111827;
  transition: border-color 0.2s;
}
.field__input:focus {
  border-color: #6d28d9;
}
.field__placeholder {
  color: #d1d5db;
}

.modal__footer {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
  padding: 24rpx 40rpx 48rpx;
  border-top: 1.5rpx solid #f3f4f6;
  flex-shrink: 0;
}
.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s;
}
.btn:active {
  opacity: 0.8;
}
.btn--cancel {
  flex: 1;
  background: #f3f4f6;
}
.btn--save {
  flex: 2;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.4);
}
.btn__text--cancel {
  font-size: 30rpx;
  color: #6b7280;
  font-weight: 600;
}
.btn__text--save {
  font-size: 30rpx;
  color: #fff;
  font-weight: 700;
}
</style>
