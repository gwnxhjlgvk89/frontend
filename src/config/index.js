import { commonConfig } from "@/config/common.js";
import { devConfig } from "@/config/dev.js";
import { prodConfig } from "@/config/prod.js";

const isDev = globalThis.__DEV__ ?? false;
// 特殊处理：如果是 build 环境，改成 production
const currentEnv = isDev ? "development" : "production";

// 选择对应的环境配置
const envConfig = currentEnv === "production" ? prodConfig : devConfig;

// 合并配置
export const config = {
  ...commonConfig,
  ...envConfig,
};

// 便利方法

console.log(`🚀 当前环境: ${config.env}`);
console.log(`📍 API 地址: ${config.baseURL}`);
