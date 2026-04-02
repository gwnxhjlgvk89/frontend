import { ref } from "vue";

export const _toastState = ref({
  visible: false,
  animating: false,
  title: "",
  icon: "none",
  duration: 1000,
  mask: false,
});

let _hideTimer = null;
let _animTimer = null;

export const showToast = (options = {}) => {
  const { title = "", icon = "none", duration = 1000, mask = false } = options;

  if (_hideTimer) clearTimeout(_hideTimer);
  if (_animTimer) clearTimeout(_animTimer);

  // 先挂载 DOM，animating=false 保持隐藏态
  _toastState.value = {
    visible: true,
    animating: false,
    title,
    icon,
    duration,
    mask,
  };

  // 30ms 后触发入场动画
  _animTimer = setTimeout(() => {
    _toastState.value.animating = true;
  }, 30);

  if (duration > 0) {
    _hideTimer = setTimeout(() => {
      hideToast();
    }, duration);
  }
};

export const hideToast = () => {
  if (_hideTimer) clearTimeout(_hideTimer);
  if (_animTimer) clearTimeout(_animTimer);

  // 触发出场动画
  _toastState.value.animating = false;

  // 等出场动画播完再卸载 DOM
  _animTimer = setTimeout(() => {
    _toastState.value.visible = false;
  }, 300);
};
