<template>
  <view>
    <view class="card state">
      <view class="row between">
        <text class="h3">报名状态</text>
        <text :class="['tag', stateInfo.tone]">{{ stateInfo.label }}</text>
      </view>
      <view class="caption desc">{{ stateInfo.text }}</view>
      <view class="row actions">
        <button
          v-if="activity.configured_state !== 'published'"
          class="btn-primary grow"
          @tap="state('published')"
        >
          {{ activity.configured_state === "paused" ? "恢复报名" : "发布报名" }}
        </button>
        <button
          v-if="activity.configured_state === 'published'"
          class="btn-danger grow"
          @tap="state('paused')"
        >
          暂停报名
        </button>
      </view>
    </view>

    <view class="section-head"
      ><text class="h3">活动配置</text
      ><text class="caption">北京时间</text></view
    >
    <view class="card">
      <view class="field">
        <text class="field-label">活动名称</text>
        <view class="input-box"><input v-model="name" maxlength="128" /></view>
      </view>
      <view v-for="field in fields" :key="field.key" class="field">
        <text class="field-label">{{ field.label }}</text>
        <view class="row pickers">
          <picker
            mode="date"
            class="grow"
            :value="part(times[field.key], 0)"
            @change="setPart(field.key, 0, $event.detail.value)"
            ><view class="input-box picker"
              ><UiIcon name="calendar" :size="32" color="var(--c-ink-3)" /><text
                :class="{ placeholder: !part(times[field.key], 0) }"
                >{{ part(times[field.key], 0) || "选择日期" }}</text
              ></view
            ></picker
          >
          <picker
            mode="time"
            class="time"
            :value="part(times[field.key], 1)"
            @change="setPart(field.key, 1, $event.detail.value)"
            ><view class="input-box picker"
              ><UiIcon name="clock" :size="32" color="var(--c-ink-3)" /><text
                :class="{ placeholder: !part(times[field.key], 1) }"
                >{{ part(times[field.key], 1) || "时间" }}</text
              ></view
            ></picker
          >
        </view>
      </view>
      <view class="row between field toggle">
        <view class="grow"
          ><view>允许学生自行退选</view
          ><view class="caption">仅对普通报名生效，预报名不能退选</view></view
        >
        <switch :checked="allowCancel" color="#2a5ee8" @change="changeCancel" />
      </view>
      <view v-if="allowCancel" class="field">
        <text class="field-label">退选截止时间</text>
        <view class="row pickers">
          <picker
            mode="date"
            class="grow"
            :value="part(times.cancel_until, 0)"
            @change="setPart('cancel_until', 0, $event.detail.value)"
            ><view class="input-box picker"
              ><UiIcon name="calendar" :size="32" color="var(--c-ink-3)" /><text
                :class="{ placeholder: !part(times.cancel_until, 0) }"
                >{{ part(times.cancel_until, 0) || "选择日期" }}</text
              ></view
            ></picker
          >
          <picker
            mode="time"
            class="time"
            :value="part(times.cancel_until, 1)"
            @change="setPart('cancel_until', 1, $event.detail.value)"
            ><view class="input-box picker"
              ><UiIcon name="clock" :size="32" color="var(--c-ink-3)" /><text
                :class="{ placeholder: !part(times.cancel_until, 1) }"
                >{{ part(times.cancel_until, 1) || "时间" }}</text
              ></view
            ></picker
          >
        </view>
      </view>
      <view v-if="error" class="gap"
        ><StatusBanner tone="danger">{{ error }}</StatusBanner></view
      >
      <button
        class="btn-primary btn-block save"
        :loading="busy"
        :disabled="busy"
        @tap="save"
      >
        保存为草稿
      </button>
      <view class="caption foot"
        >保存后活动回到草稿状态，核对无误后再发布。</view
      >
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { request } from "./api";
import type { Activity } from "./types";
import StatusBanner from "./StatusBanner.vue";
import UiIcon from "./UiIcon.vue";
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
    cancel_until: local(props.activity.cancel_until),
  }),
  allowCancel = ref(props.activity.allow_cancel),
  busy = ref(false),
  error = ref(""),
  fields = [
    { key: "starts_at", label: "报名开始时间" },
    { key: "ends_at", label: "报名结束时间" },
  ];
const stateInfo = computed(() => {
  const a = props.activity;
  if (a.configured_state === "paused")
    return {
      label: "已暂停",
      tone: "warn",
      text: "学生暂时无法提交新的报名，已有结果保留。",
    };
  if (a.configured_state === "published")
    return {
      label: a.state === "open" ? "报名中" : a.state === "upcoming" ? "已发布，待开放" : "已结束",
      tone: a.state === "open" ? "success" : "primary",
      text: "学生端按配置的时间自动开放和结束。报名期间修改配置需要先暂停。",
    };
  return {
    label: "草稿",
    tone: "",
    text: "学生能看到社团但不能报名。核对名单、名额和时间后再发布。",
  };
});
function part(v: string, index: 0 | 1) {
  return (v || "").split(" ")[index] || "";
}
function setPart(key: string, index: 0 | 1, value: string) {
  const parts = [part(times[key], 0), part(times[key], 1)];
  parts[index] = value;
  times[key] = parts.join(" ").trim();
}
function iso(v: string, label: string) {
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v))
    throw new Error(`请完整选择${label}的日期和时间`);
  return new Date(v.replace(" ", "T") + ":00+08:00").toISOString();
}
async function save() {
  busy.value = true;
  error.value = "";
  try {
    await request("/admin/activity", "PUT", {
      name: name.value,
      starts_at: iso(times.starts_at, "报名开始时间"),
      ends_at: iso(times.ends_at, "报名结束时间"),
      allow_cancel: allowCancel.value,
      cancel_until: allowCancel.value
        ? iso(times.cancel_until, "退选截止时间")
        : null,
    });
    uni.showToast({ title: "已保存为草稿" });
    emit("saved");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
function state(value: string) {
  uni.showModal({
    title: value === "published" ? "确认发布报名？" : "确认暂停报名？",
    content:
      value === "published"
        ? "将按已配置的时间开放，请确认名单与名额已核对。"
        : "暂停后学生无法提交新的报名，已有结果保留。",
    confirmText: value === "published" ? "发布" : "暂停",
    confirmColor: value === "published" ? "#2a5ee8" : "#c8281c",
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
<style scoped>
.state .desc {
  margin-top: 8rpx;
}
.actions {
  margin-top: 28rpx;
}
.pickers {
  gap: 16rpx;
}
.time {
  width: 220rpx;
}
.picker {
  gap: 12rpx;
  font-size: 30rpx;
  color: var(--c-ink);
}
.toggle {
  padding: 8rpx 0;
}
.gap {
  margin-top: 24rpx;
}
.save {
  margin-top: 36rpx;
}
.foot {
  margin-top: 16rpx;
  text-align: center;
}
</style>
