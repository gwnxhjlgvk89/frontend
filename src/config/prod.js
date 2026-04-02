// 生产环境配置
export const prodConfig = {
  // ── 后端服务器地址 ──────────────────────────
  // 使用你的域名，前端和后端都通过这个域名访问
  baseURL: "https://wjy-1214.cloud",
  // 生产环境 WebSocket 地址，使用 wss 协议
  wsURL: "wss://wjy-1214.cloud/ws",

  // ── 环境标识 ────────────────────────────
  env: "production",

  // ── 调试开关 ────────────────────────────
  debug: false,
  logRequests: false,
  logResponses: false,

  // ── 小程序配置 ──────────────────────────
  wxAppId: "wxeaf7dc6dbf9cef6b", // 真实 AppID
};
