<template>
  <view>
    <view class="card">
      <view class="section-title">新增管理员</view>
      <input class="input" v-model="form.username" placeholder="管理员账号" />
      <input class="input field" v-model="form.name" placeholder="姓名" />
      <input
        class="input field"
        v-model="form.password"
        password
        placeholder="初始密码（至少10位）"
      />
      <picker
        :range="roles"
        @change="
          form.role =
            Number($event.detail.value) === 1 ? 'super_admin' : 'admin'
        "
        ><view class="input field"
          >{{
            form.role === "super_admin" ? "超级管理员" : "普通管理员"
          }}
          ▾</view
        ></picker
      >
      <button class="primary field" :disabled="busy" @tap="create">
        创建管理员
      </button>
      <text class="muted"
        >新账号首次登录需改密。普通管理员可管理名单与社团，活动发布、角色变更仅超级管理员可操作。</text
      >
    </view>
    <view class="card" v-for="a in accounts" :key="a.id">
      <view class="row between"
        ><text>{{ a.name }} · {{ a.username }}</text
        ><text class="tag">{{ a.active ? "已启用" : "已停用" }}</text></view
      >
      <view class="muted">{{
        a.role === "super_admin" ? "超级管理员" : "普通管理员"
      }}</view>
      <view class="tabs"
        ><button
          class="secondary small"
          :disabled="busy"
          @tap="
            change(a, {
              role: a.role === 'admin' ? 'super_admin' : 'admin',
              active: a.active,
            })
          "
        >
          调整角色</button
        ><button
          class="secondary small"
          :disabled="busy"
          @tap="change(a, { role: a.role, active: !a.active })"
        >
          {{ a.active ? "停用" : "启用" }}
        </button></view
      >
    </view>
  </view>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { notifyError, request } from "./api";
import type { User } from "./types";
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
    await request("/admin/administrators", "POST", form.value);
    form.value = { username: "", name: "", password: "", role: "admin" };
    await load();
  } catch (e) {
    notifyError(e);
  } finally {
    busy.value = false;
  }
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
.field {
  margin-top: 20rpx;
}
</style>
