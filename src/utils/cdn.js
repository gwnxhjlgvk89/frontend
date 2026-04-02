import { config } from "@/config/index.js";
// ── CDN 基础配置 ──────────────────────────────
const CDN_BASE_URL = config.cdnURL;
console.log(`📦 CDN 地址: ${CDN_BASE_URL} ${config.cdnURL}`);
/**
 * 拼接 CDN 完整 URL
 * @param {string} path - 相对路径，如 "clubs/covers/1.png"
 * @returns {string} 完整 CDN URL
 */
export const cdnUrl = (path) => {
  if (!path) return "";
  // 如果已经是完整 URL，直接返回
  if (path.startsWith("http")) return path;
  // 去掉开头多余的斜杠
  const cleanPath = path.replace(/^\/+/, "");
  return `${CDN_BASE_URL}/${cleanPath}`;
};

/**
 * 各类资源的快捷访问函数
 */
const cdn = {
  // 社团封面：clubs/covers/{id}.png
  logo: cdnUrl(`icons/logo.png`),
  defaultavatar: cdnUrl(`icons/defaultavatar.png`),
  eye: cdnUrl(`icons/eye.svg`),
  eyeoff: cdnUrl(`icons/eyeoff.svg`),
  wechat: cdnUrl(`icons/wechat.png`),
  google: cdnUrl(`icons/google.png`),
  home: cdnUrl(`icons/home.png`),
  profile: cdnUrl(`icons/profile.png`),
};

export default cdn;
