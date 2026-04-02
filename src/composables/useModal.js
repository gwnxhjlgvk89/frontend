// composables/useModal.js
import { ref, reactive } from "vue";

// 全局单例状态，挂在 App.vue 里渲染一个实例就够了
export const modalState = reactive({
  visible: false,
  title: "提示",
  content: "",
  showCancel: true,
  cancelText: "取消",
  confirmText: "确定",
  confirmColor: "",
  maskClosable: false,
  icon: "auto",
});

let _resolve = null;

/**
 * 用法与 uni.showModal 完全一致
 *
 * showModal({
 *   title: '退出确认',
 *   content: '确定要退出吗？',
 *   confirmText: '确定退出',
 *   confirmColor: '#ef4444',
 *   success(res) {
 *     if (res.confirm) { ... }
 *   }
 * })
 */
export const showModal = (options = {}) => {
  const {
    title = "提示",
    content = "",
    showCancel = true,
    cancelText = "取消",
    confirmText = "确定",
    confirmColor = "",
    maskClosable = false,
    icon = "auto",
    success,
    fail,
    complete,
  } = options;

  // 写入状态
  Object.assign(modalState, {
    visible: true,
    title,
    content,
    showCancel,
    cancelText,
    confirmText,
    confirmColor,
    maskClosable,
    icon,
  });

  // 返回 Promise，同时支持 success 回调
  return new Promise((resolve) => {
    _resolve = (res) => {
      modalState.visible = false;
      resolve(res);
      success?.(res);
      complete?.(res);
    };
  });
};

/** 供组件内部调用 */
export const _modalConfirm = () => _resolve?.({ confirm: true, cancel: false });
export const _modalCancel = () => _resolve?.({ confirm: false, cancel: true });
