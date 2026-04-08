<template>
  <view class="admin-body">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <view class="spinner" />
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <view v-else class="body-wrapper">
      <!-- 社团列表 -->
      <scroll-view v-if="tab === 'clubs'" class="body-scroll" scroll-y>
        <view v-if="clubs.length === 0" class="empty-state">
          <text class="empty-icon">🎭</text>
          <text class="empty-text">暂无社团数据</text>
        </view>

        <view v-else class="list-container">
          <ClubItem
            v-for="club in paginatedClubs"
            :key="club.club_id"
            :club="club"
            :role="adminRole"
            @edit="$emit('edit', club)"
            @delete="$emit('delete', club)"
          />
        </view>
      </scroll-view>

      <!-- 学生列表 -->
      <scroll-view v-else class="body-scroll" scroll-y>
        <view v-if="students.length === 0" class="empty-state">
          <text class="empty-icon">👤</text>
          <text class="empty-text">暂无学生数据</text>
        </view>

        <view v-else class="list-container">
          <StudentItem
            v-for="student in paginatedStudents"
            :key="student.student_id"
            :student="student"
            :role="adminRole"
            @edit="$emit('edit', student)"
            @delete="$emit('delete', student)"
          />
        </view>
      </scroll-view>

      <!-- 分页器 -->
      <Pagination
        v-if="
          (tab === 'clubs' && clubs.length > 0) ||
          (tab === 'students' && students.length > 0)
        "
        :current-page="currentPage"
        :total-pages="tab === 'clubs' ? totalPagesClubs : totalPagesStudents"
        :total-items="tab === 'clubs' ? clubs.length : students.length"
        :page-size="pageSize"
        @change="handlePageChange"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ClubItem from "./ClubItem.vue";
import StudentItem from "./StudentItem.vue";
import Pagination from "./Pagination.vue";

const props = defineProps({
  tab: {
    type: String,
    default: "clubs",
  },
  clubs: {
    type: Array,
    default: () => [],
  },
  students: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Number,
    default: 1,
  },
});

defineEmits(["edit", "delete"]);

// ── 分页状态 ──
const currentPage = ref(1);
const pageSize = ref(10);
const adminRole = ref(props.role);

// ── 监听 tab 切换，重置页码 ──
watch(
  () => props.tab,
  () => {
    currentPage.value = 1;
  },
);

// ── 社团总页数 ──
const totalPagesClubs = computed(() => {
  return Math.ceil(props.clubs.length / pageSize.value) || 1;
});

// ── 学生总页数 ──
const totalPagesStudents = computed(() => {
  return Math.ceil(props.students.length / pageSize.value) || 1;
});

// ── 分页后的社团数据 ──
const paginatedClubs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return props.clubs.slice(start, end);
});

// ── 分页后的学生数据 ──
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return props.students.slice(start, end);
});

// ── 页码变更事件 ──
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};
</script>

<style scoped>
.admin-body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1a1f35 100%);
  position: relative;
  display: flex;
  flex-direction: column;
}

/* ════════════════════════════════════════
   加载状态
════════════════════════════════════════ */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20rpx;
}

.spinner {
  width: 50rpx;
  height: 50rpx;
  border: 4rpx solid rgba(99, 102, 241, 0.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* ════════════════════════════════════════
   内容包装器
════════════════════════════════════════ */
.body-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ════════════════════════════════════════
   滚动区域
════════════════════════════════════════ */
.body-scroll {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20rpx;
  color: rgba(255, 255, 255, 0.35);
}

.empty-icon {
  font-size: 80rpx;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

.empty-text {
  font-size: 24rpx;
}

.list-container {
  padding: 24rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}
</style>
