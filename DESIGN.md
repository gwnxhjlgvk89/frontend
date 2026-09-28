---
name: 社团填报助手
description: 新生社团集中选报微信小程序：行业标准的小程序样式，一眼看清能不能报、还剩多少、报上没有。
colors:
  primary: "#2a5ee8"
  primary-press: "#1f4fd1"
  primary-soft: "#edf2ff"
  on-primary-2: "#e3eaff"
  quota-fill: "#8faaf3"
  hot: "#c63d17"
  hot-soft: "#fff1ec"
  success: "#087a54"
  success-soft: "#e8f6ef"
  warn: "#9a5200"
  warn-soft: "#fff4e5"
  danger: "#c8281c"
  danger-soft: "#feefee"
  bg: "#f5f6f8"
  surface: "#ffffff"
  fill: "#f2f3f5"
  fill-strong: "#e8eaee"
  line: "#e5e6eb"
  ink: "#1d2129"
  ink-2: "#4e5969"
  ink-3: "#636a76"
  ink-4: "#86909c"
  scrim: "rgba(17, 22, 32, 0.48)"
  cat-violet: "#6b3fd6"
  cat-violet-soft: "#f3edff"
  cat-rose: "#b4236e"
  cat-rose-soft: "#fdedf5"
  cat-teal: "#0b7285"
  cat-teal-soft: "#e6f6f8"
  cat-indigo: "#3f4aa8"
  cat-indigo-soft: "#eef0fa"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif"
    fontSize: "64rpx"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-1rpx"
    fontFeature: "tnum"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif"
    fontSize: "44rpx"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.5rpx"
  headline-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif"
    fontSize: "36rpx"
    fontWeight: 600
    lineHeight: 1.35
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif"
    fontSize: "32rpx"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif"
    fontSize: "28rpx"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif"
    fontSize: "26rpx"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif"
    fontSize: "24rpx"
    fontWeight: 400
    lineHeight: 1.5
  tag:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif"
    fontSize: "22rpx"
    fontWeight: 500
    lineHeight: 1
rounded:
  tag: "10rpx"
  sm: "12rpx"
  md: "20rpx"
  lg: "28rpx"
  xl: "40rpx"
  pill: "32rpx"
spacing:
  xs: "8rpx"
  sm: "16rpx"
  md: "24rpx"
  lg: "32rpx"
  xl: "48rpx"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "0 32rpx"
    height: "88rpx"
  button-primary-press:
    backgroundColor: "{colors.primary-press}"
    textColor: "{colors.surface}"
  button-primary-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    height: "96rpx"
  button-soft:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "88rpx"
  button-secondary:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "88rpx"
  button-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.md}"
    height: "88rpx"
  button-plain:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    height: "88rpx"
  button-disabled:
    backgroundColor: "{colors.fill-strong}"
    textColor: "{colors.ink-4}"
  button-sm:
    rounded: "{rounded.sm}"
    padding: "0 24rpx"
    height: "64rpx"
  input:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 24rpx"
    height: "92rpx"
  input-focus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 24rpx"
    height: "64rpx"
  chip-on:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  tag:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink-2}"
    typography: "{typography.tag}"
    rounded: "{rounded.tag}"
    padding: "0 14rpx"
    height: "44rpx"
  tag-hot:
    backgroundColor: "{colors.hot-soft}"
    textColor: "{colors.hot}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "32rpx"
  club-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "28rpx"
  sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "32rpx"
  countdown-segment:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "104rpx"
    width: "96rpx"
  status-hero-live:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "32rpx"
  segmented-on:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    height: "64rpx"
---

# Design System: 社团填报助手

> 令牌的唯一来源是 `src/v2/theme.scss`（CSS 变量挂在 `page` 上）和 `src/v2/format.ts`（分类色）。本文件记录的是已经上线的样子，不是计划。修改令牌时先改代码，再同步这里。

## Overview

**Creative North Star: "清楚的抢报台"**

这是一套行业标准的微信小程序样式：浅灰底配白色圆角卡片，一个明亮的品牌蓝负责所有主操作，系统字体，线性图标。它不追求另类视觉，追求的是三个对标产品各自最好的那一面：飞书 / 腾讯文档的信息层级和管理端的克制，大麦 / 猫眼对倒计时、余量和抢报状态的表达，小红书 / 即刻卡片的年轻感。

界面在高压时刻使用：1500 人同时打开，每一秒名额都可能变化。所以每一屏的视觉重心都放在三件事上：现在能不能报、还剩多少、我报上没有。数字用等宽数字，余量有进度条，状态同时用文字、图标和颜色表达，从不只靠颜色。

已确认拒绝的两种方向：一是白底青绿按钮加文字链接的“表单工具感”；二是黑底霓虹的“秒杀抢购感”。

**Key Characteristics:**
- 浅灰底（bg）+ 白卡片（surface），靠色阶分层，几乎不用投影。
- 一个品牌蓝，一个稀缺橙红，分类色只表示分类。
- 系统字体，数字等宽，字重只用 400 / 500 / 600 / 700。
- 所有尺寸用 rpx，间距落在 8rpx 网格上。
- 动效 150–260ms 缓出，只动 transform / opacity / 颜色，尊重减少动态效果。
- 图标统一为 Lucide 线性图标，通过 CSS mask 渲染。

## Colors

一套冷灰中性色，加一个饱和的品牌蓝和一个克制使用的橙红；所有文字色都在其实际底色上通过 WCAG AA。

### Primary
- **明亮品牌蓝 Brand Blue**（primary）：全部主操作按钮、选中的 Tab 与 chip、焦点输入框边框、开放中的活动状态卡、倒计时数字、tabBar 选中色。白字在其上为 5.43:1。
- **按下蓝 Pressed Blue**（primary-press）：主按钮按下态，不用于静态元素。
- **浅蓝底 Blue Wash**（primary-soft）：次要按钮、选中 chip、info 横幅、余量数字实时变化时的短暂高亮底。品牌蓝文字在其上 4.85:1。
- **蓝上浅字 On-Blue Secondary**（on-primary-2）：蓝色状态卡上的次级文字（标签、截止时间、分隔冒号），在品牌蓝上 4.52:1。
- **余量条渐变 Quota Fill**（g-quota：#8faaf3 → #ab9bf0）：非稀缺状态下余量进度条的填充，刻意比品牌色浅，让条不和主按钮抢视线。只用于进度条，不承载文字。
- **品牌渐变 Brand Gradient**（g-brand：#2a5ee8 → brand-2 #6a4bdb，135°）：2026-09-28 按用户“更有活力”的要求加入。用于主按钮、首页活动状态卡、登录徽标、学生与管理员头像、报名率条。白字在两端分别为 5.43:1 和 5.77:1。纯色 primary 仍用于文字、边框、tabBar 选中色和图标。
- **页面氛围 Wash**（wash #e9efff）：首页、我的报名、登录页顶部 440rpx 内由 wash 渐变到 bg；对应页面导航栏同色。详情页改用该社团分类色的浅底做同样的渐变，导航栏同步为分类浅色。

### Secondary
- **稀缺橙红 Scarcity Orange**（hot）：只用于“名额紧张”这类抢报信号：“仅剩 N”徽标、稀缺时的余量数字与进度条、已收藏的心形。在白底上 5.15:1，在 hot-soft 上 4.67:1。
- **稀缺浅底 Scarcity Wash**（hot-soft）：“仅剩 N”徽标的底色。

### Tertiary（状态色）
每个状态色都成对出现：深色做文字 / 图标，浅色做底，组合对比度均 ≥4.5:1。
- **成功绿**（success / success-soft）：报名成功、凭证状态、“你符合报名条件”、实时连接指示点。4.81:1。
- **提醒琥珀**（warn / warn-soft）：只读期提示、“限指定专业”、连接中断与“名额可能不是最新”横幅。5.40:1。
- **危险红**（danger / danger-soft）：删除、退选等破坏性操作按钮，输入校验错误边框。4.98:1。

### 分类色（format.ts）
八组柔和色标，用分类名哈希选取，只表示“这个社团属于哪一类”：分类 tag 和无封面时的首字块。

| 分类色 | 文字 / 前景 | 底 | 对比度 |
|---|---|---|---|
| 蓝 | primary | primary-soft | 4.85:1 |
| 紫 | cat-violet | cat-violet-soft | 5.55:1 |
| 绿 | success | success-soft | 4.81:1 |
| 橙 | hot | hot-soft | 4.67:1 |
| 玫红 | cat-rose | cat-rose-soft | 5.46:1 |
| 青 | cat-teal | cat-teal-soft | 5.03:1 |
| 琥珀 | warn | warn-soft | 5.40:1 |
| 靛 | cat-indigo | cat-indigo-soft | 6.70:1 |

### Neutral
| 令牌 | 角色 | 说明 |
|---|---|---|
| bg | 页面底 | 所有页面、导航栏、吸顶工具条的底色 |
| surface | 卡片 / 底板 | 卡片、列表、Sheet、固定底栏、倒计时数字块 |
| fill | 静态填充 | 输入框、次按钮、按下态、凭证卡、骨架屏 |
| fill-strong | 强填充 | 进度条轨道、禁用按钮、分段控件底、空状态图标底 |
| line | 分隔线 | 列表行之间 1rpx 细线（左侧缩进 32rpx） |
| ink | 主文字 | 标题、正文、数值。白底 16.1:1 |
| ink-2 | 次文字 | 描述、规则、未选 chip。白底 7.1:1 |
| ink-3 | 辅助文字 | caption、占位、tabBar 未选色。fill 上 4.91:1、bg 上 5.04:1、白底 5.45:1、fill-strong 上 4.52:1 |
| ink-4 | 禁用 / 非文字 | 只用于禁用按钮文字和未激活图标（如未收藏的心形）。fill-strong 上仅 2.69:1，不得用于正文 |
| scrim | 遮罩 | Sheet 背后的遮罩层 |

### Named Rules
**The One Blue Rule.** 所有主操作只用一个品牌蓝。一屏里只有一个实心蓝按钮；其余操作用浅蓝、灰或无底按钮。

**The Scarcity-Only Orange Rule.** 橙红只表示“名额紧张”和收藏心形这类“抢”的信号。它不是强调色，也不能用于错误（错误用 danger 红）；倒计时本身用品牌蓝，橙红只在余量紧张时出现。

**The Category-Means-Category Rule.** 分类色只表示分类。不能拿分类色表达状态、稀缺或选中。

**The Never-Color-Alone Rule.** 每个状态都同时有文字和图标：“仅剩 N”写出数字，“名额已满”写出文字，连接状态有圆点加文字说明。

## Typography

**Display Font:** 系统字体（-apple-system / PingFang SC，回退 Helvetica Neue、Microsoft YaHei）
**Body Font:** 同上
**Numeral Font:** Barlow（SIL OFL 1.1，授权见 `docs/licenses/Barlow-OFL.txt`），只用于 `.num`：倒计时、余量、统计、时间数字。子集只含数字、时间 / 分数标点和 a–f（600、700 两个字重，各约 7.5KB），以 base64 woff 内嵌在 `src/v2/fonts.scss`，无网络请求、不需配置合法域名。中文与其他字符按字体栈回退到系统字体。

**Character:** 中文完全交给系统字体，和微信原生界面浑然一体；数字用 DIN 系的 Barlow，窄而紧凑，带出抢票倒计时的气质，并让 iOS / 安卓显示一致。2026-09-28 由用户在 Barlow / Manrope / Rubik 对比中选定。

### Hierarchy
| 角色 | 字号 | 字重 | 行高 | 用途 |
|---|---|---|---|---|
| Display | 60–64rpx | 700 | 1.1 | 倒计时分段数字（60rpx）、详情页大号余量（64rpx，-1rpx 字距）、开放中的剩余人数 |
| Headline（h1） | 44rpx | 600 | 1.3 | 页面主标题，-0.5rpx 字距 |
| Headline-sm（h2） | 36rpx | 600 | 1.35 | 区块标题、管理端大数字（48rpx 统计数为其放大） |
| Title（h3） | 32rpx | 600 | 1.4 | 卡片标题（社团名）、Sheet 标题、空状态标题 |
| Body | 28rpx | 400 | 1.6 | 正文默认；长介绍行高放宽到 1.75 |
| Body-sm | 26rpx | 400 | 1.55 | 横幅文字、规则、表单标签（500） |
| Label（caption） | 24rpx | 400 | 1.5 | 时间地点、辅助说明，默认 ink-3 |
| Tag | 22rpx | 500 | 1 | 标签、同步状态文字 |

按钮文字 30rpx / 500；主按钮与大按钮 600。输入框文字 30rpx。

### Named Rules
**The Tabular Numbers Rule.** 所有会变化的数字（倒计时、余量、统计）都用 `.num`：Barlow 等宽数字，跳动时宽度不变。不要为中文引入网络字体——中文字库动辄数 MB，会拖慢 1500 人同时开抢时的首屏。

**The Four Weights Rule.** 字重只用 400、500、600、700；700 只留给倒计时和大号余量这类 Display 数字。

## Layout

- **单位与网格：** 全部尺寸用 rpx（750rpx 等于屏宽），间距落在 8rpx 网格上（常用 8 / 16 / 24 / 32 / 48rpx，局部有 12 / 20 / 28rpx 半步）。
- **页面边距：** 左右 32rpx，顶部 16–24rpx；底部加 `env(safe-area-inset-bottom)`。带固定底栏的页面底部留出 184rpx 加安全区。
- **卡片节奏：** 卡片之间 20–24rpx；区块标题上方 48rpx、下方 20rpx。
- **吸顶工具条：** 首页搜索框 + 横滑分类 Tab、管理端分段控件都 `position: sticky`，底色用 bg，左右负边距铺满屏宽。
- **固定底栏：** 详情页主操作放在底部固定栏（surface 底 + 上投影），左侧 96rpx 收藏入口，右侧大号主按钮占满剩余宽度。
- **点击区域：** 按钮 88rpx 高（大按钮 96rpx，小按钮 64rpx 仅用于次级操作），图标按钮 72rpx，列表行最小 112rpx。
- **导航：** 学生端两个 tab（发现社团 / 我的报名），tabBar 白底，未选 ink-3、选中品牌蓝。导航栏与页面同为 bg 色、黑字。

## Elevation & Depth

以色阶分层为主，几乎平面：bg 上放 surface 白卡，卡内用 fill 做二级容器。投影只出现在“浮在内容之上”的东西上。

### Shadow Vocabulary
- **Float**（`0 -8rpx 32rpx rgba(29,33,41,0.06)`）：固定底栏，向上投影，表示它压在滚动内容之上。
- **Sheet**（`0 -16rpx 48rpx rgba(29,33,41,0.12)`）：底部弹出的 Sheet。
- **Segment**（`0 2rpx 8rpx rgba(29,33,41,0.08)`）：分段控件中选中的那一段。
- **Brand Glow**（shadow-brand：`0 12rpx 32rpx rgba(66,84,226,0.28)`）：大号主按钮、活动状态卡、登录徽标、头像。带偏移和柔和模糊的彩色投影，只跟品牌渐变一起出现。
- **Card Lift**（`0 4rpx 16rpx rgba(29,33,41,0.04)`）：社团卡片的极轻投影，按下时卡片缩放到 0.985。

### Named Rules
**The Flat Card Rule.** 普通卡片不带描边，只有极轻的 Card Lift；较重的投影只给固定底栏、Sheet、选中分段和品牌渐变元素。

## Shapes

一致的中等圆角，越大的容器圆角越大：

| 令牌 | 值 | 用在 |
|---|---|---|
| tag | 10rpx | 标签 |
| sm | 12rpx | 小按钮、只读提示条 |
| md | 20rpx | 默认按钮、输入框、横幅、倒计时数字块、分段控件 |
| lg | 28rpx | 卡片、列表、大按钮、状态卡、凭证 |
| xl | 40rpx | Sheet 顶部两角 |
| pill | 32rpx | chip、胶囊 |

社团首字块和封面按边长的 22% 取圆角（128rpx 块约 28rpx），和卡片同一语言。头像、空状态图标底、成功打勾环为正圆。报名凭证用虚线加左右半圆缺口做出“票根”形状，这是系统里唯一的特殊轮廓。

## Components

### Buttons
- **Shape:** 默认 20rpx 圆角、88rpx 高；大按钮 28rpx 圆角、96rpx 高、32rpx / 600；小按钮 12rpx 圆角、64rpx 高。
- **Primary:** 品牌渐变底白字 600，大号主按钮带 Brand Glow。按下降到 90% 不透明度并缩放到 0.985（150ms 缓出）。
- **Soft / Secondary / Danger / Plain:** 浅蓝底蓝字；fill 底 ink 字；danger-soft 底 danger 字；透明底 ink-2 字。按下各自加深一级。
- **Disabled:** 一律 fill-strong 底、ink-4 字，覆盖所有变体（WCAG 对禁用控件豁免对比度）。
- **成组：** Sheet 底部和并排按钮必须包在 `.sheet-actions` 里，两个按钮等分宽度、间隔 20rpx。

### Chips
- **Style:** 白底、ink-2 字、32rpx 胶囊、64rpx 高（筛选行 56rpx / 24rpx 字）。
- **State:** 选中为 primary-soft 底、品牌蓝字、500 字重，150ms 颜色过渡。

### Tags
44rpx 高、10rpx 圆角、22rpx / 500。默认 fill 底 ink-2 字，另有 primary / success / warn / danger / hot 五种语义变体，和分类色 tag（内联分类色）。图标与文字间距 6rpx。

### Cards / Containers
- **Corner Style:** 28rpx。
- **Background:** surface 白。
- **Shadow Strategy:** 无（见 The Flat Card Rule）。
- **Border:** 无；列表内部用缩进 1rpx line 分隔。
- **Internal Padding:** 32rpx；社团卡 28rpx。按下态换成 fill 底。

### Inputs / Fields
- **Style:** fill 底、20rpx 圆角、92rpx 高、2rpx 透明描边，左侧可带 ink-3 图标。放在灰底工具条上时改用 surface 白底。
- **Focus:** 底变 surface 白，描边变品牌蓝（150ms）。
- **Error:** 描边变 danger。标签 26rpx / 500 / ink-2 在上，提示 24rpx / ink-3 在下。

### Navigation
- **tabBar:** 原生 tabBar，白底，文字 ink-3，选中品牌蓝，图标为 PNG。
- **分类 Tab：** 横滑 chip 行，吸顶。
- **管理端分段控件：** fill-strong 底槽、6rpx 内边距，选中段白底 + Segment 投影 + ink 600 字。

### 活动状态卡（Signature）
首页顶部。品牌渐变底加 Brand Glow，右上角是两圈半透明白色细圆环、底部一块半透明圆盘作为几何装饰（纯几何图形，不是插画）。开放前：白色半透明胶囊 + 绿点标注状态，下面是“时 : 分 : 秒”分段倒计时，每段是白底蓝字 60rpx / 700 的数字块（96rpx 宽、104rpx 高、20rpx 圆角）。开放中显示“报名进行中”和截止时间。已报名后换成白卡：成功绿圆形图标 + “你已报名成功” + 社团名，可点进详情。

### 余量计（QuotaMeter，Signature）
“剩余 N / 共 M”加一条 8rpx（大号 12rpx）进度条。进度条用 scaleX 变换，400ms 缓出平滑过渡。名额实时变化时数字底色短暂变 primary-soft、字变蓝，700ms 后恢复。稀缺时（剩余不超过容量 10% 且至少 3 个）数字和进度条变 hot，并出现“仅剩 N”徽标；满员显示“名额已满”文字。连接断开时数字与进度条降到 45% 不透明度，同时出现 warn 横幅“名额可能不是最新”。

### 报名确认 Sheet 与凭证
底部 Sheet：40rpx 顶部圆角，scrim 遮罩，260ms 从底部滑入，最大高 88vh。报名成功后换成成功面板：成功绿打勾环 420ms 弹入，下方是 fill 底的“票根”凭证卡（虚线 + 两侧半圆缺口）。

### StatusBanner
info / success / warn / danger / pending 五种语气：浅色底 + 同色图标，标题 600，正文 26rpx / ink-2，20rpx 圆角。pending 的刷新图标会旋转，属于功能性加载指示。

### EmptyState 与 SkeletonCard
空状态：112rpx 圆形 fill-strong 底图标 + h3 标题 + caption。骨架屏：卡片形状的 fill 色块，1.4s 呼吸。两者都是加载 / 空态的功能性表达。

### 社团标识（ClubMark）
没有封面时，显示分类浅色底上的分类线性图标（摄影 → 相机、球类 → 球、合唱 → 音符、机器人 → 机器人、羽毛球 → 羽毛、街舞 → 脚印、志愿 → 爱心握手等，规则在 `format.ts`），左上角有一块白色径向高光；无法匹配的分类回退为社团名首字。圆角为边长的 28%。详情页头部的标识带 6rpx 白边和轻投影，让它从同色的氛围底上浮起来。

### 图标（UiIcon）
Lucide 线性图标，2px 描边，以 URL 编码的 SVG 字符串存在 `icons.ts`，渲染为 CSS mask，颜色继承 currentColor。常用尺寸 36rpx（行内）、40rpx（关闭）、48rpx（空状态）。

### 动效
| 令牌 | 值 | 用途 |
|---|---|---|
| t-fast | 150ms | 按钮、chip、输入框的颜色与缩放 |
| t-base | 220ms | 遮罩淡入、余量数字高亮 |
| ease-out | cubic-bezier(0.16, 1, 0.3, 1) | 所有入场与数值过渡 |
| Sheet 滑入 | 260ms | Sheet 位移 |
| 进度条 | 400ms | 余量 / 报名率条的 scaleX |
| 成功弹入 | 420ms | 报名成功打勾环，一次性 |
| 纸屑迸发 | 900ms | 报名成功时 14 片彩色纸屑从打勾环向外飞散后消失，一次性 |
| 卡片入场 | 460ms，每张错开 45ms | 首页社团卡依次上浮淡入（.enter） |
| 倒计时翻动 | 360ms | 数字变化时该段从上方轻落 |
| 心形弹跳 | 380ms | 收藏点亮时 0.6 → 1.18 → 1 |

所有动效都是一次性的，没有装饰性的循环；在系统“减少动态效果”下统一降为 1ms。

`prefers-reduced-motion: reduce` 时全局把 transition 和 animation 压到 1ms。

## Do's and Don'ts

### Do:
- **Do** 所有颜色都走 `theme.scss` 的 CSS 变量；新增文字色前先在实际底色上验算 WCAG AA（≥4.5:1），并把比值写进本文件。
- **Do** 一屏只放一个品牌蓝实心按钮，主操作放在固定底栏或 Sheet 底部。
- **Do** 数字一律加等宽数字，状态一律“文字 + 图标 + 颜色”三件齐全。
- **Do** 图标只用 `UiIcon` + `icons.ts`（Lucide CSS mask）；新图标从 lucide 图标节点生成 URL 编码 SVG 加进 `icons.ts`。
- **Do** 需要给自定义组件加外边距或布局类时，外面包一层 view，把 class 加在 view 上。
- **Do** Sheet 的 footer 插槽里把按钮包进 `.sheet-actions`。
- **Do** 组件内的 scoped 类名用带前缀或具体的名字（如 `.banner-success`、`.quota-full`），避免和全局 `.tag.success` 这类组合类撞名。
- **Do** 动效只动 transform、opacity 和颜色，时长 150–260ms 缓出；只有进度条（400ms）和报名成功弹入（420ms）例外。
- **Do** 没有封面图时用分类色首字块，保证无图也成立。

### Don't:
- **Don't** 在小程序模板里写内联 `<svg>`，小程序不渲染。
- **Don't** 把组件命名为 `Icon`（或其他小程序内置组件名），会和内置 `<icon>` 冲突；图标组件叫 `UiIcon`。
- **Don't** 依赖 class 透传到自定义组件根节点，小程序里不可靠。
- **Don't** 在 `<text>` 里放自定义组件；`<text>` 只能包文字和嵌套 `<text>`。
- **Don't** 用橙红表达错误或一般强调，用分类色表达状态，或给普通卡片加投影和描边。
- **Don't** 把 ink-4 用于任何需要阅读的文字，它只给禁用态和非文字图标。
- **Don't** 做装饰性的循环动画；只有加载指示（骨架屏呼吸、pending 旋转）可以循环，并受减少动态效果约束。
- **Don't** 回到白底青绿按钮加文字链接的表单工具感，也不要走黑底霓虹的秒杀风。
