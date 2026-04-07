<template>
  <view class="admin-container">
    <!-- 顶部头部 -->
    <view class="admin-header">
      <AdminHeader
        :active-tab="activeTab"
        :search-query="searchQuery"
        :filters="currentFilters"
        @tab-change="activeTab = $event"
        @search="searchQuery = $event"
        @filter-change="handleFilterChange"
        @add="handleAdd"
      />
    </view>

    <!-- 中间内容区 -->
    <view class="admin-body">
      <AdminBody
        :tab="activeTab"
        :clubs="filteredClubs"
        :students="filteredStudents"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </view>

    <!-- 底部导航 -->
    <view class="admin-footer">
      <AdminFooter
        :active-tab="activeTab"
        :club-count="clubs.length"
        :student-count="students.length"
        :club-stats="clubStats"
        :student-stats="studentStats"
        @tab-change="activeTab = $event"
      />
    </view>

    <!-- 编辑模态框 -->
    <EditModal
      v-if="showEditModal"
      :type="editType"
      :data="editData"
      @save="handleSave"
      @close="showEditModal = false"
    />

    <!-- 删除确认框 -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :title="deleteTitle"
      :message="deleteMessage"
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteConfirm = false"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AdminHeader from "./components/AdminHeader.vue";
import AdminBody from "./components/AdminBody.vue";
import AdminFooter from "./components/AdminFooter.vue";
import EditModal from "./components/EditModal.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";
import adminApi from "./api/admin.js";

// ── 基础状态 ──
const activeTab = ref("clubs");
const searchQuery = ref("");
const loading = ref(false);

// ── 数据 ──
const clubs = ref([]);
const students = ref([]);

// ── 筛选状态 ──
const clubFilters = ref({
  status: "all",
  majorLimit: "all",
  quotaStatus: "all",
});

const studentFilters = ref({
  selectedStatus: "all",
  grade: "all",
  major: "all",
});

// ── 模态框状态 ──
const showEditModal = ref(false);
const editType = ref(null);
const editData = ref(null);
const showDeleteConfirm = ref(false);
const deleteTitle = ref("");
const deleteMessage = ref("");
const deleteItemType = ref(null);
const deleteItemId = ref(null);

// ── 当前筛选条件 ──
const currentFilters = computed(() => {
  return activeTab.value === "clubs" ? clubFilters.value : studentFilters.value;
});

// ── 过滤后的社团列表 ──
const filteredClubs = computed(() => {
  let result = clubs.value;

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (club) =>
        club.club_name.toLowerCase().includes(query) ||
        club.teacher_advisor?.toLowerCase().includes(query) ||
        club.club_president?.toLowerCase().includes(query),
    );
  }

  // 招募状态筛选
  if (clubFilters.value.status !== "all") {
    const statusMap = {
      open: 1,
      closed: 0,
      full: 2,
      ended: 3,
    };
    result = result.filter(
      (club) => club.club_status === statusMap[clubFilters.value.status],
    );
  }

  // 专业限制筛选
  if (clubFilters.value.majorLimit !== "all") {
    const hasLimit = clubFilters.value.majorLimit === "yes";
    result = result.filter((club) => club.has_major_limit === hasLimit);
  }

  // 名额状态筛选
  if (clubFilters.value.quotaStatus !== "all") {
    result = result.filter((club) => {
      const usage =
        (club.total_quota - club.remaining_quota) / club.total_quota;
      if (clubFilters.value.quotaStatus === "sufficient") return usage < 0.7;
      if (clubFilters.value.quotaStatus === "tight")
        return usage >= 0.7 && usage < 1;
      if (clubFilters.value.quotaStatus === "full") return usage === 1;
      return true;
    });
  }

  return result;
});

// ── 过滤后的学生列表 ──
const filteredStudents = computed(() => {
  let result = students.value;

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.student_id.includes(query) ||
        student.major?.toLowerCase().includes(query),
    );
  }

  // 选社状态筛选
  if (studentFilters.value.selectedStatus !== "all") {
    const selected = studentFilters.value.selectedStatus === "selected";
    result = result.filter((student) => student.has_selected === selected);
  }

  // 年级筛选
  if (studentFilters.value.grade !== "all") {
    result = result.filter(
      (student) => student.grade === studentFilters.value.grade,
    );
  }

  // 专业筛选
  if (studentFilters.value.major !== "all") {
    result = result.filter(
      (student) => student.major === studentFilters.value.major,
    );
  }

  return result;
});

// ── 统计数据 ──
const clubStats = computed(() => ({
  total: clubs.value.length,
  open: clubs.value.filter((c) => c.club_status === 1).length,
  full: clubs.value.filter((c) => c.club_status === 2).length,
}));

const studentStats = computed(() => ({
  total: students.value.length,
  selected: students.value.filter((s) => s.has_selected).length,
  unselected: students.value.filter((s) => !s.has_selected).length,
}));

// ── 生命周期 ──
onMounted(async () => {
  await loadData();
});

// ── 数据加载 ──
const loadData = async () => {
  try {
    loading.value = true;
    const [clubsRes, studentsRes] = await Promise.all([
      await adminApi.getClubs(),
      await adminApi.getStudents(),
    ]);
    clubs.value = clubsRes || [];
    students.value = studentsRes || [];
  } catch (error) {
    console.error("加载数据失败:", error);
    uni.showToast({ title: "加载失败", icon: "error" });
  } finally {
    loading.value = false;
  }
};

// ── 事件处理 ──
const handleFilterChange = (newFilters) => {
  if (activeTab.value === "clubs") {
    clubFilters.value = newFilters;
  } else {
    studentFilters.value = newFilters;
  }
};

const handleEdit = (item) => {
  editType.value = activeTab.value === "clubs" ? "club" : "student";
  editData.value = JSON.parse(JSON.stringify(item));
  showEditModal.value = true;
};

const handleAdd = () => {
  editType.value = activeTab.value === "clubs" ? "club" : "student";
  editData.value =
    activeTab.value === "clubs"
      ? {
          club_id: null,
          club_name: "",
          club_status: 1,
          total_quota: 0,
          remaining_quota: 0,
        }
      : {
          student_id: null,
          name: "",
          major: "",
          grade: "",
        };
  showEditModal.value = true;
};

const handleDelete = (item) => {
  if (activeTab.value === "clubs") {
    deleteTitle.value = "删除社团";
    deleteMessage.value = `确定要删除社团"${item.club_name}"吗？此操作不可撤销。`;
    deleteItemType.value = "club";
    deleteItemId.value = item.club_id;
  } else {
    deleteTitle.value = "删除学生";
    deleteMessage.value = `确定要删除学生"${item.name}"吗？此操作不可撤销。`;
    deleteItemType.value = "student";
    deleteItemId.value = item.student_id;
  }
  showDeleteConfirm.value = true;
};

const handleSave = async (data) => {
  try {
    loading.value = true;
    if (editType.value === "club") {
      if (data.club_id) {
        await adminApi.updateClub(data);
        const index = clubs.value.findIndex((c) => c.club_id === data.club_id);
        if (index > -1) clubs.value[index] = data;
      } else {
        const res = await adminApi.createClub(data);
        clubs.value.push(res.data);
      }
    } else {
      if (data.student_id) {
        await adminApi.updateStudent(data);
        const index = students.value.findIndex(
          (s) => s.student_id === data.student_id,
        );
        if (index > -1) students.value[index] = data;
      } else {
        const res = await adminApi.createStudent(data);
        students.value.push(res.data);
      }
    }
    showEditModal.value = false;
    uni.showToast({ title: "保存成功", icon: "success" });
  } catch (error) {
    console.error("保存失败:", error);
    uni.showToast({ title: "保存失败", icon: "error" });
  } finally {
    loading.value = false;
  }
};

const handleDeleteConfirm = async () => {
  try {
    loading.value = true;
    if (deleteItemType.value === "club") {
      await deleteClub(deleteItemId.value);
    } else {
      await deleteStudent(deleteItemId.value);
    }
    showDeleteConfirm.value = false;
    uni.showToast({ title: "删除成功", icon: "success" });
  } catch (error) {
    console.error("删除失败:", error);
    uni.showToast({ title: "删除失败", icon: "error" });
  } finally {
    loading.value = false;
  }
};

const deleteClub = async (clubId) => {
  await adminApi.deleteClub(clubId);
  clubs.value = clubs.value.filter((c) => c.club_id !== clubId);
};

const deleteStudent = async (studentId) => {
  await adminApi.deleteStudent(studentId);
  students.value = students.value.filter((s) => s.student_id !== studentId);
};
</script>

<style scoped lang="scss">
.admin-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1a1f35 100%);
  overflow: hidden;

  .admin-header,
  .admin-footer {
    flex-shrink: 0;
    position: relative;
    z-index: 100;
  }
  .admin-body {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
