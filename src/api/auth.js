// api/auth.js
import { get, post, patch, put, del } from "@/utils/request.js";
import { useClubStore } from "@/stores/club.js";
import { useProfileStore } from "@/stores/profile.js";
import { useFavStore } from "@/stores/fav.js";
import { useWsStore } from "@/stores/wsStore.js";

const TOKEN = "token";
const PERSONAL_INFO = "personal_info";
const IDENTITY = "identity";

function saveToken(token) {
  uni.setStorageSync(TOKEN, token);
}
function savePersonalInfo(info) {
  uni.setStorageSync(PERSONAL_INFO, info || {});
}
function saveIdentity(identity) {
  uni.setStorageSync(IDENTITY, identity);
}
function getToken() {
  return uni.getStorageSync(TOKEN) || null;
}
function clearToken() {
  uni.removeStorageSync(TOKEN);
}

export const authApi = {
  async login(form) {
    if (form.remember) {
      uni.setStorageSync("username", form.username);
      uni.setStorageSync("password", form.password);
    } else {
      uni.removeStorageSync("username");
      uni.removeStorageSync("password");
    }
    try {
      // 可能抛出异常，交给调用方处理，不在这里 catch
      const data = await post("/auth/login", {
        username: form.username,
        password: form.password,
      });

      // 持久化 token 和个人信息
      saveToken(data.token);
      saveIdentity(data.identity);
      savePersonalInfo(data.identity === "student" ? data.student : data.admin);

      // clubs 交给 Pinia 管理（store 内部会同步 Storage）
      const clubStore = useClubStore();
      clubStore.setClubs(data.clubs);
      return data;
    } catch (err) {
      // 登录失败，清除可能残留的 token 和个人信息
      throw err; // 继续抛出异常，让调用方处理
    }
  },

  async resetPassword(form) {
    // 同上，异常交给调用方
    await patch("/auth/student/password", {
      old_password: form.old_password,
      new_password: form.new_password,
    });
  },

  async logout() {
    // 1️⃣ 清空本地存储
    uni.clearStorageSync();

    useWsStore().disconnect(); // 3️⃣ 断开 WebSocket

    // 4️⃣ 跳转登录页（reLaunch 清空页面栈，防止用户返回）
    uni.reLaunch({ url: "/pages/login/login" });
  },
};
