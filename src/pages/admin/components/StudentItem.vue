<template>
  <view class="student-item">
    <!-- 头部：头像、姓名、学号 -->
    <view class="student-header">
      <!-- 头像 -->
      <view class="student-avatar">
        <image
          v-if="student.avatar"
          :src="student.avatar"
          class="avatar-img"
          mode="aspectFill"
          @error="handleAvatarError"
        />
        <text v-else class="avatar-placeholder">{{ getInitials }}</text>
      </view>

      <!-- 基本信息 -->
      <view class="student-info-main">
        <view class="info-row-top">
          <text class="student-name">{{ student.name }}</text>
          <view class="status-badges">
            <!-- 账号状态 -->
            <view
              class="badge"
              :class="`badge--${student.account_status ? 'active' : 'disabled'}`"
            >
              {{ student.account_status ? "正常" : "禁用" }}
            </view>

            <!-- 选社状态 -->
            <view class="badge" :class="`badge--${getSelectionStatus}`">
              {{ getSelectionText }}
            </view>

            <!-- 预留状态 -->
            <view v-if="student.is_reserved" class="badge badge--reserved">
              预留
            </view>
          </view>
        </view>

        <view class="info-row-detail">
          <text class="student-id">
            <text class="label">学号:</text>
            {{ student.student_id }}
          </text>
          <text class="student-class">
            <text class="label">班级:</text>
            {{ student.class_name }}
          </text>
        </view>
      </view>
    </view>

    <!-- 中部：详细信息 -->
    <view class="student-details">
      <view class="detail-item">
        <text class="detail-label">专业</text>
        <text class="detail-value">{{ student.major_name || "暂无" }}</text>
      </view>

      <view class="detail-item">
        <text class="detail-label">学院</text>
        <text class="detail-value">{{ student.department || "暂无" }}</text>
      </view>

      <view class="detail-item">
        <text class="detail-label">邮箱</text>
        <text class="detail-value email-value">
          {{ student.email || "暂无" }}
        </text>
      </view>

      <view class="detail-item">
        <text class="detail-label">电话</text>
        <text class="detail-value">{{ student.phone || "暂无" }}</text>
      </view>

      <!-- 密码状态 -->
      <view class="detail-item">
        <text class="detail-label">密码状态</text>
        <text class="detail-value" :class="`pwd-${student.is_pwd_changed}`">
          {{ student.is_pwd_changed ? "已修改" : "初始状态" }}
        </text>
      </view>
      <!-- 选社信息 -->
      <view v-if="student.has_selected" class="detail-item selected-club">
        <text class="detail-label">选社</text>
        <text class="detail-value club-name">
          {{ student.selected_club_name || "暂无" }}
        </text>
        <text class="selected-time" v-if="student.selected_at">
          {{ formatSelectedTime(student.selected_at) }}
        </text>
      </view>
      <view v-if="student.is_reserved" class="detail-item reserved-club">
        <text class="detail-label">预留</text>
        <text class="detail-value club-name">
          {{ student.reserved_club_name || "暂无" }}
        </text>
      </view>
    </view>

    <!-- 底部：操作按钮 -->
    <view class="student-actions" v-if="adminRole === 2">
      <view class="action-btn btn-edit" @click="$emit('edit')">
        <text class="btn-icon">✎</text>
        <text class="btn-text">编辑</text>
      </view>
      <view class="action-btn btn-delete" @click="$emit('delete')">
        <text class="btn-icon">🗑</text>
        <text class="btn-text">删除</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
});

const adminRole = ref(props.role);

defineEmits(["edit", "delete"]);

// ── 获取姓名首字母 ──
const getInitials = computed(() => {
  return props.student.name?.charAt(0).toUpperCase() || "U";
});

// ── 选社状态 ──
const getSelectionStatus = computed(() => {
  if (props.student.is_reserved) {
    return "reserved";
  }
  return props.student.has_selected ? "selected" : "unselected";
});

const getSelectionText = computed(() => {
  if (props.student.is_reserved) {
    return "预留中";
  }
  return props.student.has_selected ? "已选社" : "未选社";
});

// ── 处理头像加载失败 ──
const handleAvatarError = () => {
  // 头像加载失败时，显示占位符
  console.warn(`学生 ${props.student.name} 的头像加载失败`);
};

// ── 格式化选社时间 ──
const formatSelectedTime = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateStr;
  }
};
</script>

<style scoped>
.student-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 16rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1rpx solid rgba(99, 102, 241, 0.12);
  border-radius: 16rpx;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  box-shadow: 0 2rpx 4rpx rgba(99, 102, 241, 0.04);
}

.student-item:active {
  background: linear-gradient(135deg, #f0f4f8 0%, #e0e7ff 100%);
  border-color: rgba(99, 102, 241, 0.25);
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.12);
}

/* ════════════════════════════════════════
   头部区域
════════════════════════════════════════ */
.student-header {
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
}

/* ── 头像 ── */
.student-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.15);
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 700;
}

/* ── 主信息 ── */
.student-info-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.info-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.student-name {
  font-size: 24rpx;
  font-weight: 700;
  color: #1e293b;
  flex: 1;
}

/* ── 状态徽章组 ── */
.status-badges {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.badge {
  padding: 8rpx 14rpx;
  border-radius: 8rpx;
  font-size: 14rpx;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.badge--active {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1rpx solid rgba(34, 197, 94, 0.2);
}

.badge--disabled {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1rpx solid rgba(239, 68, 68, 0.2);
}

.badge--selected {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 1rpx solid rgba(59, 130, 246, 0.2);
}

.badge--unselected {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
  border: 1rpx solid rgba(251, 191, 36, 0.2);
}

.badge--reserved {
  background: rgba(168, 85, 247, 0.1);
  color: #7c3aed;
  border: 1rpx solid rgba(168, 85, 247, 0.2);
}

/* ── 详细信息行 ── */
.info-row-detail {
  display: flex;
  gap: 24rpx;
  font-size: 16rpx;
}

.student-id,
.student-class {
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #64748b;
}

.label {
  color: #94a3b8;
  font-weight: 600;
}

/* ════════════════════════════════════════
   详细信息区域
════════════════════════════════════════ */
.student-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  padding: 12rpx 0;
  border-top: 1rpx solid rgba(99, 102, 241, 0.12);
  border-bottom: 1rpx solid rgba(99, 102, 241, 0.12);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  padding: 10rpx;
  background: #f8fafc;
  border-radius: 8rpx;
  border: 1rpx solid rgba(99, 102, 241, 0.1);
}

.detail-item.selected-club {
  grid-column: span 3;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  background: #eff6ff;
  border-color: rgba(59, 130, 246, 0.2);
  padding: 10rpx 12rpx;
}

.detail-item.reserved-club {
  grid-column: span 3;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  background: #eff6ff;
  border-color: rgba(171, 59, 246, 0.2);
  padding: 10rpx 12rpx;
}

.detail-label {
  font-size: 14rpx;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5rpx;
}

.detail-value {
  font-size: 16rpx;
  color: #1e293b;
  font-weight: 500;
  word-break: break-all;
}

.email-value {
  font-size: 14rpx;
  color: #6366f1;
}

.club-name {
  font-size: 18rpx;
  font-weight: 600;
  color: #2563eb;
  flex: 1;
}

.selected-time {
  font-size: 14rpx;
  color: #94a3b8;
  white-space: nowrap;
}

.pwd-1 {
  color: #16a34a;
}

.pwd-0 {
  color: #d97706;
}

/* ════════════════════════════════════════
   操作按钮区域
════════════════════════════════════════ */
.student-actions {
  display: flex;
  gap: 12rpx;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 12rpx 18rpx;
  background: #f1f5f9;
  border: 1rpx solid rgba(99, 102, 241, 0.12);
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16rpx;
  min-width: 70rpx;
}

.action-btn:active {
  transform: scale(0.95);
}

.btn-edit {
  color: #2563eb;
  border-color: rgba(37, 99, 235, 0.2);
}

.btn-edit:active {
  background: #dbeafe;
  border-color: rgba(37, 99, 235, 0.3);
}

.btn-delete {
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.2);
}

.btn-delete:active {
  background: #fee2e2;
  border-color: rgba(220, 38, 38, 0.3);
}

.btn-icon {
  font-size: 16rpx;
}

.btn-text {
  font-weight: 600;
}
</style>
