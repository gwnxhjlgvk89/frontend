// 开发环境配置
export const devConfig = {
  // ── 后端服务器地址 ──────────────────────────

  // 方式一：本地后端（开发时最常用）
  baseURL: "http://localhost:8000",
  wsURL: "ws://localhost:8000/ws",

  // 方式二：远程服务器（可选，用于测试部署效果）
  // baseURL: 'http://106.14.169.230:8000',

  // ── 环境标识 ────────────────────────────
  env: "development",

  // ── 调试开关 ────────────────────────────
  debug: true,
  logRequests: true, // 打印所有请求
  logResponses: true, // 打印所有响应

  // ── 小程序配置 ──────────────────────────
  wxAppId: "test-app-id", // 测试 AppID（如果有）
};
