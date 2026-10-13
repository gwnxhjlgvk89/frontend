<template>
  <view>
    <view class="list">
      <view
        v-for="a in accounts"
        :key="a.id"
        class="list-row"
        hover-class="pressed"
        @tap="actions(a)"
      >
        <view :class="['mark', { off: !a.active }]">{{ initial(a.name, "管") }}</view>
        <view class="grow">
          <view class="row name-line"
            ><text class="name ellipsis">{{ a.name }}</text
            ><text :class="['tag', a.role === 'super_admin' ? 'primary' : '']">{{
              a.role === "super_admin" ? "超级管理员" : "管理员"
            }}</text></view
          >
          <view class="caption">{{ a.username }}{{ a.active ? "" : " · 已停用" }}</view>
        </view>
        <UiIcon name="chevron-right" :size="32" color="var(--c-ink-4)" />
      </view>
      <view v-if="!accounts.length" class="list-row caption">暂无管理员</view>
    </view>

    <view class="section-head"><text class="h3">新增管理员</text></view>
    <view class="card">
      <view class="field">
        <text class="field-label">账号<text class="required"> *</text></text>
        <view class="input-box"
          ><input
            v-model="form.username"
            placeholder="登录用的账号"
            placeholder-class="placeholder"
        /></view>
      </view>
      <view class="field">
        <text class="field-label">姓名<text class="required"> *</text></text>
        <view class="input-box"
          ><input v-model="form.name" placeholder="真实姓名" placeholder-class="placeholder"
        /></view>
      </view>
      <view class="field">
        <text class="field-label">初始密码</text>
        <view class="input-box"
          ><input
            v-model="form.password"
            placeholder="留空则使用姓名"
            placeholder-class="placeholder"
        /></view>
        <!-- Plain text on purpose: password-type inputs block Chinese input. -->
        <text class="field-hint">明文显示，可输入中文；对方首次登录需修改密码。</text>
      </view>
      <view class="field">
        <text class="field-label">角色</text>
        <picker
          :range="roles"
          :value="form.role === 'super_admin' ? 1 : 0"
          @change="
            form.role =
              Number($event.detail.value) === 1 ? 'super_admin' : 'admin'
          "
          ><view class="input-box picker"
            ><text class="grow">{{
              form.role === "super_admin" ? "超级管理员" : "普通管理员"
            }}</text
            ><UiIcon name="chevron-right" :size="32" color="var(--c-ink-4)"
          /></view>
        </picker>
      </view>
      <button
        class="btn-primary btn-block create"
        :disabled="busy || !form.username.trim() || !form.name.trim()"
        :loading="busy"
        @tap="create"
      >
        创建管理员
      </button>
      <view class="caption foot"
        >新账号首次登录需改密。普通管理员可以管理名单和社团；发布活动、调整角色只有超级管理员可以操作。</view
      >
    </view>
  </view>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { notifyError, request } from "./api";
import type { User } from "./types";
import UiIcon from "./UiIcon.vue";
import { initial } from "./format";
const accounts = ref<User[]>([]),
  busy = ref(false),
  roles = ["普通管理员", "超级管理员"];
const form = ref({ username: "", name: "", password: "", role: "admin" });
async function load() {
  try {
    accounts.value = await request<User[]>("/admin/administrators");
  } catch (e) {
    notifyError(e);
  }
}
async function create() {
  busy.value = true;
  try {
    await request("/admin/administrators", "POST", {
      ...form.value,
      password: form.value.password || null,
    });
    form.value = { username: "", name: "", password: "", role: "admin" };
    uni.showToast({ title: "已创建" });
    await load();
  } catch (e) {
    notifyError(e);
  } finally {
    busy.value = false;
  }
}
function actions(a: User) {
  const toRole = a.role === "admin" ? "super_admin" : "admin";
  uni.showActionSheet({
    itemList: [
      toRole === "super_admin" ? "设为超级管理员" : "设为普通管理员",
      a.active ? "停用账号" : "启用账号",
    ],
    success: (r) =>
      change(
        a,
        r.tapIndex === 0
          ? { role: toRole, active: a.active }
          : { role: a.role, active: !a.active },
      ),
  });
}
function change(a: User, body: { role: string; active: boolean }) {
  uni.showModal({
    title: "确认调整管理员权限？",
    content: `账号：${a.username}。变更后该账号需要重新登录。`,
    success: async (r) => {
      if (!r.confirm) return;
      busy.value = true;
      try {
        await request(`/admin/administrators/${a.id}`, "PUT", body);
        await load();
      } catch (e) {
        notifyError(e);
      } finally {
        busy.value = false;
      }
    },
  });
}
onMounted(load);
</script>
<style scoped>
.mark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 72rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-weight: 600;
}
.mark.off {
  background: var(--c-fill);
  color: var(--c-ink-3);
}
.name-line {
  gap: 12rpx;
}
.name {
  font-size: 30rpx;
  font-weight: 500;
}
.required {
  color: var(--c-danger);
}
.picker {
  font-size: 30rpx;
  color: var(--c-ink);
}
.create {
  margin-top: 36rpx;
}
.foot {
  margin-top: 16rpx;
}
</style>
