import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimerStore = defineStore("timer", () => {
  // 存储所有活跃的定时器
  const timers = ref(new Map());

  // 存储已注册的页面和它们的定时器
  const pageTimers = ref(new Map());

  /**
   * 创建定时器
   * @param {string} pageId - 页面标识（如：home, detail）
   * @param {string} timerId - 定时器ID（页面内唯一）
   * @param {function} callback - 回调函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {number} 定时器ID
   */
  function createTimer(pageId, timerId, callback, delay) {
    if (!pageId || !timerId) {
      console.error("[Timer] pageId 和 timerId 不能为空");
      return null;
    }

    // 防止重复创建
    const fullId = `${pageId}_${timerId}`;
    if (timers.value.has(fullId)) {
      console.warn(`[Timer] 定时器 ${fullId} 已存在，先清理旧的`);
      clearTimer(pageId, timerId);
    }

    const timer = setInterval(callback, delay);

    // 保存定时器信息
    timers.value.set(fullId, {
      timer,
      pageId,
      timerId,
      callback,
      delay,
      createdAt: Date.now(),
    });

    // 记录页面的定时器
    if (!pageTimers.value.has(pageId)) {
      pageTimers.value.set(pageId, new Set());
    }
    pageTimers.value.get(pageId).add(timerId);

    console.log(
      `[Timer] 创建定时器: ${fullId}, 当前活跃数: ${timers.value.size}`,
    );

    return timer;
  }

  /**
   * 清理单个定时器
   * @param {string} pageId - 页面标识
   * @param {string} timerId - 定时器ID
   */
  function clearTimer(pageId, timerId) {
    const fullId = `${pageId}_${timerId}`;
    const timerInfo = timers.value.get(fullId);

    if (timerInfo) {
      clearInterval(timerInfo.timer);
      timers.value.delete(fullId);
      pageTimers.value.get(pageId)?.delete(timerId);
      console.log(
        `[Timer] 清理定时器: ${fullId}, 剩余活跃数: ${timers.value.size}`,
      );
    }
  }

  /**
   * 清理某个页面的所有定时器
   * @param {string} pageId - 页面标识
   */
  function clearPageTimers(pageId) {
    const pageTimer = pageTimers.value.get(pageId);
    if (pageTimer && pageTimer.size > 0) {
      console.log(
        `[Timer] 清理页面 ${pageId} 的所有定时器，数量: ${pageTimer.size}`,
      );

      pageTimer.forEach((timerId) => {
        const fullId = `${pageId}_${timerId}`;
        const timerInfo = timers.value.get(fullId);
        if (timerInfo) {
          clearInterval(timerInfo.timer);
          timers.value.delete(fullId);
        }
      });

      pageTimers.value.delete(pageId);
    }
  }

  /**
   * 清理所有定时器（退出登录时调用）
   */
  function clearAllTimers() {
    console.log(`[Timer] 清理所有定时器，当前活跃数: ${timers.value.size}`);

    timers.value.forEach((timerInfo) => {
      clearInterval(timerInfo.timer);
      console.log(
        `[Timer] 清理定时器: ${timerInfo.pageId}_${timerInfo.timerId}`,
      );
    });

    timers.value.clear();
    pageTimers.value.clear();

    console.log("[Timer] 所有定时器已清理");
  }

  /**
   * 获取活跃定时器数量
   */
  function getActiveTimerCount() {
    return timers.value.size;
  }

  /**
   * 获取页面的定时器列表（调试用）
   */
  function getPageTimers(pageId) {
    const pageTimer = pageTimers.value.get(pageId);
    return pageTimer ? Array.from(pageTimer) : [];
  }

  /**
   * 获取所有活跃定时器信息（调试用）
   */
  function getAllTimers() {
    return Array.from(timers.value.entries()).map(([fullId, info]) => ({
      fullId,
      ...info,
      runningTime: Date.now() - info.createdAt,
    }));
  }

  return {
    // 状态
    timers,
    pageTimers,
    // 方法
    createTimer,
    clearTimer,
    clearPageTimers,
    clearAllTimers,
    getActiveTimerCount,
    getPageTimers,
    getAllTimers,
  };
});
