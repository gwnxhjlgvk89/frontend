<template>
  <view class="modal-overlay" @click="handleBackdropClick">
    <view class="modal-container" @click.stop>
      <!-- 背景装饰 -->
      <view class="modal-decoration" />

      <!-- 头部 -->
      <view class="modal-header">
        <view class="header-content">
          <text class="modal-icon">{{ modalIcon }}</text>
          <view class="header-text">
            <text class="modal-title">
              {{ isNew ? "✨ 新增" : "✎ 编辑" }}{{ modalTitle }}
            </text>
            <text class="modal-subtitle">
              {{ isNew ? "添加新的" : "修改现有的" }}{{ modalTitle }}信息
            </text>
          </view>
        </view>
        <text class="modal-close" @click="$emit('close')">✕</text>
      </view>

      <!-- 进度指示 -->
      <view class="modal-progress">
        <view class="progress-bar">
          <view
            class="progress-fill"
            :style="{ width: progressPercent + '%' }"
          />
        </view>
        <text class="progress-text"
          >{{ currentFormStep }}/{{ totalFormSteps }}</text
        >
      </view>

      <!-- 内容区 -->
      <scroll-view class="modal-body" scroll-y>
        <!-- 社团表单 -->
        <view v-if="type === 'club'" class="form-section">
          <!-- 基本信息模块 -->
          <view class="form-module">
            <view class="module-header">
              <text class="module-icon">🏢</text>
              <text class="module-title">基本信息</text>
            </view>
            <view class="module-content">
              <!-- 所属大社 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">所属大社</text>
                  <text class="form-required">*</text>
                </view>
                <view class="select-wrapper">
                  <picker
                    mode="selector"
                    :range="superClubOptions"
                    :value="superClubIndex"
                    @change="handleSuperClubChange"
                  >
                    <view
                      class="picker-value"
                      :class="{ 'picker-value--empty': !formData.super_club }"
                    >
                      <text class="picker-icon">🏆</text>
                      <text>{{ formData.super_club || "请选择所属大社" }}</text>
                    </view>
                  </picker>
                </view>
              </view>

              <!-- 社团名称 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">社团名称</text>
                  <text class="form-required">*</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">📝</text>
                  <input
                    class="form-input"
                    type="text"
                    placeholder="请输入社团名称"
                    :value="formData.club_name"
                    @input="handleInput('club_name', $event)"
                  />
                </view>
              </view>

              <!-- 成立年份 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">成立年份</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">📅</text>
                  <input
                    class="form-input"
                    type="number"
                    placeholder="如：2020"
                    :value="formData.foundation_year"
                    @input="handleInput('foundation_year', $event)"
                  />
                </view>
              </view>
            </view>
          </view>

          <!-- 管理信息模块 -->
          <view class="form-module">
            <view class="module-header">
              <text class="module-icon">👥</text>
              <text class="module-title">管理信息</text>
            </view>
            <view class="module-content">
              <!-- 指导老师 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">指导老师</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">👨‍🏫</text>
                  <input
                    class="form-input"
                    type="text"
                    placeholder="请输入指导老师名字"
                    :value="formData.teacher_advisor"
                    @input="handleInput('teacher_advisor', $event)"
                  />
                </view>
              </view>

              <!-- 社长 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">社长</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">👤</text>
                  <input
                    class="form-input"
                    type="text"
                    placeholder="请输入社长名字"
                    :value="formData.club_president"
                    @input="handleInput('club_president', $event)"
                  />
                </view>
              </view>
            </view>
          </view>

          <!-- 招募信息模块 -->
          <view class="form-module">
            <view class="module-header">
              <text class="module-icon">📊</text>
              <text class="module-title">招募信息</text>
            </view>
            <view class="module-content">
              <!-- 招募状态 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">招募状态</text>
                  <text class="form-required">*</text>
                </view>
                <view class="select-wrapper">
                  <picker
                    mode="selector"
                    :range="statusOptions"
                    :value="statusIndex"
                    @change="handleStatusChange"
                  >
                    <view class="picker-value">
                      <text>{{ statusOptions[statusIndex] }}</text>
                    </view>
                  </picker>
                </view>
              </view>

              <!-- 总名额、预留名额和剩余名额 -->
              <view class="form-group-row">
                <view class="form-group form-group--half">
                  <view class="form-label-wrapper">
                    <text class="form-label">总名额</text>
                    <text class="form-required">*</text>
                  </view>
                  <view class="form-input-wrapper">
                    <text class="input-icon">📍</text>
                    <input
                      class="form-input"
                      type="number"
                      placeholder="0"
                      v-model.number="formData.total_quota"
                      @input="handleInput('total_quota', $event)"
                    />
                  </view>
                </view>

                <view class="form-group form-group--half">
                  <view class="form-label-wrapper">
                    <text class="form-label">预留名额</text>
                  </view>
                  <view class="form-input-wrapper">
                    <text class="input-icon">🏷️</text>
                    <input
                      class="form-input"
                      type="number"
                      placeholder="0"
                      v-model.number="formData.reserved_quota"
                      @input="handleInput('reserved_quota', $event)"
                    />
                  </view>
                </view>
              </view>

              <!-- 剩余名额 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">剩余名额</text>
                  <text class="form-required">*</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">📌</text>
                  <input
                    class="form-input"
                    type="number"
                    v-model.number="formData.remaining_quota"
                    disabled
                  />
                </view>
              </view>

              <!-- 专业限制 -->
              <view class="form-group form-group--toggle">
                <view class="toggle-label">
                  <text class="toggle-icon">🎯</text>
                  <view class="toggle-text">
                    <text class="toggle-title">专业限制</text>
                    <text class="toggle-desc">
                      {{
                        formData.has_major_limit ? "有专业限制" : "无专业限制"
                      }}
                    </text>
                  </view>
                </view>
                <switch
                  :checked="formData.has_major_limit"
                  @change="handleToggle('has_major_limit', $event)"
                />
              </view>
            </view>
          </view>

          <!-- 详细信息模块 -->
          <view class="form-module">
            <view class="module-header">
              <text class="module-icon">📝</text>
              <text class="module-title">详细信息</text>
            </view>
            <view class="module-content">
              <!-- 简介 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">社团简介</text>
                </view>
                <textarea
                  class="form-textarea"
                  placeholder="请输入社团简介（一句话描述）"
                  :value="formData.description"
                  @input="handleInput('description', $event)"
                />
                <text class="form-hint"
                  >{{ formData.description?.length || 0 }}/100</text
                >
              </view>

              <!-- 详细介绍 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">详细介绍</text>
                </view>
                <textarea
                  class="form-textarea"
                  placeholder="请输入详细介绍（可包含社团文化、活动等）"
                  :value="formData.description_detail"
                  @input="handleInput('description_detail', $event)"
                />
                <text class="form-hint"
                  >{{ formData.description_detail?.length || 0 }}/500</text
                >
              </view>
            </view>
          </view>

          <!-- 活动信息模块 -->
          <view class="form-module">
            <view class="module-header">
              <text class="module-icon">🎉</text>
              <text class="module-title">活动信息</text>
            </view>
            <view class="module-content">
              <!-- 活动时间 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">活动时间</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">⏰</text>
                  <input
                    class="form-input"
                    type="text"
                    placeholder="如：每周二晚上7点"
                    :value="formData.activity_time"
                    @input="handleInput('activity_time', $event)"
                  />
                </view>
              </view>

              <!-- 活动地点 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">活动地点</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">📍</text>
                  <input
                    class="form-input"
                    type="text"
                    placeholder="请输入活动地点"
                    :value="formData.activity_position"
                    @input="handleInput('activity_position', $event)"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 学生表单 -->
        <view v-else class="form-section">
          <!-- 基本信息模块 -->
          <view class="form-module">
            <view class="module-header">
              <text class="module-icon">👤</text>
              <text class="module-title">基本信息</text>
            </view>
            <view class="module-content">
              <!-- 学生名字 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">学生名字</text>
                  <text class="form-required">*</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">📝</text>
                  <input
                    class="form-input"
                    type="text"
                    placeholder="请输入学生名字"
                    :value="formData.name"
                    @input="handleInput('name', $event)"
                  />
                </view>
              </view>

              <!-- 学号 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">学号</text>
                  <text class="form-required">*</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">🆔</text>
                  <input
                    class="form-input"
                    type="text"
                    placeholder="请输入学号"
                    :value="formData.student_id"
                    @input="handleInput('student_id', $event)"
                  />
                </view>
              </view>

              <!-- 专业 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">专业</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">🎓</text>
                  <input
                    class="form-input"
                    type="text"
                    placeholder="请输入专业"
                    :value="formData.major_name"
                    @input="handleInput('major_name', $event)"
                  />
                </view>
              </view>

              <!-- 年级 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">年级</text>
                </view>
                <view class="select-wrapper">
                  <picker
                    mode="selector"
                    :range="gradeOptions"
                    :value="gradeIndex"
                    @change="handleGradeChange"
                  >
                    <view class="picker-value">
                      <text class="picker-icon">📚</text>
                      <text>{{
                        gradeOptions[gradeIndex] || "请选择年级"
                      }}</text>
                    </view>
                  </picker>
                </view>
              </view>
            </view>
          </view>

          <!-- 联系方式模块 -->
          <view class="form-module">
            <view class="module-header">
              <text class="module-icon">📞</text>
              <text class="module-title">联系方式</text>
            </view>
            <view class="module-content">
              <!-- 邮箱 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">邮箱</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">✉️</text>
                  <input
                    class="form-input"
                    type="email"
                    placeholder="请输入邮箱"
                    :value="formData.email"
                    @input="handleInput('email', $event)"
                  />
                </view>
              </view>

              <!-- 电话 -->
              <view class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">电话</text>
                </view>
                <view class="form-input-wrapper">
                  <text class="input-icon">☎️</text>
                  <input
                    class="form-input"
                    type="tel"
                    placeholder="请输入电话"
                    :value="formData.phone"
                    @input="handleInput('phone', $event)"
                  />
                </view>
              </view>
            </view>
          </view>

          <!-- 状态信息模块 -->
          <view class="form-module">
            <view class="module-header">
              <text class="module-icon">✅</text>
              <text class="module-title">状态信息</text>
            </view>
            <view class="module-content">
              <!-- 已选社 -->
              <view class="form-group form-group--toggle">
                <view class="toggle-label">
                  <text class="toggle-icon">🎯</text>
                  <view class="toggle-text">
                    <text class="toggle-title">已选社</text>
                    <text class="toggle-desc">
                      {{ formData.has_selected ? "已选社" : "未选社" }}
                    </text>
                  </view>
                </view>
                <switch
                  :checked="formData.has_selected"
                  @change="handleStatusToggle('has_selected', $event)"
                />
              </view>

              <!-- 已选社时显示社团选择 -->
              <view v-if="formData.has_selected" class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">选择的社团</text>
                  <text class="form-required">*</text>
                </view>
                <view class="select-wrapper">
                  <picker
                    mode="selector"
                    :range="clubOptions"
                    :value="selectedClubIndex"
                    @change="handleClubChange"
                  >
                    <view
                      class="picker-value"
                      :class="{
                        'picker-value--empty': !formData.selected_club,
                      }"
                    >
                      <text class="picker-icon">🏢</text>
                      <text>{{
                        formData.selected_club_name || "请选择社团"
                      }}</text>
                    </view>
                  </picker>
                </view>
              </view>

              <!-- 已预留 -->
              <view class="form-group form-group--toggle">
                <view class="toggle-label">
                  <text class="toggle-icon">🏷️</text>
                  <view class="toggle-text">
                    <text class="toggle-title">已预留</text>
                    <text class="toggle-desc">
                      {{ formData.is_reserved ? "已预留" : "未预留" }}
                    </text>
                  </view>
                </view>
                <switch
                  :checked="formData.is_reserved"
                  @change="handleStatusToggle('is_reserved', $event)"
                />
              </view>

              <!-- 已预留时显示社团选择 -->
              <view v-if="formData.is_reserved" class="form-group">
                <view class="form-label-wrapper">
                  <text class="form-label">预留的社团</text>
                  <text class="form-required">*</text>
                </view>
                <view class="select-wrapper">
                  <picker
                    mode="selector"
                    :range="clubOptions"
                    :value="reservedClubIndex"
                    @change="handleReservedClubChange"
                  >
                    <view
                      class="picker-value"
                      :class="{
                        'picker-value--empty': !formData.reserved_club,
                      }"
                    >
                      <text class="picker-icon">🏢</text>
                      <text>{{
                        formData.reserved_club_name || "请选择社团"
                      }}</text>
                    </view>
                  </picker>
                </view>
              </view>

              <!-- 互斥提示 -->
              <view
                v-if="formData.has_selected && formData.is_reserved"
                class="form-warning"
              >
                <text class="warning-icon">⚠️</text>
                <text class="warning-text">不能同时选择"已选社"和"已预留"</text>
              </view>
            </view>
          </view>
        </view>

        <view style="height: 40rpx" />
      </scroll-view>

      <!-- 底部按钮 -->
      <view class="modal-footer">
        <button class="btn btn-cancel" @click="$emit('close')">
          <text class="btn-icon">✕</text>
          <text>取消</text>
        </button>
        <button class="btn btn-save" @click="handleSave">
          <text class="btn-icon">✓</text>
          <text>保存修改</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { showToast } from "@/utils/toast.js";

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ["club", "student"].includes(value),
  },
  data: {
    type: Object,
    required: true,
  },
  // ✅ 新增：传入可用的社团列表
  clubList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["save", "close"]);

// 表单数据
const formData = ref({});

// 所属大社选项
const superClubOptions = [
  "新零售品牌创意工作室",
  '"三IN"财务人成长社',
  '"小先生"兴趣社',
  '"小先生"宣讲社',
  "跨境电商新零售人才培养社",
];

// ✅ 社团列表（从 props 传入）
const clubOptions = computed(() => {
  return props.clubList.map((club) => club.club_name);
});

// 选项
const statusOptions = ["🔒 未开放", "🔓 招募中", "✅ 已满员", "🏁 已结束"];
const gradeOptions = ["大一", "大二", "大三", "大四"];

// 计算属性
const isNew = computed(() => {
  return props.type === "club" ? !props.data.club_name : !props.data.student_id;
});

const modalTitle = computed(() => (props.type === "club" ? "社团" : "学生"));

const modalIcon = computed(() => (props.type === "club" ? "🏢" : "👤"));

const statusIndex = computed(() => {
  const statusMap = { 0: 0, 1: 1, 2: 2, 3: 3 };
  return statusMap[formData.value.club_status] || 0;
});

const gradeIndex = computed(() => {
  if (!formData.value.grade) return 0;
  return gradeOptions.indexOf(formData.value.grade);
});

const currentFormStep = computed(() => {
  if (props.type === "club") return 4;
  return 3;
});

const totalFormSteps = computed(() => {
  if (props.type === "club") return 4;
  return 3;
});

const progressPercent = computed(() => {
  return (currentFormStep.value / totalFormSteps.value) * 100;
});

// 监听 props.data 变化，初始化表单
watch(
  () => props.data,
  (newData) => {
    formData.value = JSON.parse(JSON.stringify(newData));
  },
  { immediate: true, deep: true },
);

watch(
  () => [formData.value.total_quota, formData.value.reserved_quota],
  () => {
    const total = parseInt(formData.value.total_quota) || 0;
    const reserved = parseInt(formData.value.reserved_quota) || 0;
    formData.value.remaining_quota = Math.max(0, total - reserved);
    formData.value.total_quota = Math.max(0, total);
    formData.value.reserved_quota = Math.max(0, reserved);
  },
);

// ✅ 已选社团的索引
const selectedClubIndex = computed(() => {
  if (!formData.value.selected_club) return 0;
  return clubOptions.value.indexOf(formData.value.selected_club);
});

// ✅ 已预留社团的索引
const reservedClubIndex = computed(() => {
  if (!formData.value.reserved_club) return 0;
  return clubOptions.value.indexOf(formData.value.reserved_club);
});

// ✅ 处理状态切换（已选社/已预留 互斥）
const handleStatusToggle = (field, event) => {
  const value = event.detail.value;

  if (field === "has_selected") {
    formData.value.has_selected = value;
    // 如果选中"已选社"，需要清除"已预留"
    if (value && formData.value.is_reserved) {
      formData.value.is_reserved = false;
      formData.value.reserved_club = "";
    }
  } else if (field === "is_reserved") {
    formData.value.is_reserved = value;
    // 如果选中"已预留"，需要清除"已选社"
    if (value && formData.value.has_selected) {
      formData.value.has_selected = false;
      formData.value.selected_club = "";
    }
  }
};

// ✅ 处理已选社团
const handleClubChange = (event) => {
  formData.value.selected_club = clubOptions.value[event.detail.value];
};

// ✅ 处理已预留社团
const handleReservedClubChange = (event) => {
  formData.value.reserved_club = clubOptions.value[event.detail.value];
};

// 处理输入
const handleInput = (field, event) => {
  formData.value[field] = event.detail.value;
};

// 处理切换开关
const handleToggle = (field, event) => {
  formData.value[field] = event.detail.value;
};

// 处理大社选择
const handleSuperClubChange = (event) => {
  formData.value.super_club = superClubOptions[event.detail.value];
  if (errors.value.super_club) {
    delete errors.value.super_club;
  }
};

// 处理状态选择
const handleStatusChange = (event) => {
  const statusMap = { 0: 0, 1: 1, 2: 2, 3: 3 };
  formData.value.club_status = statusMap[event.detail.value];
};

// 处理年级选择
const handleGradeChange = (event) => {
  formData.value.grade = gradeOptions[event.detail.value];
};

// 处理背景点击
const handleBackdropClick = () => {
  emit("close");
};

// 验证表单
const validateForm = () => {
  if (props.type === "club") {
    if (!formData.value.club_name?.trim()) {
      showToast({ title: "请输入社团名称", icon: "error" });
      return false;
    }
    // 验证所属大社
    if (!formData.value.super_club?.trim()) {
      showToast({ title: "请选择所属大社", icon: "error" });
      return false;
    }
    if (!formData.value.total_quota || formData.value.total_quota <= 0) {
      showToast({ title: "总名额必须大于0", icon: "error" });
      return false;
    }
    if (formData.value.remaining_quota > formData.value.total_quota) {
      showToast({ title: "剩余名额不能超过总名额", icon: "error" });
      return false;
    }
    if (
      formData.value.reserved_quota + formData.value.remaining_quota !=
      formData.value.total_quota
    ) {
      console.log(
        formData.value.remaining_quota,
        formData.value.reserved_quota,
        formData.value.total_quota,
      );
      showToast({
        title: "预留名额和剩余名额之和不等于总名额",
        icon: "error",
      });
      return false;
    }
  } else {
    // ✅ 学生表单验证
    if (!formData.value.name?.trim()) {
      showToast({ title: "请输入学生名字", icon: "error" });
      return false;
    }
    if (!formData.value.student_id?.trim()) {
      showToast({ title: "请输入学号", icon: "error" });
      return false;
    }

    // ✅ 验证已选社和已预留不能同时勾选
    if (formData.value.has_selected && formData.value.is_reserved) {
      showToast({ title: "不能同时选择'已选社'和'已预留'", icon: "error" });
      return false;
    }

    // ✅ 验证已选社必须选择社团
    if (formData.value.has_selected && !formData.value.selected_club?.trim()) {
      showToast({ title: "已选社必须选择对应的社团", icon: "error" });
      return false;
    }

    // ✅ 验证已预留必须选择社团
    if (formData.value.is_reserved && !formData.value.reserved_club?.trim()) {
      showToast({ title: "已预留必须选择对应的社团", icon: "error" });
      return false;
    }
  }
  return true;
};

// 处理保存
const handleSave = () => {
  if (!validateForm()) return;

  // 数值转换
  if (props.type === "club") {
    formData.value.total_quota = parseInt(formData.value.total_quota) || 0;
    formData.value.remaining_quota =
      parseInt(formData.value.remaining_quota) || 0;
    formData.value.foundation_year =
      parseInt(formData.value.foundation_year) || null;
  }

  emit("save", formData.value);
};
</script>

<style scoped>
/* ════════════════════════════════════════
   模态框整体
════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  display: flex;
  flex-direction: column;
  width: 85%;
  max-width: 600rpx; /* 从 700rpx 改为 600rpx */
  max-height: 75vh; /* 从 80vh 改为 75vh */
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.95) 0%,
    rgba(26, 31, 53, 0.95) 100%
  );
  border: 1rpx solid rgba(99, 102, 241, 0.25);
  border-radius: 28rpx;
  overflow: hidden;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 25rpx 50rpx rgba(0, 0, 0, 0.4),
    0 0 1rpx rgba(99, 102, 241, 0.3),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.08);
  position: relative;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(60rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ════════════════════════════════════════
   背景装饰
════════════════════════════════════════ */
.modal-decoration {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 20% 50%,
      rgba(99, 102, 241, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(139, 92, 246, 0.06) 0%,
      transparent 50%
    );
  pointer-events: none;
}

/* ════════════════════════════════════════
   头部
════════════════════════════════════════ */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx 16rpx; /* 从 28rpx 改为 20rpx/24rpx */
  border-bottom: 1rpx solid rgba(99, 102, 241, 0.15);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  flex: 1;
}

.modal-icon {
  font-size: 36rpx;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4rpx);
  }
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.modal-title {
  font-size: 26rpx; /* 从 28rpx 改为 26rpx */
  font-weight: 700;
  background: linear-gradient(135deg, #a5f3fc, #c4b5fd);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.modal-subtitle {
  font-size: 13rpx; /* 从 14rpx 改为 13rpx */
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.5rpx;
}

.modal-close {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  font-size: 22rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.modal-close:active {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(0.9) rotate(90deg);
}

/* ════════════════════════════════════════
   进度条
════════════════════════════════════════ */
.modal-progress {
  display: flex;
  align-items: center;
  gap: 10rpx; /* 从 12rpx 改为 10rpx */
  padding: 10rpx 24rpx; /* 从 12rpx 改为 10rpx */
  position: relative;
  z-index: 2;
}

.progress-bar {
  flex: 1;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 2rpx;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 8rpx rgba(99, 102, 241, 0.4);
}

.progress-text {
  font-size: 12rpx;
  color: #a5f3fc;
  font-weight: 600;
  min-width: 40rpx;
}

/* ════════════════════════════════════════
   内容区
════════════════════════════════════════ */
.modal-body {
  flex: 1;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.form-section {
  padding: 20rpx 24rpx; /* 从 28rpx 改为 20rpx/24rpx */
  display: flex;
  flex-direction: column;
  gap: 20rpx; /* 从 24rpx 改为 20rpx */
}

/* ════════════════════════════════════════
   表单模块
════════════════════════════════════════ */
.form-module {
  display: flex;
  flex-direction: column;
  gap: 14rpx; /* 从 16rpx 改为 14rpx */
  padding: 16rpx; /* 从 20rpx 改为 16rpx */
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.06) 0%,
    rgba(59, 130, 246, 0.04) 100%
  );
  border: 1rpx solid rgba(99, 102, 241, 0.12);
  border-radius: 20rpx;
  transition: all 0.3s ease;
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(16rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-module:hover {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(59, 130, 246, 0.08) 100%
  );
  border-color: rgba(99, 102, 241, 0.2);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 8rpx; /* 从 10rpx 改为 8rpx */
  padding-bottom: 10rpx; /* 从 12rpx 改为 10rpx */
  border-bottom: 1rpx solid rgba(99, 102, 241, 0.15);
}

.module-icon {
  font-size: 22rpx; /* 从 24rpx 改为 22rpx */
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.module-title {
  font-size: 16rpx; /* 从 18rpx 改为 16rpx */
  font-weight: 700;
  color: #a5f3fc;
  text-transform: uppercase;
  letter-spacing: 0.8rpx; /* 从 1rpx 改为 0.8rpx */
}

.module-content {
  display: flex;
  flex-direction: column;
  gap: 14rpx; /* 从 16rpx 改为 14rpx */
}

/* ════════════════════════════════════════
   表单组
════════════════════════════════════════ */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8rpx; /* 从 10rpx 改为 8rpx */
}

.form-group-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx; /* 从 16rpx 改为 12rpx */
}

.form-group--half {
  flex: 1;
}

.form-group--toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx; /* 从 16rpx 改为 14rpx */
  background: rgba(255, 255, 255, 0.04);
  border: 1rpx solid rgba(99, 102, 241, 0.1);
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.form-group--toggle:active {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
}

/* ════════════════════════════════════════
   表单标签
════════════════════════════════════════ */
.form-label-wrapper {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.form-label {
  font-size: 15rpx; /* 从 16rpx 改为 15rpx */
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.form-required {
  color: #f87171;
  font-weight: 700;
  font-size: 18rpx;
}

/* ════════════════════════════════════════
   输入框包装
════════════════════════════════════════ */
.form-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8rpx; /* 从 10rpx 改为 8rpx */
  padding: 10rpx 14rpx; /* 从 12rpx 改为 10rpx/14rpx */
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(99, 102, 241, 0.15);
  border-radius: 12rpx;
  transition: all 0.3s ease;
  overflow: hidden;
}

.form-input-wrapper:focus-within {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 12rpx rgba(99, 102, 241, 0.15);
}
.input-icon {
  font-size: 16rpx; /* 从 18rpx 改为 16rpx */
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.5);
}

.form-input,
.form-textarea {
  flex: 1;
  background: transparent;
  color: #ffffff;
  font-size: 15rpx; /* 从 16rpx 改为 15rpx */
  border: none;
  outline: none;
  padding: 0;
}
.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* ════════════════════════════════════════
   文本区域
════════════════════════════════════════ */
.form-textarea {
  min-height: 85rpx; /* 从 100rpx 改为 85rpx */
  max-height: 180rpx; /* 从 200rpx 改为 180rpx */
  padding: 10rpx 14rpx; /* 从 12rpx 改为 10rpx/14rpx */
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(99, 102, 241, 0.15);
  border-radius: 12rpx;
  color: #ffffff;
  font-size: 15rpx;
  font-family: inherit;
  transition: all 0.3s ease;
  resize: vertical;
}

.form-textarea:focus {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 12rpx rgba(99, 102, 241, 0.15);
}

.form-hint {
  font-size: 12rpx;
  color: rgba(255, 255, 255, 0.4);
  text-align: right;
  margin-top: 4rpx;
}

/* ════════════════════════════════════════
   选择器
════════════════════════════════════════ */
.select-wrapper {
  display: flex;
  align-items: center;
}

.select-wrapper picker {
  width: 100%;
}

.picker-value {
  display: flex;
  align-items: center;
  gap: 8rpx; /* 从 10rpx 改为 8rpx */
  padding: 10rpx 14rpx; /* 从 12rpx 改为 10rpx/14rpx */
  background: rgba(255, 255, 255, 0.05);
  border: 1rpx solid rgba(99, 102, 241, 0.15);
  border-radius: 12rpx;
  transition: all 0.3s ease;
  color: #ffffff;
  font-size: 15rpx;
}

.select-wrapper picker-view-column .picker-value:active {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.4);
}

.picker-icon {
  font-size: 16rpx; /* 从 18rpx 改为 16rpx */
  flex-shrink: 0;
}

/* ════════════════════════════════════════
   开关组件
════════════════════════════════════════ */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 10rpx; /* 从 12rpx 改为 10rpx */
  flex: 1;
}

.toggle-icon {
  font-size: 18rpx; /* 从 20rpx 改为 18rpx */
  flex-shrink: 0;
}

.toggle-title {
  font-size: 15rpx; /* 从 16rpx 改为 15rpx */
  font-weight: 600;
  color: #ffffff;
}

.toggle-text {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.toggle-desc {
  font-size: 11rpx; /* 从 12rpx 改为 11rpx */
  color: rgba(255, 255, 255, 0.45);
}

switch {
  transform: scale(0.8); /* 从 0.85 改为 0.8 */
  margin-right: -6rpx; /* 从 -8rpx 改为 -6rpx */
}

/* ════════════════════════════════════════
   底部按钮
════════════════════════════════════════ */
.modal-footer {
  display: flex;
  gap: 10rpx; /* 从 12rpx 改为 10rpx */
  padding: 16rpx 24rpx; /* 从 20rpx 改为 16rpx */
  border-top: 1rpx solid rgba(99, 102, 241, 0.15);
  background: rgba(15, 23, 42, 0.5);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx; /* 从 8rpx 改为 6rpx */
  padding: 12rpx 18rpx; /* 从 14rpx 改为 12rpx */
  border: none;
  border-radius: 12rpx;
  font-size: 15rpx; /* 从 16rpx 改为 15rpx */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.8rpx; /* 从 1rpx 改为 0.8rpx */
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.btn:active::before {
  opacity: 1;
}

.btn-icon {
  font-size: 18rpx; /* 从 20rpx 改为 18rpx */
  font-weight: 700;
}

.btn-cancel {
  background: linear-gradient(
    135deg,
    rgba(107, 114, 128, 0.2),
    rgba(75, 85, 99, 0.15)
  );
  border: 1rpx solid rgba(107, 114, 128, 0.3);
  color: #d1d5db;
}

.btn-cancel:active {
  background: linear-gradient(
    135deg,
    rgba(107, 114, 128, 0.35),
    rgba(75, 85, 99, 0.25)
  );
  border-color: rgba(107, 114, 128, 0.5);
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(107, 114, 128, 0.2);
}

.btn-save {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: 1rpx solid rgba(99, 102, 241, 0.3);
  color: #ffffff;
  box-shadow: 0 8rpx 20rpx rgba(99, 102, 241, 0.25);
}

.btn-save:active {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-color: rgba(99, 102, 241, 0.6);
  transform: scale(0.98);
  box-shadow: 0 12rpx 28rpx rgba(99, 102, 241, 0.35);
}

/* ════════════════════════════════════════
   滚动条美化
════════════════════════════════════════ */
.modal-body::-webkit-scrollbar {
  width: 6rpx;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3rpx;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3rpx;
  transition: background 0.3s ease;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

/* ════════════════════════════════════════
   响应式设计
════════════════════════════════════════ */
@media (max-width: 768px) {
  .modal-container {
    width: 92%;
    max-width: 100%;
    max-height: 85vh;
    border-radius: 24rpx;
  }

  .modal-header {
    padding: 18rpx 18rpx 14rpx;
  }

  .form-section {
    padding: 16rpx 18rpx;
    gap: 16rpx;
  }

  .form-module {
    padding: 14rpx;
    gap: 12rpx;
  }

  .form-group-row {
    grid-template-columns: 1fr;
    gap: 10rpx;
  }

  .modal-footer {
    padding: 14rpx 18rpx;
    gap: 8rpx;
  }

  .btn {
    padding: 10rpx 14rpx;
    font-size: 13rpx;
  }

  .module-icon {
    font-size: 20rpx;
  }

  .modal-icon {
    font-size: 26rpx;
  }

  .modal-title {
    font-size: 22rpx;
  }

  .modal-subtitle {
    font-size: 11rpx;
  }
}

/* ════════════════════════════════════════
   深色模式优化
════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: linear-gradient(
      135deg,
      rgba(10, 15, 30, 0.98) 0%,
      rgba(15, 20, 40, 0.98) 100%
    );
  }

  .form-module {
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.05) 0%,
      rgba(59, 130, 246, 0.03) 100%
    );
  }

  .form-input-wrapper:focus-within,
  .form-textarea:focus {
    box-shadow: 0 0 16rpx rgba(99, 102, 241, 0.2);
  }
}

/* ════════════════════════════════════════
   新增：警告提示样式
════════════════════════════════════════ */
.form-warning {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 14rpx;
  background: rgba(239, 68, 68, 0.1);
  border: 1rpx solid rgba(239, 68, 68, 0.3);
  border-radius: 8rpx;
  margin-top: 8rpx;
}

.warning-icon {
  font-size: 16rpx;
  flex-shrink: 0;
}

.warning-text {
  font-size: 13rpx;
  color: #fca5a5;
  font-weight: 500;
}

/* 已有样式下方新增 picker-value--empty 样式 */
.picker-value--empty {
  color: rgba(255, 255, 255, 0.3);
}
/* ════════════════════════════════════════
   打印样式
════════════════════════════════════════ */
@media print {
  .modal-overlay {
    display: none;
  }
}
</style>
