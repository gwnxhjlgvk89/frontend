<template>
  <view class="page admin">
    <view class="row between top">
      <view class="row grow who">
        <view class="avatar">{{ initial(s.user?.name, "管") }}</view>
        <text class="ellipsis name-inline">{{ s.user?.name }}</text>
        <text class="caption">{{
          s.user?.role === "super_admin" ? "超级管理员" : "管理员"
        }}</text>
      </view>
      <button class="btn-sm btn-plain" @tap="logout">
        <UiIcon name="log-out" :size="32" />退出
      </button>
    </view>

    <view class="card status">
      <view class="row between">
        <text class="h3 ellipsis grow">{{ s.activity?.name || "报名活动" }}</text>
        <text :class="['tag', stateTone]">{{ s.activityLabel }}</text>
      </view>
      <view class="caption window num">{{ windowText }}</view>
      <view class="stats">
        <view class="stat"
          ><view class="stat-num num">{{ overview.students ?? "—" }}</view
          ><view class="caption">学生</view></view
        >
        <view class="stat"
          ><view class="stat-num num"
            >{{ overview.enrolled ?? "—"
            }}<text v-if="rate !== null" class="rate">{{ rate }}%</text></view
          ><view class="caption">已报名</view></view
        >
        <view class="stat"
          ><view class="stat-num num">{{ overview.clubs ?? "—" }}</view
          ><view class="caption">社团</view></view
        >
      </view>
      <view class="rate-track"
        ><view class="rate-fill" :style="`transform:scaleX(${Number(rate || 0) / 100})`"
      /></view>
      <view v-if="s.canSelect && readonlyTab" class="readonly row"
        ><UiIcon name="lock" :size="28" /><text class="grow"
          >报名进行中，学生、社团和名额只读；如需调整请先暂停报名</text
        ></view
      >
    </view>
    <view v-if="inconsistent" class="gap"
      ><StatusBanner tone="danger" title="名额与报名记录不一致"
        >发布前需要先核对社团名额，系统会阻止带冲突的发布。</StatusBanner
      ></view
    >
    <view v-if="error" class="gap"
      ><StatusBanner tone="danger" title="加载失败"
        >{{ error }}
        <template #action
          ><button class="btn-sm btn-danger" @tap="load">重新加载</button></template
        ></StatusBanner
      ></view
    >

    <view class="tabs-bar">
      <view class="segmented">
        <view
          v-for="t in tabs"
          :key="t.key"
          :class="['seg', tab === t.key && 'on']"
          @tap="changeTab(t.key)"
          >{{ t.label }}</view
        >
      </view>
    </view>

    <view v-if="tab === 'students'">
      <view class="row tools">
        <view :class="['input-box grow', { focus: searchFocus }]">
          <UiIcon name="search" :size="36" />
          <input
            v-model="search"
            placeholder="搜索学号或姓名"
            placeholder-class="placeholder"
            confirm-type="search"
            @focus="searchFocus = true"
            @blur="searchFocus = false"
            @confirm="searchStudents"
          />
          <view
            v-if="search"
            class="icon-btn"
            aria-label="清空搜索"
            @tap="
              search = '';
              searchStudents();
            "
            ><UiIcon name="circle-x" :size="36"
          /></view>
        </view>
        <button
          class="btn-primary add"
          :disabled="s.canSelect"
          aria-label="新增学生"
          @tap="edit('student', {})"
        >
          <UiIcon name="plus" :size="40" />
        </button>
      </view>
      <view class="chips filter-chips">
        <view
          v-for="f in selectedFilters"
          :key="f.key"
          :class="['chip', selected === f.key && 'on']"
          @tap="changeSelected(f.key)"
          >{{ f.label }}</view
        >
      </view>
      <view v-if="students.length" class="list">
        <view
          v-for="u in students"
          :key="u.id"
          class="list-row"
          hover-class="pressed"
          @tap="studentActions(u)"
        >
          <view class="grow">
            <view class="row name-line"
              ><text class="name ellipsis">{{ u.name }}</text
              ><text v-if="!u.active" class="tag">已停用</text></view
            >
            <view class="caption ellipsis"
              >{{ u.username }} · {{ u.major || "未填专业" }} ·
              {{ u.class_name || "未填班级" }}</view
            >
            <view v-if="u.club_name" class="caption club-line ellipsis"
              >{{ u.source === "reserved" ? "预报名" : "已报名" }}：{{
                u.club_name
              }}</view
            >
          </view>
          <text :class="['tag', u.club_id ? 'success' : '']">{{
            u.club_id ? "已报名" : "未报名"
          }}</text>
        </view>
      </view>
      <EmptyState
        v-else-if="loaded"
        icon="users"
        title="没有找到学生"
        :text="search ? '换个学号或姓名试试。' : '可以在“导入导出”里导入名单。'"
      />
      <view v-if="total > pageSize" class="row between pager">
        <button
          class="btn-sm"
          :disabled="page === 1"
          @tap="
            page--;
            loadStudents();
          "
        >
          上一页
        </button>
        <text class="caption num"
          >第 {{ page }} / {{ pages }} 页 · 共 {{ total }} 人</text
        >
        <button
          class="btn-sm"
          :disabled="page >= pages"
          @tap="
            page++;
            loadStudents();
          "
        >
          下一页
        </button>
      </view>
      <view v-else-if="total" class="caption count">共 {{ total }} 人</view>
    </view>

    <view v-if="tab === 'clubs'">
      <view class="row between tools">
        <text class="caption">共 {{ clubs.length }} 个社团 · 点击社团可编辑</text>
        <button
          class="btn-sm btn-primary"
          :disabled="s.canSelect"
          @tap="edit('club', {})"
        >
          <UiIcon name="plus" :size="32" />新增社团
        </button>
      </view>
      <view v-if="clubs.length" class="list">
        <view
          v-for="c in clubs"
          :key="c.id"
          class="list-row club-row"
          hover-class="pressed"
          @tap="clubActions(c)"
        >
          <ClubMark :club="c" :size="80" />
          <view class="grow">
            <view class="row name-line"
              ><text class="name ellipsis grow">{{ c.name }}</text
              ><text :class="['tag', c.active ? 'primary' : '']">{{
                c.active ? "展示中" : "已隐藏"
              }}</text></view
            >
            <view class="meter"
              ><QuotaMeter :remaining="c.remaining" :capacity="c.capacity"
            /></view>
          </view>
        </view>
      </view>
      <EmptyState
        v-else-if="loaded"
        icon="layers"
        title="还没有社团"
        text="新增社团后，学生端会立即看到。"
      />
    </view>

    <ActivityEditor
      v-if="tab === 'activity' && s.activity && s.user?.role === 'super_admin'"
      :key="s.activity.version"
      :activity="s.activity"
      @saved="load"
    />

    <view v-if="tab === 'jobs'">
      <view class="job-actions">
        <view class="card job-card">
          <view class="row job-head"
            ><view class="job-icon"><UiIcon name="upload" :size="32" /></view
            ><text class="h3">导入学生名单</text></view
          >
          <view class="caption"
            >选择 XLSX 文件，先预览再确认。只新增账号，重复学号会被拒绝。</view
          >
          <view class="template caption"
            >表头：username、name、major、class_name、password、reserved_club_id</view
          >
          <button
            class="btn-soft btn-block"
            :disabled="s.canSelect || busy"
            :loading="busy"
            @tap="importFile"
          >
            选择文件
          </button>
        </view>
        <view class="card job-card">
          <view class="row job-head"
            ><view class="job-icon"><UiIcon name="download" :size="32" /></view
            ><text class="h3">导出报名结果</text></view
          >
          <view class="caption">生成包含学生与所报社团的 Excel，由后台处理。</view>
          <button
            class="btn-soft btn-block"
            :disabled="s.canSelect || busy"
            @tap="exportFile"
          >
            创建导出任务
          </button>
        </view>
      </view>
      <view v-if="s.canSelect" class="caption note"
        >报名进行中，导入与导出暂不可用。</view
      >

      <view class="section-head"><text class="h3">任务记录</text></view>
      <view v-if="jobs.length" class="list">
        <view v-for="j in jobs" :key="j.id" class="job">
          <view class="row between">
            <view class="row">
              <UiIcon name="file-spreadsheet" :size="36" color="var(--c-ink-3)" />
              <text class="num">任务 {{ j.id.slice(0, 8) }}</text>
            </view>
            <text :class="['tag', jobTone(j.state)]">{{
              jobLabels[j.state] || j.state
            }}</text>
          </view>
          <view v-if="['queued', 'running'].includes(j.state)" class="progress"
            ><view class="progress-bar"
          /></view>
          <view class="caption job-msg">{{
            j.result?.message ||
            (j.result?.rows !== undefined ? `共 ${j.result.rows} 行` : "等待处理")
          }}</view>
          <view v-if="j.result?.preview?.length" class="preview">
            <view v-for="(r, i) in j.result.preview" :key="i" class="preview-row"
              ><text class="num">{{ r.username }}</text><text>{{ r.name }}</text
              ><text class="ellipsis">{{ r.major }}</text></view
            >
          </view>
          <view class="row job-buttons">
            <button
              v-if="j.state === 'preview'"
              class="btn-sm btn-primary"
              :disabled="s.canSelect"
              @tap="confirmJob(j)"
            >
              确认导入
            </button>
            <button
              v-if="['queued', 'running'].includes(j.state)"
              class="btn-sm"
              @tap="refreshJob(j.id)"
            >
              <UiIcon name="refresh-cw" :size="28" />刷新进度
            </button>
            <button
              v-if="j.result?.download"
              class="btn-sm btn-soft"
              @tap="download(j)"
            >
              <UiIcon name="download" :size="28" />打开文件
            </button>
          </view>
        </view>
      </view>
      <EmptyState
        v-else
        icon="file-spreadsheet"
        title="暂无任务"
        text="导入或导出后，进度会显示在这里。"
      />
    </view>

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
import ClubMark from "@/v2/ClubMark.vue";
import EmptyState from "@/v2/EmptyState.vue";
import QuotaMeter from "@/v2/QuotaMeter.vue";
import StatusBanner from "@/v2/StatusBanner.vue";
import UiIcon from "@/v2/UiIcon.vue";
import { formatTime, initial } from "@/v2/format";
const s = useSession(),
  overview = ref<any>({}),
  tab = ref("students"),
  students = ref<any[]>([]),
  clubs = ref<Club[]>([]),
  total = ref(0),
  page = ref(1),
  pageSize = 30,
  search = ref(""),
  searchFocus = ref(false),
  selected = ref(""),
  error = ref(""),
  busy = ref(false),
  loaded = ref(false),
  jobs = ref<Job[]>([]),
  editing = ref<{ kind: "club" | "student"; item: any } | null>(null);
let jobTimer: ReturnType<typeof setTimeout> | undefined;
let visible = true;
const tabs = computed(() => [
  { key: "students", label: "学生名单" },
  { key: "clubs", label: "社团" },
  ...(s.user?.role === "super_admin"
    ? [
        { key: "activity", label: "活动设置" },
        { key: "administrators", label: "管理员" },
      ]
    : []),
  { key: "jobs", label: "导入导出" },
]);
const selectedFilters = [
  { key: "", label: "全部" },
  { key: "yes", label: "已报名" },
  { key: "no", label: "未报名" },
];
const jobLabels: Record<string, string> = {
  preview: "待确认",
  queued: "排队中",
  running: "处理中",
  done: "已完成",
  failed: "失败",
};
function jobTone(state: string) {
  return (
    { preview: "warn", queued: "primary", running: "primary", done: "success", failed: "danger" }[
      state
    ] || ""
  );
}
const readonlyTab = computed(() =>
  ["students", "clubs", "activity", "jobs"].includes(tab.value),
);
const pages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));
const rate = computed(() => {
  if (!overview.value.students) return null;
  const pct = (overview.value.enrolled / overview.value.students) * 100;
  return pct > 0 && pct < 10 ? pct.toFixed(1) : String(Math.round(pct));
});
const inconsistent = computed(() => {
  const v = overview.value.inconsistencies;
  return Array.isArray(v) ? v.length > 0 : !!v;
});
const stateTones: Record<string, string> = {
  报名进行中: "success",
  即将开放: "primary",
  报名已暂停: "warn",
};
const stateTone = computed(() => stateTones[s.activityLabel] || "");
const windowText = computed(() => {
  const a = s.activity;
  if (!a?.starts_at) return "尚未设置报名时间";
  return `${formatTime(a.starts_at)} – ${formatTime(a.ends_at)}`;
});
async function loadStudents() {
  try {
    const d = await request<{ items: any[]; total: number }>(
      `/admin/students?page=${page.value}&search=${encodeURIComponent(search.value)}${selected.value ? "&selected=" + selected.value : ""}`,
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
  } finally {
    loaded.value = true;
  }
}
function searchStudents() {
  page.value = 1;
  loadStudents();
}
function changeSelected(key: string) {
  selected.value = key;
  searchStudents();
}
function changeTab(t: string) {
  tab.value = t;
  if (t === "students") loadStudents();
  if (t === "jobs") loadJobs();
}
function edit(kind: "club" | "student", item: any) {
  editing.value = { kind, item };
}
function rowActions(kind: "club" | "student", item: any) {
  if (s.canSelect) {
    uni.showToast({ title: "报名进行中，暂不能修改", icon: "none" });
    return;
  }
  uni.showActionSheet({
    itemList: ["编辑资料", "删除"],
    itemColor: "#1d2129",
    success: (r) => {
      if (r.tapIndex === 0) edit(kind, item);
      if (r.tapIndex === 1) remove(kind === "club" ? "clubs" : "students", item);
    },
  });
}
const studentActions = (u: any) => rowActions("student", u);
const clubActions = (c: Club) => rowActions("club", c);
function remove(kind: string, item: any) {
  uni.showModal({
    title: `删除${kind === "clubs" ? "社团" : "学生"}？`,
    content: `将删除「${item.name}」，此操作不能撤销。已有报名的社团不能直接删除。`,
    confirmText: "删除",
    confirmColor: "#c8281c",
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
function logout() {
  uni.showModal({
    title: "退出登录？",
    content: "退出后需要重新输入账号和密码。",
    confirmText: "退出",
    confirmColor: "#c8281c",
    success: (r) => {
      if (r.confirm) s.logout();
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
function confirmJob(j: Job) {
  uni.showModal({
    title: "确认导入名单？",
    content: `${j.result?.rows !== undefined ? `将新增 ${j.result.rows} 个学生账号。` : ""}导入后学生可以用学号和姓名登录。`,
    confirmText: "确认导入",
    success: async (r) => {
      if (!r.confirm) return;
      try {
        await request(`/admin/jobs/${j.id}/confirm`, "POST");
        await refreshJob(j.id);
        scheduleJobs();
      } catch (e) {
        notifyError(e);
      }
    },
  });
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
.admin {
  padding-top: 24rpx;
}
.top {
  margin-bottom: 16rpx;
}
.who {
  gap: 12rpx;
}
.name-inline {
  font-size: 28rpx;
  font-weight: 600;
  max-width: 50%;
}
.readonly {
  gap: 10rpx;
  align-items: flex-start;
  margin-top: 24rpx;
  padding: 16rpx 20rpx;
  border-radius: var(--r-sm);
  background: var(--c-warn-soft);
  color: var(--c-warn);
  font-size: 24rpx;
  line-height: 36rpx;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 56rpx;
  height: 56rpx;
  font-size: 24rpx;
  border-radius: 28rpx;
  background: var(--g-brand);
  color: #fff;
  font-weight: 600;
}
.window {
  margin-top: 4rpx;
}
.stats {
  display: flex;
  margin-top: 28rpx;
}
.stat {
  flex: 1;
}
.stat + .stat {
  padding-left: 28rpx;
  border-left: 1rpx solid var(--c-line);
}
.stat-num {
  font-size: 48rpx;
  font-weight: 600;
  line-height: 1.2;
}
.rate {
  margin-left: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: var(--c-primary);
}
.rate-track {
  height: 8rpx;
  margin-top: 24rpx;
  border-radius: 4rpx;
  background: var(--c-fill-strong);
  overflow: hidden;
}
.rate-fill {
  height: 100%;
  background: var(--g-brand);
  transform-origin: left center;
  transition: transform 400ms var(--ease-out);
}
.gap {
  margin-top: 24rpx;
}
.tabs-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  margin: 24rpx -32rpx 0;
  padding: 16rpx 32rpx;
  background: var(--c-bg);
}
.segmented {
  display: flex;
  padding: 6rpx;
  border-radius: var(--r-md);
  background: var(--c-fill-strong);
}
.seg {
  flex: 1;
  min-width: 0;
  text-align: center;
  white-space: nowrap;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 8rpx;
  border-radius: 14rpx;
  font-size: 25rpx;
  color: var(--c-ink-2);
  transition: background-color var(--t-fast) ease-out, color var(--t-fast) ease-out;
}
.seg.on {
  background: var(--c-surface);
  color: var(--c-ink);
  font-weight: 600;
  box-shadow: 0 2rpx 8rpx rgba(29, 33, 41, 0.08);
}
.tools {
  margin: 8rpx 0 20rpx;
}
.tools .input-box {
  background: var(--c-surface);
}
.add {
  width: 92rpx;
  height: 92rpx;
  padding: 0;
  border-radius: var(--r-md);
}
.filter-chips {
  margin-bottom: 20rpx;
}
.filter-chips .chip {
  height: 56rpx;
  font-size: 24rpx;
}
.name-line {
  gap: 12rpx;
}
.name {
  font-size: 30rpx;
  font-weight: 500;
}
.club-line {
  color: var(--c-ink-2);
}
.club-row {
  align-items: flex-start;
}
.meter {
  margin-top: 12rpx;
}
.pager {
  margin-top: 24rpx;
}
.count {
  text-align: center;
  margin-top: 24rpx;
}
.job-actions {
  margin-top: 8rpx;
}
.job-card {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.job-card + .job-card {
  margin-top: 20rpx;
}
.job-card button {
  margin-top: 16rpx;
}
.job-head {
  gap: 16rpx;
  margin-bottom: 4rpx;
}
.job-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: var(--r-md);
  background: var(--c-primary-soft);
  color: var(--c-primary);
}
.template {
  word-break: normal;
  overflow-wrap: anywhere;
  font-size: 22rpx;
  margin-bottom: 16rpx;
}
.note {
  margin-top: 16rpx;
}
.job {
  padding: 28rpx 32rpx;
}
.job + .job {
  border-top: 1rpx solid var(--c-line);
}
.job-msg {
  margin-top: 8rpx;
}
.progress {
  height: 6rpx;
  margin-top: 16rpx;
  border-radius: 3rpx;
  background: var(--c-fill-strong);
  overflow: hidden;
}
.progress-bar {
  width: 40%;
  height: 100%;
  background: var(--c-primary);
  animation: indeterminate 1.2s ease-in-out infinite;
}
@keyframes indeterminate {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}
.preview {
  margin-top: 16rpx;
  padding: 8rpx 20rpx;
  border-radius: var(--r-sm);
  background: var(--c-fill);
  font-size: 24rpx;
}
.preview-row {
  display: grid;
  grid-template-columns: 2fr 1.4fr 2fr;
  gap: 12rpx;
  padding: 8rpx 0;
  color: var(--c-ink-2);
}
.job-buttons {
  margin-top: 16rpx;
}
.job-buttons:empty {
  display: none;
}
</style>
