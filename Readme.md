# 组件命名规范

```c
src/
├── pages/                    # 页面
│   ├── index/
│   │   └── index.vue
│   ├── login/
│   │   ├── login.vue
│   │   └── resetpassword.vue
│   └── home/
│       └── home.vue
│
├── components/               # 可复用组件
│   ├── AnimatedNotification.vue
│   ├── FormItem.vue
│   └── OAuthButtons.vue
│
├── composables/              # 组合式逻辑（Vue3 特有）
│   ├── useLoginForm.js
│   └── useAuth.js
│
├── stores/                   # 状态管理（Pinia）
│   ├── user.js
│   └── noteTemplates.js
│
├── api/                      # 接口层
│   ├── student.js
│   ├── club.js
│   └── auth.js
│
├── utils/                    # 工具函数
│   ├── request.js            # axios/uni.request 封装
│   └── format.js             # 格式化工具
│
├── styles/                   # 全局样式
│   ├── variables.scss        # 颜色、字体变量
│   ├── common.scss           # 全局通用类
│   └── login.scss            # 页面级抽离样式
│
├── static/                   # 静态资源（不会被编译）
│   ├── icons/
│   └── images/
│
├── App.vue                   # 根组件
├── main.js                   # 入口
├── pages.json                # 页面路由配置（等价于 app.json）
├── manifest.json             # 平台配置
└── uni.scss                  # uni-app 内置变量
```

navigateTo → 开新门（可回头）
redirectTo → 换新门（回不了头）
reLaunch → 推倒重建（所有门都没了）
