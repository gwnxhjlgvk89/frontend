<template>
  <Sheet :show="open" :title="title" scroll :locked="busy" @close="close">
    <view v-for="group in groups" :key="group.title" class="group">
      <view class="group-title">{{ group.title }}</view>
      <view v-for="field in group.fields" :key="field.key" class="field">
        <text class="field-label"
          >{{ field.label
          }}<text v-if="field.required" class="required"> *</text></text
        >
        <view v-if="field.key === 'description'" class="input-box area"
          ><textarea
            v-model="form[field.key]"
            maxlength="10000"
            placeholder="介绍社团的活动内容和特色"
            placeholder-class="placeholder"
        /></view>
        <SuggestInput
          v-else-if="field.key === 'major' || field.key === 'class_name'"
          v-model="form[field.key]"
          :options="field.key === 'major' ? options.majors : options.classes"
          :placeholder="field.hint || ''"
        />
        <view v-else-if="field.key === 'allowed_majors'">
          <view class="majors">
            <view
              v-for="m in majorChoices"
              :key="m"
              :class="['chip', allowed.includes(m) && 'on']"
              @tap="toggleMajor(m)"
              >{{ m }}</view
            >
          </view>
          <view class="row add-major">
            <view class="input-box grow"
              ><input
                v-model="newMajor"
                placeholder="添加其他专业"
                placeholder-class="placeholder"
                maxlength="64"
                @confirm="addMajor"
            /></view>
            <button class="btn-sm" :disabled="!newMajor.trim()" @tap="addMajor">
              添加
            </button>
          </view>
          <text class="field-hint">{{
            allowed.length ? `已选 ${allowed.length} 个专业` : "未选择，表示不限专业"
          }}</text>
        </view>
        <view v-else class="input-box"
          ><input
            v-model="form[field.key]"
            :type="field.key === 'capacity' ? 'number' : 'text'"
            :placeholder="field.hint || ''"
            placeholder-class="placeholder"
        /></view>
      </view>
    </view>
    <view class="group">
      <view class="group-title">状态</view>
      <view v-if="kind === 'student'" class="field">
        <text class="field-label">预报名社团</text>
        <picker
          :range="['不设置预报名', ...clubs.map((c) => c.name)]"
          :value="reservedIndex"
          @change="reservedIndex = Number($event.detail.value)"
          ><view class="input-box picker"
            ><text class="grow">{{
              reservedIndex ? clubs[reservedIndex - 1]?.name : "不设置预报名"
            }}</text
            ><UiIcon name="chevron-right" :size="32" color="var(--c-ink-4)"
          /></view>
        </picker>
      </view>
      <view v-if="needsExempt" class="field">
        <view v-if="isSuper" class="row between toggle">
          <view class="grow"
            ><view>特批：不受该社团专业限制</view
            ><view class="caption"
              >该社团限 {{ restriction }}，开启后只对这名学生放行，并记入操作记录</view
            ></view
          >
          <switch :checked="exempt" color="#2a5ee8" @change="changeExempt" />
        </view>
        <StatusBanner v-else tone="warn"
          >该社团限 {{ restriction }} 专业，这名学生需超级管理员特批后才能预报名</StatusBanner
        >
      </view>
      <view class="row between field toggle">
        <view class="grow"
          ><view>{{ kind === "club" ? "在学生端展示" : "账号启用" }}</view
          ><view class="caption">{{
            kind === "club" ? "隐藏后学生看不到这个社团" : "停用后该学生无法登录"
          }}</view></view
        >
        <switch :checked="active" color="#2a5ee8" @change="changeActive" />
      </view>
    </view>
    <view v-if="error" class="gap"
      ><StatusBanner tone="danger">{{ error }}</StatusBanner></view
    >
    <template #footer>
      <view class="sheet-actions">
      <button class="btn-lg" :disabled="busy" @tap="close">取消</button>
      <button
        class="btn-primary btn-lg"
        :loading="busy"
        :disabled="busy"
        @tap="save"
      >
        保存
      </button>
      </view>
    </template>
  </Sheet>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { request } from "./api";
import { normalizeLabel } from "./format";
import { useSession } from "./session";
import type { AdminOptions, Club } from "./types";
import Sheet from "./Sheet.vue";
import SuggestInput from "./SuggestInput.vue";
import StatusBanner from "./StatusBanner.vue";
import UiIcon from "./UiIcon.vue";
function changeActive(e: any) {
  active.value = e.detail.value;
}
function changeExempt(e: any) {
  exempt.value = e.detail.value;
}
const props = defineProps<{
    kind: "club" | "student";
    item: any;
    clubs: Club[];
  }>(),
  emit = defineEmits(["close", "saved"]);
const form = reactive<Record<string, any>>({ ...props.item }),
  active = ref(props.item?.active ?? true),
  open = ref(false),
  busy = ref(false),
  error = ref("");
const s = useSession(),
  isSuper = computed(() => s.user?.role === "super_admin"),
  options = ref<AdminOptions>({ majors: [], classes: [] }),
  allowed = ref<string[]>([...(props.item?.allowed_majors || [])]),
  newMajor = ref(""),
  exempt = ref(!!props.item?.major_exempt);
form.capacity = String(props.item?.capacity ?? 30);
form.password = "";
const reservedIndex = ref(
  props.item?.source === "reserved"
    ? props.clubs.findIndex((c) => c.id === props.item.club_id) + 1
    : 0,
);
onMounted(() => {
  open.value = true;
  request<AdminOptions>("/admin/options")
    .then((data) => (options.value = data))
    .catch(() => {});
});
// Selected restrictions first, then every major already in use.
const majorChoices = computed(() => [
  ...allowed.value,
  ...options.value.majors.map((o) => o.name).filter((m) => !allowed.value.includes(m)),
]);
const reservedClub = computed(() =>
  reservedIndex.value ? props.clubs[reservedIndex.value - 1] : null,
);
const restriction = computed(() => reservedClub.value?.allowed_majors.join("、") || "");
const needsExempt = computed(
  () =>
    props.kind === "student" &&
    !!reservedClub.value?.allowed_majors.length &&
    !reservedClub.value.allowed_majors.includes(normalizeLabel(form.major)),
);
function toggleMajor(m: string) {
  const i = allowed.value.indexOf(m);
  if (i >= 0) allowed.value.splice(i, 1);
  else allowed.value.push(m);
}
// A value nobody has yet is often a typo; ask before saving it.
function confirmNew(kind: "专业" | "班级", value: string, known: string[]) {
  if (!value || !known.length || known.includes(value)) return Promise.resolve(true);
  return new Promise<boolean>((resolve) =>
    uni.showModal({
      title: `新${kind}`,
      content: `「${value}」不在现有${kind}名单中，可能是输入有误。确定作为新${kind}保存吗？`,
      confirmText: "确定保存",
      cancelText: "返回修改",
      success: (r) => resolve(!!r.confirm),
      fail: () => resolve(false),
    }),
  );
}
async function addMajor() {
  const m = normalizeLabel(newMajor.value);
  if (!m) return;
  if (!allowed.value.includes(m)) {
    if (!(await confirmNew("专业", m, options.value.majors.map((o) => o.name)))) return;
    allowed.value.push(m);
  }
  newMajor.value = "";
}
const title = computed(
  () =>
    (props.item?.id ? "编辑" : "新增") +
    (props.kind === "club" ? "社团" : "学生"),
);
type Field = { key: string; label: string; hint?: string; required?: boolean };
const groups = computed<{ title: string; fields: Field[] }[]>(() =>
  props.kind === "club"
    ? [
        {
          title: "基本信息",
          fields: [
            { key: "name", label: "社团名称", hint: "如：摄影社", required: true },
            { key: "category", label: "分类", hint: "如：文艺、体育、学术" },
            { key: "capacity", label: "总名额", hint: "如：40", required: true },
          ],
        },
        {
          title: "活动安排",
          fields: [
            { key: "schedule", label: "活动时间", hint: "如：每周三 16:00–18:00" },
            { key: "location", label: "活动地点", hint: "如：学生活动中心" },
            { key: "description", label: "社团介绍" },
          ],
        },
        {
          title: "报名限制与展示",
          fields: [
            { key: "allowed_majors", label: "允许专业" },
            { key: "cover", label: "封面图片地址", hint: "HTTPS 图片地址，可留空" },
          ],
        },
      ]
    : [
        {
          title: "学生信息",
          fields: [
            { key: "username", label: "学号", hint: "登录账号", required: true },
            { key: "name", label: "姓名", hint: "与名单一致", required: true },
            { key: "major", label: "专业", hint: "用于专业限制的核对" },
            { key: "class_name", label: "班级", hint: "如：计科一班" },
          ],
        },
        {
          title: "密码",
          fields: [
            {
              key: "password",
              label: props.item?.id ? "重置密码" : "初始密码",
              // Plain text on purpose: password-type inputs block Chinese input.
              hint: props.item?.id
                ? "留空则不修改（明文显示，可输入中文）"
                : "留空则使用姓名（明文显示，可输入中文）",
            },
          ],
        },
      ],
);
function close() {
  if (busy.value) return;
  open.value = false;
  setTimeout(() => emit("close"), 240);
}
async function save() {
  error.value = "";
  if (props.kind === "student") {
    form.major = normalizeLabel(form.major);
    form.class_name = normalizeLabel(form.class_name);
    if (needsExempt.value && !(isSuper.value && exempt.value)) {
      error.value = isSuper.value
        ? "该学生专业不符合社团限制，请开启特批或更换预报名社团"
        : "该学生专业不符合社团限制，需超级管理员特批";
      return;
    }
    const majors = options.value.majors.map((o) => o.name),
      classes = options.value.classes.map((o) => o.name);
    if (!(await confirmNew("专业", form.major, majors))) return;
    if (!(await confirmNew("班级", form.class_name, classes))) return;
  }
  busy.value = true;
  try {
    let body: any;
    if (props.kind === "club") {
      body = {
        name: form.name || "",
        category: form.category || "",
        capacity: Number(form.capacity),
        schedule: form.schedule || "",
        location: form.location || "",
        description: form.description || "",
        cover: form.cover || "",
        allowed_majors: allowed.value,
        active: active.value,
      };
    } else {
      body = {
        username: form.username || "",
        name: form.name || "",
        major: form.major || "",
        class_name: form.class_name || "",
        active: active.value,
        password: form.password || null,
        reserved_club_id: reservedIndex.value
          ? props.clubs[reservedIndex.value - 1].id
          : null,
      };
      if (props.item?.source === "normal")
        body.reserved_club_id = props.item.club_id;
      // Only a super admin changes the exemption; omitting it keeps the current state.
      else if (isSuper.value && body.reserved_club_id)
        body.major_exempt = needsExempt.value && exempt.value;
    }
    await request(
      `/admin/${props.kind === "club" ? "clubs" : "students"}${props.item?.id ? "/" + props.item.id : ""}`,
      props.item?.id ? "PUT" : "POST",
      body,
    );
    uni.showToast({ title: "已保存" });
    emit("saved");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
</script>
<style scoped>
.group + .group {
  margin-top: 48rpx;
}
.group-title {
  margin-bottom: 20rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--c-ink);
}
.required {
  color: var(--c-danger);
}
.picker {
  font-size: 30rpx;
  color: var(--c-ink);
}
.toggle {
  padding: 4rpx 0;
}
.gap {
  margin-top: 24rpx;
}
.majors {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.add-major {
  gap: 16rpx;
  margin-top: 20rpx;
}
</style>
