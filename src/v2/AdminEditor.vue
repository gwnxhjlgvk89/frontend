<template>
  <view class="sheet-overlay" @tap.self="$emit('close')"
    ><view class="sheet"
      ><view class="row between"
        ><view class="section-title">{{
          kind === "club" ? "社团资料" : "学生资料"
        }}</view
        ><text class="link" @tap="$emit('close')">关闭</text></view
      ><scroll-view scroll-y class="sheet-scroll">
        <view class="field" v-for="field in fields" :key="field.key"
          ><text class="label">{{ field.label }}</text
          ><textarea
            v-if="field.key === 'description'"
            class="input"
            v-model="form[field.key]"
            maxlength="10000" /><input
            v-else
            class="input"
            v-model="form[field.key]"
            :password="field.key === 'password'"
            :placeholder="field.hint || ''"
        /></view>
        <view v-if="kind === 'student'" class="field"
          ><text class="label">预报名社团</text
          ><picker
            :range="['不设置预报名', ...clubs.map((c) => c.name)]"
            :value="reservedIndex"
            @change="reservedIndex = Number($event.detail.value)"
            ><view class="input">{{
              reservedIndex ? clubs[reservedIndex - 1]?.name : "不设置预报名"
            }}</view></picker
          ></view
        >
        <view class="row between field"
          ><text>{{ kind === "club" ? "开放展示" : "账号启用" }}</text
          ><switch :checked="active" @change="changeActive" color="#087f83"
        /></view> </scroll-view
      ><view v-if="error" class="error">{{ error }}</view
      ><button class="primary" :loading="busy" :disabled="busy" @tap="save">
        保存资料
      </button></view
    ></view
  >
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { request } from "./api";
import type { Club } from "./types";
function changeActive(e: any) {
  active.value = e.detail.value;
}
const props = defineProps<{
    kind: "club" | "student";
    item: any;
    clubs: Club[];
  }>(),
  emit = defineEmits(["close", "saved"]);
const form = reactive<Record<string, any>>({ ...props.item }),
  active = ref(props.item?.active ?? true),
  busy = ref(false),
  error = ref("");
form.allowed_majors = (props.item?.allowed_majors || []).join("、");
form.capacity = String(props.item?.capacity ?? 30);
form.password = "";
const reservedIndex = ref(
  props.item?.source === "reserved"
    ? props.clubs.findIndex((c) => c.id === props.item.club_id) + 1
    : 0,
);
const fields = computed(() =>
  props.kind === "club"
    ? [
        { key: "name", label: "社团名称" },
        { key: "category", label: "分类" },
        { key: "capacity", label: "总名额" },
        { key: "schedule", label: "活动时间" },
        { key: "location", label: "活动地点" },
        { key: "description", label: "社团介绍" },
        { key: "cover", label: "封面图片 HTTPS 地址" },
        {
          key: "allowed_majors",
          label: "允许专业",
          hint: "多个专业用顿号分隔，留空表示不限",
        },
      ]
    : [
        { key: "username", label: "学号" },
        { key: "name", label: "姓名" },
        { key: "major", label: "专业" },
        { key: "class_name", label: "班级" },
        {
          key: "password",
          label: props.item?.id
            ? "重置密码（留空不改）"
            : "初始密码（留空用姓名原文）",
        },
      ],
);
async function save() {
  error.value = "";
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
        allowed_majors: (form.allowed_majors || "")
          .split(/[、,，]/)
          .map((x: string) => x.trim())
          .filter(Boolean),
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
    }
    await request(
      `/admin/${props.kind === "club" ? "clubs" : "students"}${props.item?.id ? "/" + props.item.id : ""}`,
      props.item?.id ? "PUT" : "POST",
      body,
    );
    emit("saved");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
</script>
