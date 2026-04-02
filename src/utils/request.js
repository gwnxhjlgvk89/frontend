import { showToast, hideToast } from "@/utils/toast";
import { config } from "@/config/index.js";

const BASE_URL = config.baseURL;

const getToken = () => uni.getStorageSync("token");
const clearToken = () => uni.removeStorageSync("token");

export function request(options) {
  return new Promise((resolve, reject) => {
    const token = getToken();

    uni.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header,
      },

      success: (res) => {
        const { statusCode } = res;

        // ── 4xx ───────────────────────────────────────────

        if (statusCode === 400) {
          const msg = res.data?.message || res.data?.detail || "请求参数错误";
          showToast({ title: msg, icon: "error" });
          return reject(new Error(msg));
        }

        if (statusCode === 401) {
          clearToken();
          const msg = res.data?.detail || "账号或密码错误";
          showToast({ title: msg, icon: "error" });
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/login/login" });
          }, 800);
          return reject(new Error(msg));
        }

        if (statusCode === 403) {
          const msg = res.data?.detail || "权限不足";
          showToast({ title: msg, icon: "error", duration: 2000 });
          return reject(new Error("权限不足"));
        }

        if (statusCode === 404) {
          const msg = res.data?.detail || "资源不存在";
          showToast({ title: msg, icon: "error" });
          return reject(new Error("资源不存在"));
        }

        if (statusCode === 405) {
          console.error(
            `[request] 405 Method Not Allowed: ${options.method} ${options.url}`,
          );
          showToast({ title: "请求方式错误", icon: "error" });
          return reject(new Error("请求方式错误"));
        }

        if (statusCode === 409) {
          const msg =
            res.data?.message || res.data?.detail || "数据冲突，请勿重复提交";
          showToast({ title: msg, icon: "error" });
          return reject(new Error(msg));
        }

        if (statusCode === 422) {
          const detail = res.data?.detail;
          const msg = Array.isArray(detail)
            ? detail.map((e) => e.msg).join("；")
            : detail || "参数校验失败";
          showToast({ title: msg, icon: "error" });
          return reject(new Error(msg));
        }

        if (statusCode === 429) {
          showToast({ title: "操作太频繁，请稍后再试", icon: "error" });
          return reject(new Error("请求过于频繁"));
        }

        // ── 5xx ───────────────────────────────────────────

        if (statusCode >= 500) {
          console.error(`[request] 服务器错误 ${statusCode}:`, res.data);
          showToast({ title: "服务器异常，请稍后再试", icon: "error" });
          return reject(new Error(`服务器错误 ${statusCode}`));
        }

        // ── 2xx ───────────────────────────────────────────

        if (statusCode === 204) {
          return resolve(null);
        }

        if (statusCode === 200 || statusCode === 201) {
          const { code, data, message } = res.data || {};

          if (code === 200) {
            return resolve(data);
          } else {
            showToast({ title: message || "请求失败", icon: "error" });
            return reject(new Error(message || "请求失败"));
          }
        }

        // ── 其他未覆盖状态码 ──────────────────────────────
        console.warn(`[request] 未处理的状态码 ${statusCode}`, res);
        return reject(new Error(`未知响应状态码: ${statusCode}`));
      },

      fail: (err) => {
        showToast({
          title: "网络连接失败，请检查网络",
          icon: "error",
        });
        console.error("[request] 网络错误:", err);
        reject(err);
      },
    });
  });
}

// 快捷方法
export const get = (url, data) => request({ url, method: "GET", data });
export const post = (url, data) => request({ url, method: "POST", data });
export const patch = (url, data) => request({ url, method: "PATCH", data });
export const put = (url, data) => request({ url, method: "PUT", data });
export const del = (url) => request({ url, method: "DELETE" });

// 导出 BASE_URL 供外部使用（如 WebSocket 连接）
export { BASE_URL };
