---
version: 1
slug: "src-pages-v2-home-vue"
primary_target: "src/pages/v2/home.vue"
related_targets: ["src/pages/v2/login.vue","src/pages/v2/detail.vue","src/pages/v2/profile.vue","src/pages/v2/password.vue","src/pages/v2/admin.vue"]
---

# 社团填报助手 · 小程序全部页面

Scope: frontend/src/pages/v2/* 学生端（登录、发现、详情、我的、改密）与管理端工作台。Mode: Operate。
Audience/job: 大学新生在开放时刻抢报1个社团；管理员配置、核对、导出。
Constraints: 高峰期轻量；session/api 行为不变；无图时同样成立；WCAG AA。
Memorable moment: 开放倒计时 → 报名确认底板 → 报名凭证。

## Direction contract

THESIS: 行业标准小程序，做到飞书的层级、大麦的抢报状态、小红书的年轻卡片感。拒绝两种做法：一是白底青绿按钮加文字链接的“表单工具感”；二是黑底霓虹的“秒杀抢购感”。

OWN-WORLD: 浅灰底 #F5F6F8 配白色圆角卡片，一个明亮品牌蓝负责所有主操作；橙红只用于余量紧张和倒计时；分类使用柔和色标。系统字体，数字等宽。线性图标，间距 8rpx 网格。

STORY: 学生一眼知道现在能不能报、还剩多少，报名前确认后果，报名后拿到一张确定的凭证。管理员永远知道当前是草稿、已发布还是报名中，危险操作都有确认。

FIRST VIEWPORT: 首页顶部是一张品牌蓝活动状态卡：开放前显示大号分段倒计时 时:分:秒，开放中显示“报名进行中”和截止时间，已报名则显示结果。其下是吸顶的搜索框和横滑分类 Tab，筛选标签一行。之后是社团卡列表，左侧为封面或分类色首字块，右侧为名称、时间、地点、余量条和“仅剩 N”徽标。主操作在详情页固定底栏。

FORM: canon（行业标准），出自 concept-seed 2ea6735c 的标准出口；对标飞书/腾讯文档、大麦/猫眼、小红书/即刻。

SIGNATURE: 名额实时变化时，余量数字短暂高亮并让进度条平滑过渡；报名成功后，确认底板收起，换成一张带打勾动效的报名凭证卡。断线时显示“名额可能不是最新”。

MOTION: 150–250ms 缓出，只动 transform 和 opacity；遵守减少动态效果的偏好；没有装饰性的循环动画。

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
