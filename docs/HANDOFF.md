# 新版前端交接

## 范围

本次以功能完整、布局合理、状态清楚为主；按用户最新要求不继续深度美化，后续由 Claude 优化。
新版页面在 `src/pages/v2`，请求与会话在 `src/v2`。保留 uni-app + Vue3 + Pinia，新增部分 TypeScript。
旧版源码可从 Git 基线 `de08256` 找回，本地旧构建另存 `.local/baseline/mp-weixin`。

## 开发

Node 22.23.3，pnpm 11.20.0。安装 `pnpm install --frozen-lockfile`。
`pnpm typecheck` 类型检查；`pnpm build:mp-weixin` 正式包；`pnpm dev:mp-weixin` 本地开发。
开发 API 默认 `http://127.0.0.1:8001`；手机测试须在 `.env.development.local` 配置可达的独立测试服务，不连接生产数据。
正式包必须显式设置 `VITE_API_ORIGIN` 为目标 HTTPS 服务，输出到 `dist/release/mp-weixin`，与开发产物隔离；**后端尚未发布新版前不得上传发布此正式包**。

## 接口配套

后端 `develop` 的 `/api/v1`，基础事务提交 `39ccba8`，权限与异步任务配套 `9f52ac0`。
首次改密、分页管理、短期 WS 票据、报名幂等、超时结果查询、一次全局实时连接、隐藏时清理计时器。
前端只保存登录令牌和可选账号，不保存密码或全量学生资料。

## 验证记录

- TypeScript 检查通过，微信开发包编译通过。
- 微信开发者工具使用合成账号实际登录、列表、详情、报名成功，名额40→39。
- `visual/` 为开发者工具截图，只代表模拟器结果，不是 iOS/Android 真机验收。
- 旧字体约127MB已删除；最终包大小以构建检查报告为准。
- 仍须完成真机学生/管理流程、实际点击反馈/滚动/连接生命周期和隐私指引配置核对。

正式构建验证：占位 HTTPS 测试地址，44 文件，123384 bytes（约 120.5 KiB），未上传；开发和正式输出已隔离。
