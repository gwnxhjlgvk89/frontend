<template>
  <view class="card"
    ><view class="section-title">报名活动设置</view
    ><view class="muted"
      >时间按北京时间填写。保存后进入草稿状态，核对后再发布。</view
    ><view class="divider" /><view class="field"
      ><text class="label">活动名称</text
      ><input class="input" v-model="name" /></view
    ><view class="field" v-for="field in fields" :key="field.key"
      ><text class="label">{{ field.label }}</text
      ><input
        class="input"
        v-model="times[field.key]"
        placeholder="2026-10-01 19:30" /></view
    ><view class="row between field"
      ><text>允许普通报名学生退选</text
      ><switch
        :checked="allowCancel"
        @change="changeCancel"
        color="#087f83" /></view
    ><view v-if="allowCancel" class="field"
      ><text class="label">退选截止时间</text
      ><input
        class="input"
        v-model="cancelUntil"
        placeholder="2026-10-01 20:30" /></view
    ><view v-if="error" class="error">{{ error }}</view
    ><button class="primary" :loading="busy" :disabled="busy" @tap="save">
      保存为草稿</button
    ><view class="tabs"
      ><button class="secondary small" @tap="state('published')">
        发布 / 恢复报名</button
      ><button class="danger small" @tap="state('paused')">
        暂停报名
      </button></view
    ></view
  >
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { request } from "./api";
import type { Activity } from "./types";
function changeCancel(e: any) {
  allowCancel.value = e.detail.value;
}
const props = defineProps<{ activity: Activity }>(),
  emit = defineEmits(["saved"]);
function local(v: string | null) {
  if (!v) return "";
  return new Date(Date.parse(v) + 8 * 3600000)
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");
}
const name = ref(props.activity.name),
  times = reactive<Record<string, string>>({
    starts_at: local(props.activity.starts_at),
    ends_at: local(props.activity.ends_at),
  }),
  allowCancel = ref(props.activity.allow_cancel),
  cancelUntil = ref(local(props.activity.cancel_until)),
  busy = ref(false),
  error = ref(""),
  fields = [
    { key: "starts_at", label: "报名开始时间" },
    { key: "ends_at", label: "报名结束时间" },
  ];
function iso(v: string) {
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v))
    throw new Error("时间格式应为 YYYY-MM-DD HH:mm");
  return new Date(v.replace(" ", "T") + ":00+08:00").toISOString();
}
async function save() {
  busy.value = true;
  error.value = "";
  try {
    await request("/admin/activity", "PUT", {
      name: name.value,
      starts_at: iso(times.starts_at),
      ends_at: iso(times.ends_at),
      allow_cancel: allowCancel.value,
      cancel_until: allowCancel.value ? iso(cancelUntil.value) : null,
    });
    emit("saved");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
function state(value: string) {
  uni.showModal({
    title: value === "published" ? "确认开放活动？" : "确认暂停报名？",
    content:
      value === "published"
        ? "将按已配置的时间开放，请确认名单与名额已核对。"
        : "暂停后学生无法提交新的报名，已有结果保留。",
    success: async (r) => {
      if (r.confirm) {
        try {
          await request("/admin/activity/state", "POST", { state: value });
          emit("saved");
        } catch (e) {
          error.value = (e as Error).message;
        }
      }
    },
  });
}
</script>
