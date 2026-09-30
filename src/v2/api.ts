const origin = import.meta.env.VITE_API_ORIGIN || "http://127.0.0.1:8001";
export const API = `${origin}/api/v1`;
export const WS = `${origin.replace(/^http/, "ws")}/api/v1/ws`;
let invalidating = false;
const pending = new Map<string, Promise<unknown>>();
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId = "",
    public retryAfterMs = 0,
  ) {
    super(message);
  }
}
export function getToken(): string {
  return uni.getStorageSync("v2_token") || "";
}
export function setToken(token: string) {
  uni.setStorageSync("v2_token", token);
  invalidating = false;
}
export function clearSession() {
  uni.removeStorageSync("v2_token");
  uni.removeStorageSync("password");
  uni.removeStorageSync("token");
  uni.removeStorageSync("profile");
  uni.$emit("v2-session-clear");
}
export function notifyError(e: unknown) {
  uni.showToast({
    title: e instanceof Error ? e.message : "操作失败，请重试",
    icon: "none",
    duration: 2500,
  });
}
export function request<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: unknown,
  headers: Record<string, string> = {},
): Promise<T> {
  const requestToken = getToken();
  const key = `${requestToken}:${path}`;
  if (method === "GET" && pending.has(key))
    return pending.get(key) as Promise<T>;
  const attempt = () =>
    new Promise<T>((resolve, reject) => {
      uni.request({
        url: API + path,
        method,
        data: data as any,
        timeout: 10000,
        header: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${requestToken}`,
          ...headers,
        },
        success(res) {
          const body = res.data as any;
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body.data as T);
            return;
          }
          const e = new ApiError(
            res.statusCode,
            body?.error?.code || "REQUEST_FAILED",
            body?.error?.message || "请求失败",
            body?.error?.request_id,
            body?.error?.retry_after_ms || 0,
          );
          if (
            res.statusCode === 401 &&
            requestToken === getToken() &&
            path !== "/auth/login" &&
            !invalidating
          ) {
            invalidating = true;
            clearSession();
            uni.reLaunch({ url: "/pages/v2/login" });
          }
          reject(e);
        },
        fail() {
          reject(
            new ApiError(0, "NETWORK_ERROR", "网络连接中断，请确认操作结果"),
          );
        },
      });
    });
  const task = attempt().catch(async (error: unknown) => {
    // Reads can safely recover from one transient connection failure. Keep the
    // shared pending promise during backoff so page/event callers do not fan out.
    // Writes (including login and enrollment) must not be replayed here.
    if (
      method !== "GET" ||
      !(error instanceof ApiError) ||
      error.status !== 0 ||
      requestToken !== getToken()
    )
      throw error;
    await new Promise<void>((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 500),
    );
    if (requestToken !== getToken()) throw error;
    return attempt();
  });
  if (method === "GET") {
    pending.set(key, task);
    task.finally(() => pending.delete(key)).catch(() => {});
  }
  return task;
}
export function requestKey() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}
export function upload<T>(path: string, filePath: string): Promise<T> {
  return new Promise((resolve, reject) =>
    uni.uploadFile({
      url: API + path,
      filePath,
      name: "file",
      header: { Authorization: `Bearer ${getToken()}` },
      success(res) {
        try {
          const data = JSON.parse(res.data);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(data.data);
          else reject(new Error(data.error?.message || "上传失败"));
        } catch {
          reject(new Error("服务器响应异常"));
        }
      },
      fail() {
        reject(new Error("上传失败，请检查网络"));
      },
    }),
  );
}
