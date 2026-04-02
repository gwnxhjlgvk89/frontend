<template>
  <view class="modal-overlay" @click="handleBackdropClick">
    <view class="modal-container" @click.stop>
      <!-- 头部 -->
      <view class="modal-header">
        <text class="modal-title">
          {{ isNew ? "新增" : "编辑" }}{{ modalTitle }}
        </text>
        <text class="modal-close" @click="$emit('close')">✕</text>
      </view>

      <!-- 内容区 -->
      <scroll-view class="modal-body" scroll-y>
        <!-- 社团表单 -->
        <view v-if="type === 'club'" class="form-section">
          <!-- 社团名称 -->
          <view class="form-group">
            <text class="form-label">社团名称</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入社团名称"
              :value="formData.club_name"
              @input="handleInput('club_name', $event)"
            />
          </view>

          <!-- 招募状态 -->
          <view class="form-group">
            <text class="form-label">招募状态</text>
            <view class="select-wrapper">
              <picker
                mode="selector"
                :range="statusOptions"
                :value="statusIndex"
                @change="handleStatusChange"
              >
                <view class="picker-value">
                  {{ statusOptions[statusIndex] }}
                </view>
              </picker>
            </view>
          </view>

          <!-- 总名额 -->
          <view class="form-group">
            <text class="form-label">总名额</text>
            <input
              class="form-input"
              type="number"
              placeholder="请输入总名额"
              :value="formData.total_quota"
              @input="handleInput('total_quota', $event)"
            />
          </view>

          <!-- 剩余名额 -->
          <view class="form-group">
            <text class="form-label">剩余名额</text>
            <input
              class="form-input"
              type="number"
              placeholder="请输入剩余名额"
              :value="formData.remaining_quota"
              @input="handleInput('remaining_quota', $event)"
            />
          </view>

          <!-- 指导老师 -->
          <view class="form-group">
            <text class="form-label">指导老师</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入指导老师名字"
              :value="formData.teacher_advisor"
              @input="handleInput('teacher_advisor', $event)"
            />
          </view>

          <!-- 社长 -->
          <view class="form-group">
            <text class="form-label">社长</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入社长名字"
              :value="formData.club_president"
              @input="handleInput('club_president', $event)"
            />
          </view>

          <!-- 成立年份 -->
          <view class="form-group">
            <text class="form-label">成立年份</text>
            <input
              class="form-input"
              type="number"
              placeholder="请输入成立年份"
              :value="formData.foundation_year"
              @input="handleInput('foundation_year', $event)"
            />
          </view>

          <!-- 专业限制（切换开关） -->
          <view class="form-group">
            <view class="form-label-row">
              <text class="form-label">专业限制</text>
              <switch
                :checked="formData.has_major_limit"
                @change="handleToggle('has_major_limit', $event)"
              />
            </view>
          </view>

          <!-- 社团简介 -->
          <view class="form-group">
            <text class="form-label">社团简介</text>
            <textarea
              class="form-textarea"
              placeholder="请输入社团简介"
              :value="formData.description"
              @input="handleInput('description', $event)"
            />
          </view>

          <!-- 详细介绍 -->
          <view class="form-group">
            <text class="form-label">详细介绍</text>
            <textarea
              class="form-textarea"
              placeholder="请输入详细介绍"
              :value="formData.description_detail"
              @input="handleInput('description_detail', $event)"
            />
          </view>

          <!-- 活动时间 -->
          <view class="form-group">
            <text class="form-label">活动时间</text>
            <input
              class="form-input"
              type="text"
              placeholder="如：每周二晚上7点"
              :value="formData.activity_time"
              @input="handleInput('activity_time', $event)"
            />
          </view>

          <!-- 活动地点 -->
          <view class="form-group">
            <text class="form-label">活动地点</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入活动地点"
              :value="formData.activity_position"
              @input="handleInput('activity_position', $event)"
            />
          </view>
        </view>

        <!-- 学生表单 -->
        <view v-else class="form-section">
          <!-- 学生名字 -->
          <view class="form-group">
            <text class="form-label">学生名字</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入学生名字"
              :value="formData.name"
              @input="handleInput('name', $event)"
            />
          </view>

          <!-- 学号 -->
          <view class="form-group">
            <text class="form-label">学号</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入学号"
              :value="formData.student_id"
              @input="handleInput('student_id', $event)"
            />
          </view>

          <!-- 专业 -->
          <view class="form-group">
            <text class="form-label">专业</text>
            <input
              class="form-input"
              type="text"
              placeholder="请输入专业"
              :value="formData.major"
              @input="handleInput('major', $event)"
            />
          </view>

          <!-- 年级 -->
          <view class="form-group">
            <text class="form-label">年级</text>
            <view class="select-wrapper">
              <picker
                mode="selector"
                :range="gradeOptions"
                :value="gradeIndex"
                @change="handleGradeChange"
              >
                <view class="picker-value">
                  {{ gradeOptions[gradeIndex] || "请选择年级" }}
                </view>
              </picker>
            </view>
          </view>

          <!-- 邮箱 -->
          <view class="form-group">
            <text class="form-label">邮箱</text>
            <input
              class="form-input"
              type="email"
              placeholder="请输入邮箱"
              :value="formData.email"
              @input="handleInput('email', $event)"
            />
          </view>

          <!-- 电话 -->
          <view class="form-group">
            <text class="form-label">电话</text>
            <input
              class="form-input"
              type="tel"
              placeholder="请输入电话"
              :value="formData.phone"
              @input="handleInput('phone', $event)"
            />
          </view>

          <!-- 选社状态 -->
          <view class="form-group">
            <view class="form-label-row">
              <text class="form-label">已选社</text>
              <switch
                :checked="formData.has_selected"
                @change="handleToggle('has_selected', $event)"
              />
            </view>
          </view>

          <!-- 预留状态 -->
          <view class="form-group">
            <view class="form-label-row">
              <text class="form-label">已预留</text>
              <switch
                :checked="formData.is_reserved"
                @change="handleToggle('is_reserved', $event)"
              />
            </view>
          </view>
        </view>

        <view style="height: 40rpx" />
      </scroll-view>

      <!-- 底部按钮 -->
      <view class="modal-footer">
        <button class="btn btn-cancel" @click="$emit('close')">取消</button>
        <button class="btn btn-save" @click="handleSave">保存</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ["club", "student"].includes(value),
  },
  data: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["save", "close"]);

// 表单数据
const formData = ref({});

// 选项
const statusOptions = ["未开放", "招募中", "已满员", "已结束"];
const gradeOptions = ["大一", "大二", "大三", "大四"];

// 计算属性
const isNew = computed(() => {
  return props.type === "club" ? !props.data.club_id : !props.data.student_id;
});

const modalTitle = computed(() => (props.type === "club" ? "社团" : "学生"));

const statusIndex = computed(() => {
  const statusMap = { 0: 0, 1: 1, 2: 2, 3: 3 };
  return statusMap[formData.value.club_status] || 1;
});

const gradeIndex = computed(() => {
  if (!formData.value.grade) return 0;
  return gradeOptions.indexOf(formData.value.grade);
});

// 监听 props.data 变化，初始化表单
watch(
  () => props.data,
  (newData) => {
    formData.value = JSON.parse(JSON.stringify(newData));
  },
  { immediate: true, deep: true },
);

// 处理输入
const handleInput = (field, event) => {
  formData.value[field] = event.detail.value;
};

// 处理切换开关
const handleToggle = (field, event) => {
  formData.value[field] = event.detail.value;
};

// 处理状态选择
const handleStatusChange = (event) => {
  const statusMap = { 0: 0, 1: 1, 2: 2, 3: 3 };
  formData.value.club_status = statusMap[event.detail.value];
};

// 处理年级选择
const handleGradeChange = (event) => {
  formData.value.grade = gradeOptions[event.detail.value];
};

// 处理背景点击
const handleBackdropClick = () => {
  emit("close");
};

// 验证表单
const validateForm = () => {
  if (props.type === "club") {
    if (!formData.value.club_name) {
      uni.showToast({ title: "请输入社团名称", icon: "error" });
      return false;
    }
    if (formData.value.total_quota <= 0) {
      uni.showToast({ title: "总名额必须大于0", icon: "error" });
      return false;
    }
  } else {
    if (!formData.value.name) {
      uni.showToast({ title: "请输入学生名字", icon: "error" });
      return false;
    }
    if (!formData.value.student_id) {
      uni.showToast({ title: "请输入学号", icon: "error" });
      return false;
    }
  }
  return true;
};

// 处理保存
const handleSave = () => {
  if (!validateForm()) return;

  // 数值转换
  if (props.type === "club") {
    formData.value.total_quota = parseInt(formData.value.total_quota) || 0;
    formData.value.remaining_quota =
      parseInt(formData.value.remaining_quota) || 0;
    formData.value.foundation_year =
      parseInt(formData.value.foundation_year) || null;
  }

  emit("save", formData.value);
};
</script>

<style scoped>
/* ════════════════════════════════════════
   模态框整体
════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 600rpx;
  max-height: 90vh;
  background: linear-gradient(135deg, #1a1f35 0%, #0f172a 100%);
  border: 1rpx solid rgba(99, 102, 241, 0.2);
  border-radius: 24rpx;
  overflow: hidden;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.5);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ════════════════════════════════════════
   头部
════════════════════════════════════════ */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid rgba(99, 102, 241, 0.2);
  flex-shrink: 0;
}

.modal-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #a5f3fc;
}

.modal-close {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 20rpx;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:active {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(0.9);
}

/* ════════════════════════════════════════
   内容区
════════════════════════════════════════ */
.modal-body {
  flex: 1;
  overflow-y: auto;
}

.form-section {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* ════════════════════════════════════════
   表单组
════════════════════════════════════════ */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.form-label {
  font-size: 18rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ════════════════════════════════════════
   输入框
════════════════════════════════════════ */
.form-input,
.form-textarea {
  padding: 12rpx 16rpx;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(99, 102, 241, 0.2);
  border-radius: 12rpx;
  color: #ffffff;
  font-size: 18rpx;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-textarea {
  min-height: 100rpx;
  resize: none;
  font-family: inherit;
}

/* ════════════════════════════════════════
   选择器
════════════════════════════════════════ */
.select-wrapper {
  width: 100%;
}

.select-wrapper picker {
  width: 100%;
}

.picker-value {
  padding: 12rpx 16rpx;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(99, 102, 241, 0.2);
  border-radius: 12rpx;
  color: #ffffff;
  font-size: 18rpx;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  min-height: 44rpx;
}

.select-wrapper picker:active .picker-value {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.5);
}

/* ════════════════════════════════════════
   开关
════════════════════════════════════════ */
switch {
  transform: scale(0.8);
  transform-origin: right;
}

/* ════════════════════════════════════════
   底部按钮
════════════════════════════════════════ */
.modal-footer {
  display: flex;
  gap: 12rpx;
  padding: 24rpx;
  border-top: 1rpx solid rgba(99, 102, 241, 0.2);
  flex-shrink: 0;
  background: rgba(99, 102, 241, 0.05);
}

.btn {
  flex: 1;
  padding: 16rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border: 1rpx solid rgba(255, 255, 255, 0.15);
}

.btn-cancel:active {
  background: rgba(255, 255, 255, 0.15);
}

.btn-save {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  box-shadow: 0 8rpx 20rpx rgba(99, 102, 241, 0.3);
}

.btn-save:active {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 32rpx rgba(99, 102, 241, 0.4);
}

/* ════════════════════════════════════════
   滚动条美化
════════════════════════════════════════ */
.modal-body::-webkit-scrollbar {
  width: 6rpx;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 4rpx;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

/* ════════════════════════════════════════
   响应式
════════════════════════════════════════ */
@media (max-width: 480px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .form-section {
    padding: 16rpx;
    gap: 16rpx;
  }

  .form-label {
    font-size: 16rpx;
  }

  .form-input,
  .form-textarea {
    font-size: 16rpx;
  }
}
</style>
