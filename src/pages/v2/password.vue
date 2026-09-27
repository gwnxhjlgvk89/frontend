<template>
  <view class="screen"
    ><text class="eyebrow">账户安全</text
    ><view class="title">设置你的新密码</view
    ><view class="subtitle">请使用至少10位密码，不要与其他网站重复。</view
    ><view class="card form"
      ><view class="field"
        ><text class="label">原密码</text
        ><input class="input" password v-model="oldPassword" /></view
      ><view class="field"
        ><text class="label">新密码</text
        ><input class="input" password v-model="newPassword" /></view
      ><view class="field"
        ><text class="label">确认新密码</text
        ><input class="input" password v-model="confirm" /></view
      ><view v-if="error" class="error">{{ error }}</view
      ><button class="primary" :disabled="busy" :loading="busy" @tap="save">
        保存并继续
      </button></view
    ></view
  >
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useSession } from "@/v2/session";
import { request, setToken } from "@/v2/api";
import type { User } from "@/v2/types";
const s = useSession(),
  oldPassword = ref(""),
  newPassword = ref(""),
  confirm = ref(""),
  error = ref(""),
  busy = ref(false);
async function save() {
  error.value = "";
  if (newPassword.value.length < 10 || newPassword.value !== confirm.value) {
    error.value = "请填写至少10位新密码，并确保两次输入一致";
    return;
  }
  busy.value = true;
  try {
    const data = await request<{ token: string; user: User }>(
      "/auth/password",
      "POST",
      { old_password: oldPassword.value, new_password: newPassword.value },
    );
    s.suspend();
    setToken(data.token);
    s.user = data.user;
    uni.reLaunch({ url: s.isAdmin ? "/pages/v2/admin" : "/pages/v2/home" });
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
</script>
<style scoped>
.form {
  margin-top: 36rpx;
}
</style>
