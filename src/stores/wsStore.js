// stores/wsStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { config } from "@/config/index.js";

const WS_URL = config.wsURL;

export const useWsStore = defineStore("ws", () => {
  const socketTask = ref(null);
  const isConnected = ref(false);
  let heartbeatTimer = null;
  const HEARTBEAT_INTERVAL = 10000;
  let isConnecting = false; // ✅ 新增：连接中标志位

  // ── 事件回调注册表 ──────────────────────────────────────────
  // { "quota_update": [fn1, fn2], "select_success": [fn1] }
  const listeners = {};

  /** 订阅某个事件，返回取消订阅函数 */
  const on = (event, callback) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);

    // 返回 off 函数，方便组件 onUnmounted 时清理
    return () => off(event, callback);
  };

  /** 取消订阅 */
  const off = (event, callback) => {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((fn) => fn !== callback);
  };

  /** 内部派发，onMessage 调用 */
  const emit = (event, payload) => {
    listeners[event]?.forEach((fn) => fn(payload));
  };

  // ── 心跳 ────────────────────────────────────────────────────
  const startHeartbeat = () => {
    stopHeartbeat();
    heartbeatTimer = setInterval(() => {
      send({ event: "ping" }); // ✅ 改为 event 字段
      console.log("[WS] 客户端发送心跳ping");
    }, HEARTBEAT_INTERVAL);
  };

  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  };

  // ── 连接 ────────────────────────────────────────────────────
  const connect = (url = WS_URL) => {
    // ✅ 同时判断"已连接"和"连接中"
    if (isConnected.value || isConnecting) return;
    isConnecting = true; // ✅ 立即锁住，防止重复进入

    const token = uni.getStorageSync("token");
    url = `${url}?token=${token}`;

    const task = uni.connectSocket({
      url,
      complete: () => {},
    });

    task.onOpen(() => {
      isConnected.value = true;
      isConnecting = false; // ✅ 连接成功，解锁
      console.log("[WS] 已连接");
      startHeartbeat();
    });

    task.onMessage((res) => {
      // ── 解析消息 ──────────────────────────────────────────
      let msg;
      try {
        msg = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      } catch {
        console.warn("[WS] 消息解析失败:", res.data);
        return;
      }

      const { event, ...payload } = msg;
      if (!event) return;

      // ── 内置事件处理 ──────────────────────────────────────
      switch (event) {
        // 名额变化 → 通知所有订阅者更新 UI
        // ❌ 移出去：业务逻辑交给页面订阅
        // case "quota_update"
        // case "select_success"

        // 服务端 pong 回包（如有）
        case "pong":
          console.log("[WS] 客户端收到心跳pong");
          break;

        default:
          break;
      }

      // 无论内置逻辑是否处理，都向外派发，让页面自行订阅
      emit(event, payload);
    });

    task.onClose(() => {
      isConnected.value = false;
      isConnecting = false; // ✅ 报错时也解锁
      socketTask.value = null;
      stopHeartbeat();
      console.log("[WS] 已断开");
    });

    task.onError((err) => {
      isConnected.value = false;
      isConnecting = false; // ✅ 报错时也解锁
      socketTask.value = null;
      stopHeartbeat();
      // 先 close 再清引用
      try {
        task.close({ code: 1000 });
      } catch (_) {}
      isConnected.value = false;
      socketTask.value = null;
      console.error("[WS] 错误:", err);
    });

    socketTask.value = task;
  };

  // ── 断开 ────────────────────────────────────────────────────
  // ✅ 修复
  const disconnect = () => {
    stopHeartbeat();
    if (socketTask.value) {
      socketTask.value.close({ code: 1000, reason: "主动断开" });
      // 不要在这里清空，让 onClose 回调来清
    }
  };

  // ── 发送 ────────────────────────────────────────────────────
  const send = (data) => {
    if (!isConnected.value || !socketTask.value) return;
    socketTask.value.send({
      data: typeof data === "string" ? data : JSON.stringify(data),
    });
  };

  return { isConnected, connect, disconnect, send, on, off };
});
