// stores/useAuthStore.js
import { defineStore } from "pinia";
import { ref, readonly } from "vue";

// ── 视图枚举 ───────────────────────────────────────────────
export const LOGIN_VIEWS = Object.freeze({
  LOGIN: "login",
  RESET: "reset",
  FIRST_RESET: "first-reset",
});

export const loginCardStore = defineStore("login", () => {
  // ── State ────────────────────────────────────────────────

  /** 当前登录页视图 */
  const currentView = ref(LOGIN_VIEWS.LOGIN);

  /** 是否首次登录（由登录接口返回） */
  const isFirstLogin = ref(false);

  const identity = ref("student"); // 临时身份标识，实际应由登录接口返回

  const role = ref(1); // 管理员登记，默认普通

  // ── Actions ──────────────────────────────────────────────

  /** 视图跳转（带合法性校验） */
  function navigateTo(view) {
    currentView.value = view;
  }

  function setIdentity(newIdentity) {
    identity.value = newIdentity;
  }

  function setRole(newRole) {
    role.value = newRole;
  }

  // 语义化跳转
  const goLogin = () => navigateTo(LOGIN_VIEWS.LOGIN);
  const goReset = () => navigateTo(LOGIN_VIEWS.RESET);
  const goFirstReset = () => navigateTo(LOGIN_VIEWS.FIRST_RESET);

  /**
   * 登录成功后统一处理
   * @param {{ isFirstLogin: boolean }} payload
   */
  function onLoginSuccess(payload) {
    isFirstLogin.value = payload.isFirstLogin;

    if (payload.isFirstLogin) {
      goFirstReset(); // 强制走改密流程
    } else {
      uni.reLaunch({ url: "/pages/home/home" });
    }
  }

  /** 离开登录页时重置视图状态 */
  function resetView() {
    currentView.value = LOGIN_VIEWS.LOGIN;
    isFirstLogin.value = false;
    identity.value = "student";
    role.value = 1;
  }

  return {
    // State（外部只读）
    currentView: readonly(currentView),
    isFirstLogin: readonly(isFirstLogin),
    identity: readonly(identity),
    role: readonly(role),

    // Actions
    goLogin,
    goReset,
    goFirstReset,
    onLoginSuccess,
    setRole,
    setIdentity,
    resetView,
    LOGIN_VIEWS,
  };
});
