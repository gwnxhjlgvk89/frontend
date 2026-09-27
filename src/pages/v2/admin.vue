<template>
  <view class="screen"
    ><view class="row between"
      ><text class="eyebrow">社团管理工作台</text
      ><text class="link" @tap="s.logout">退出登录</text></view
    ><view class="title">把招新安排妥当。</view
    ><view class="subtitle">{{ s.user?.name }} · {{ s.activityLabel }}</view>
    <view class="stats"
      ><view class="card stat"
        ><view class="stat-num">{{ overview.students ?? "—" }}</view
        ><text class="muted">学生总数</text></view
      ><view class="card stat"
        ><view class="stat-num">{{ overview.enrolled ?? "—" }}</view
        ><text class="muted">已选社团</text></view
      ><view class="card stat"
        ><view class="stat-num">{{ overview.clubs ?? "—" }}</view
        ><text class="muted">社团数量</text></view
      ></view
    >
    <view v-if="s.canSelect" class="card"
      ><text class="tag warning">报名正在进行</text
      ><view class="muted"
        >学生、社团及名额暂时只读。如需调整，请超级管理员先暂停报名。</view
      ></view
    >
    <view class="tabs"
      ><view
        v-for="t in tabs"
        :key="t.key"
        :class="['chip', tab === t.key && 'active']"
        @tap="changeTab(t.key)"
        >{{ t.label }}</view
      ></view
    >
    <view v-if="error" class="error" @tap="load">{{ error }} · 点击重试</view>
    <view v-if="tab === 'students'"
      ><view class="row"
        ><input
          class="input grow"
          v-model="search"
          placeholder="搜索学号或姓名"
          @confirm="searchStudents"
        /><button class="secondary small" @tap="searchStudents">
          搜索
        </button></view
      ><view class="tabs"
        ><button
          class="primary small"
          :disabled="s.canSelect"
          @tap="edit('student', {})"
        >
          新增学生</button
        ><button class="secondary small" @tap="loadStudents">刷新</button></view
      ><view v-for="u in students" :key="u.id" class="card"
        ><view class="row between"
          ><view
            ><view class="student-name">{{ u.name }}</view
            ><text class="muted"
              >{{ u.username }} · {{ u.major }} · {{ u.class_name }}</text
            ></view
          ><text :class="['tag', !u.club_id && 'gray']">{{
            u.club_id ? "已报名" : "未报名"
          }}</text></view
        ><view v-if="u.club_name" class="muted"
          >{{ u.source === "reserved" ? "预报名：" : "已选："
          }}{{ u.club_name }}</view
        ><view class="tabs" v-if="!s.canSelect"
          ><button class="secondary small" @tap="edit('student', u)">
            编辑</button
          ><button class="danger small" @tap="remove('students', u)">
            删除
          </button></view
        ></view
      ><view class="row between"
        ><button
          class="secondary small"
          :disabled="page === 1"
          @tap="
            page--;
            loadStudents();
          "
        >
          上一页</button
        ><text class="muted"
          >{{ page }} / {{ Math.max(1, Math.ceil(total / 30)) }} 页 ·
          {{ total }} 人</text
        ><button
          class="secondary small"
          :disabled="page * 30 >= total"
          @tap="
            page++;
            loadStudents();
          "
        >
          下一页
        </button></view
      ></view
    >
    <view v-if="tab === 'clubs'"
      ><button class="primary" :disabled="s.canSelect" @tap="edit('club', {})">
        新增社团</button
      ><view v-for="c in clubs" :key="c.id" class="card club-row"
        ><view class="row between"
          ><view class="student-name">{{ c.name }}</view
          ><text class="tag"
            >余 {{ c.remaining }} / {{ c.capacity }}</text
          ></view
        ><text class="muted"
          >{{ c.category }} · {{ c.active ? "展示中" : "已隐藏" }}</text
        ><view class="tabs" v-if="!s.canSelect"
          ><button class="secondary small" @tap="edit('club', c)">编辑</button
          ><button class="danger small" @tap="remove('clubs', c)">
            删除
          </button></view
        ></view
      ></view
    >
    <ActivityEditor
      v-if="tab === 'activity' && s.activity && s.user?.role === 'super_admin'"
      :key="s.activity.version"
      :activity="s.activity"
      @saved="load"
    />
    <view v-if="tab === 'jobs'"
      ><view class="card"
        ><view class="section-title">导入学生名单</view
        ><text class="muted"
          >选择
          XLSX，先检查预览再确认导入。只新增账号，重复账号会被拒绝。报名期间不可执行。</text
        ><view class="muted template"
          >表头：username、name、major、class_name、password、reserved_club_id</view
        ><button
          class="secondary"
          :disabled="s.canSelect || busy"
          :loading="busy"
          @tap="importFile"
        >
          选择文件并预览
        </button></view
      ><view class="card"
        ><view class="section-title">导出报名结果</view
        ><text class="muted">生成包含学生和社团的 Excel，由后台任务处理。</text
        ><button
          class="secondary export"
          :disabled="s.canSelect || busy"
          @tap="exportFile"
        >
          创建导出任务
        </button></view
      ><view v-for="j in jobs" :key="j.id" class="card"
        ><view class="row between"
          ><text>任务 {{ j.id.slice(0, 8) }}</text
          ><text class="tag">{{ jobLabels[j.state] || j.state }}</text></view
        ><text class="muted">{{
          j.result?.message || "共 " + (j.result?.rows ?? "—") + " 行"
        }}</text
        ><view v-for="(r, i) in j.result?.preview" :key="i" class="muted"
          >{{ r.username }} · {{ r.name }} · {{ r.major }}</view
        ><view class="tabs"
          ><button
            v-if="j.state === 'preview'"
            class="primary small"
            :disabled="s.canSelect"
            @tap="confirmJob(j)"
          >
            确认导入</button
          ><button
            v-if="['queued', 'running'].includes(j.state)"
            class="secondary small"
            @tap="refreshJob(j.id)"
          >
            刷新进度</button
          ><button
            v-if="j.result?.download"
            class="primary small"
            @tap="download(j)"
          >
            打开导出文件
          </button></view
        ></view
      ></view
    >
    <Administrators
      v-if="tab === 'administrators' && s.user?.role === 'super_admin'"
    />
    <AdminEditor
      v-if="editing"
      :kind="editing.kind"
      :item="editing.item"
      :clubs="clubs"
      @close="editing = null"
      @saved="
        editing = null;
        load();
      "
    />
  </view>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { onShow, onHide, onUnload } from "@dcloudio/uni-app";
import { useSession } from "@/v2/session";
import { API, getToken, notifyError, request, upload } from "@/v2/api";
import type { Club, Job } from "@/v2/types";
import AdminEditor from "@/v2/AdminEditor.vue";
import ActivityEditor from "@/v2/ActivityEditor.vue";
import Administrators from "@/v2/Administrators.vue";
const s = useSession(),
  overview = ref<any>({}),
  tab = ref("students"),
  students = ref<any[]>([]),
  clubs = ref<Club[]>([]),
  total = ref(0),
  page = ref(1),
  search = ref(""),
  error = ref(""),
  busy = ref(false),
  jobs = ref<Job[]>([]),
  editing = ref<{ kind: "club" | "student"; item: any } | null>(null);
let jobTimer: ReturnType<typeof setTimeout> | undefined;
let visible = true;
const tabs = computed(() => [
  { key: "students", label: "学生名单" },
  { key: "clubs", label: "社团管理" },
  ...(s.user?.role === "super_admin"
    ? [
        { key: "activity", label: "活动设置" },
        { key: "administrators", label: "管理员" },
      ]
    : []),
  { key: "jobs", label: "导入导出" },
]);
const jobLabels: Record<string, string> = {
  preview: "待确认",
  queued: "排队中",
  running: "处理中",
  done: "已完成",
  failed: "失败",
};
async function loadStudents() {
  try {
    const d = await request<{ items: any[]; total: number }>(
      `/admin/students?page=${page.value}&search=${encodeURIComponent(search.value)}`,
    );
    students.value = d.items;
    total.value = d.total;
  } catch (e) {
    error.value = (e as Error).message;
  }
}
async function load() {
  error.value = "";
  try {
    await s.refresh(true);
    if (!s.isAdmin) {
      uni.reLaunch({ url: "/pages/v2/home" });
      return;
    }
    const [o, c] = await Promise.all([
      request("/admin/overview"),
      request<Club[]>("/admin/clubs"),
    ]);
    overview.value = o;
    clubs.value = c;
    if (tab.value === "students") await loadStudents();
  } catch (e) {
    error.value = (e as Error).message;
  }
}
function searchStudents() {
  page.value = 1;
  loadStudents();
}
function changeTab(t: string) {
  tab.value = t;
  if (t === "students") loadStudents();
  if (t === "jobs") loadJobs();
}
function edit(kind: "club" | "student", item: any) {
  editing.value = { kind, item };
}
function remove(kind: string, item: any) {
  uni.showModal({
    title: "确认删除？",
    content: `删除 ${item.name}。已有报名的社团不能直接删除。`,
    success: async (r) => {
      if (r.confirm) {
        try {
          await request(`/admin/${kind}/${item.id}`, "DELETE");
          await load();
        } catch (e) {
          notifyError(e);
        }
      }
    },
  });
}
function importFile() {
  uni.chooseMessageFile({
    count: 1,
    type: "file",
    extension: ["xlsx"],
    success: async (r) => {
      busy.value = true;
      try {
        const j = await upload<any>("/admin/jobs/import", r.tempFiles[0].path);
        jobs.value.unshift({ id: j.id, state: j.state, result: {} });
        scheduleJobs();
      } catch (e) {
        notifyError(e);
      } finally {
        busy.value = false;
      }
    },
  });
}
async function confirmJob(j: Job) {
  try {
    await request(`/admin/jobs/${j.id}/confirm`, "POST");
    await refreshJob(j.id);
    scheduleJobs();
  } catch (e) {
    notifyError(e);
  }
}
async function exportFile() {
  try {
    const j = await request<{ id: string }>("/admin/jobs/export", "POST");
    await refreshJob(j.id);
    scheduleJobs();
  } catch (e) {
    notifyError(e);
  }
}
async function loadJobs() {
  try {
    jobs.value = await request<Job[]>("/admin/jobs");
    scheduleJobs();
  } catch (e) {
    notifyError(e);
  }
}
async function refreshJob(id: string) {
  const j = await request<Job>("/admin/jobs/" + id);
  const index = jobs.value.findIndex((x) => x.id === id);
  if (index < 0) jobs.value.unshift(j);
  else jobs.value[index] = j;
}
function scheduleJobs() {
  clearTimeout(jobTimer);
  if (
    !visible ||
    !jobs.value.some((j) => ["running", "queued"].includes(j.state))
  )
    return;
  jobTimer = setTimeout(async () => {
    await Promise.all(
      jobs.value
        .filter((j) => ["running", "queued"].includes(j.state))
        .map((j) => refreshJob(j.id).catch(notifyError)),
    );
    scheduleJobs();
  }, 3000);
}
function download(j: Job) {
  uni.downloadFile({
    url: API + j.result.download,
    header: { Authorization: `Bearer ${getToken()}` },
    success: (r) => {
      if (r.statusCode === 200)
        uni.openDocument({
          filePath: r.tempFilePath,
          fileType: "xlsx",
          showMenu: true,
        });
      else notifyError(new Error("下载失败"));
    },
    fail: notifyError,
  });
}
onShow(() => {
  visible = true;
  load();
  scheduleJobs();
});
function hide() {
  visible = false;
  clearTimeout(jobTimer);
}
onHide(hide);
onUnload(hide);
</script>
<style scoped>
.stats {
  display: flex;
  gap: 16rpx;
  margin-top: 30rpx;
}
.stat {
  flex: 1;
  text-align: center;
  padding: 24rpx 10rpx;
}
.stat-num {
  font-size: 45rpx;
  color: #087f83;
  font-weight: 700;
}
.student-name {
  font-size: 30rpx;
  font-weight: 650;
}
.club-row {
  margin-top: 20rpx;
}
.template {
  display: block;
  margin: 24rpx 0;
}
.export {
  margin-top: 22rpx;
}
</style>
