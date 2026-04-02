// utils/memory.js
/**
 * 获取小程序内存占用信息
 */
export function getMemoryInfo() {
  const memoryInfo = wx.getMemoryInfo();

  if (memoryInfo) {
    const { limitMB, currentMB } = memoryInfo;
    const usagePercent = ((currentMB / limitMB) * 100).toFixed(2);

    console.group("📊 小程序内存占用");
    console.log(`当前内存: ${currentMB} MB`);
    console.log(`内存限制: ${limitMB} MB`);
    console.log(`使用率: ${usagePercent}%`);
    console.log(`可用内存: ${(limitMB - currentMB).toFixed(2)} MB`);
    console.groupEnd();

    return {
      currentMB,
      limitMB,
      usagePercent: parseFloat(usagePercent),
      availableMB: limitMB - currentMB,
    };
  }

  return null;
}

/**
 * 实时监测内存（间隔检测）
 * @param {number} interval - 检测间隔（毫秒），默认 5000ms
 * @returns {function} 停止监测的函数
 */
export function monitorMemory(interval = 5000) {
  let timerId;
  let count = 0;

  const monitor = () => {
    count++;
    const info = getMemoryInfo();

    if (info && info.usagePercent > 80) {
      console.warn(`⚠️ [内存警告] 内存使用率已达 ${info.usagePercent}%`);
    }
  };

  timerId = setInterval(monitor, interval);
  console.log(`✅ 已启动内存监测，监测间隔: ${interval}ms`);

  // 返回停止函数
  return () => {
    clearInterval(timerId);
    console.log("✅ 已停止内存监测");
  };
}
