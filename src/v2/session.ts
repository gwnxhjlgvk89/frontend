import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { clearSession, getToken, request, setToken, WS } from "./api";
import type {
  Activity,
  Bootstrap,
  Club,
  Enrollment,
  Quota,
  User,
} from "./types";

export const useSession = defineStore("v2-session", () => {
  const user = ref<User | null>(null),
    clubs = ref<Club[]>([]),
    activity = ref<Activity | null>(null),
    enrollment = ref<Enrollment | null>(null),
    favorites = ref<number[]>([]);
  const loading = ref(false),
    connected = ref(false),
    offset = ref(0),
    clock = ref(Date.now());
  let socket: UniApp.SocketTask | null = null,
    heartbeat: ReturnType<typeof setInterval> | undefined,
    syncTimer: ReturnType<typeof setTimeout> | undefined,
    clockTimer: ReturnType<typeof setInterval> | undefined;
  let generation = 0,
    active = false,
    connecting = false,
    refreshTask: Promise<void> | null = null,
    lastRefresh = 0;
  const isAdmin = computed(
    () => user.value?.role !== "student" && !!user.value,
  );
  const now = computed(() => clock.value + offset.value);
  const canSelect = computed(
    () =>
      activity.value?.configured_state === "published" &&
      now.value >= Date.parse(activity.value.starts_at || "") &&
      now.value < Date.parse(activity.value.ends_at || ""),
  );
  const canCancel = computed(
    () =>
      activity.value?.configured_state === "published" &&
      activity.value.allow_cancel &&
      now.value >= Date.parse(activity.value.starts_at || "") &&
      now.value < Date.parse(activity.value.cancel_until || "") &&
      enrollment.value?.source === "normal",
  );
  const activityLabel = computed(() =>
    !activity.value
      ? "正在获取活动"
      : activity.value.configured_state === "paused"
        ? "报名已暂停"
        : activity.value.configured_state === "draft"
          ? "活动筹备中"
          : canSelect.value
            ? "报名进行中"
            : now.value < Date.parse(activity.value.starts_at || "")
              ? "即将开放"
              : "报名已结束",
  );
  function applyQuotas(rows: Quota[]) {
    const byId = new Map(clubs.value.map((c) => [c.id, c]));
    for (const q of rows) {
      const c = byId.get(q.club_id);
      if (c && q.version >= (c.version || 0)) {
        c.remaining = q.remaining;
        c.version = q.version;
      }
    }
  }
  async function refresh(force = false) {
    if (refreshTask) return refreshTask;
    if (!force && Date.now() - lastRefresh < 1000) return;
    loading.value = true;
    const startedToken = getToken();
    const requestedAt = Date.now();
    const task = request<Bootstrap>("/bootstrap")
      .then((data) => {
        if (startedToken !== getToken()) return;
        user.value = data.user;
        activity.value = data.activity;
        enrollment.value = data.enrollment;
        favorites.value = data.favorites;
        const previous = new Map(clubs.value.map((c) => [c.id, c]));
        clubs.value = data.clubs.map((c) => ({
          ...c,
          remaining: previous.get(c.id)?.remaining || 0,
          version: previous.get(c.id)?.version || 0,
        }));
        applyQuotas(data.quotas);
        offset.value =
          Date.parse(data.server_time) - (requestedAt + Date.now()) / 2;
        lastRefresh = Date.now();
      })
      .finally(() => {
        if (refreshTask === task) {
          loading.value = false;
          refreshTask = null;
        }
      });
    refreshTask = task;
    return task;
  }
  function schedule() {
    clearTimeout(syncTimer);
    if (!active) return;
    syncTimer = setTimeout(
      async () => {
        try {
          applyQuotas(await request<Quota[]>("/clubs/quotas"));
          if (!connected.value) await connect();
        } catch {}
        schedule();
      },
      connected.value ? 60000 : 10000 + Math.random() * 5000,
    );
  }
  async function connect() {
    if (!active || socket || connecting || !getToken()) return;
    connecting = true;
    const gen = generation;
    try {
      const { ticket } = await request<{ ticket: string }>(
        "/auth/ws-ticket",
        "POST",
      );
      if (!active || gen !== generation) return;
      const task = uni.connectSocket({
        url: `${WS}?ticket=${encodeURIComponent(ticket)}`,
        complete() {},
      });
      socket = task;
      task.onOpen(() => {
        if (gen !== generation) return;
        connected.value = true;
        clearInterval(heartbeat);
        heartbeat = setInterval(
          () => task.send({ data: JSON.stringify({ event: "ping" }) }),
          20000,
        );
        schedule();
      });
      task.onMessage((res) => {
        if (gen !== generation) return;
        try {
          const msg = JSON.parse(String(res.data));
          if (msg.event === "quota") applyQuotas([msg]);
          else if (msg.event === "quotas") applyQuotas(msg.items || []);
          else if (
            ["resync", "catalog", "activity", "enrollment"].includes(msg.event)
          )
            refresh(true).catch(() => {});
        } catch {}
      });
      const closed = () => {
        if (gen !== generation || socket !== task) return;
        socket = null;
        connected.value = false;
        clearInterval(heartbeat);
        schedule();
      };
      task.onClose(closed);
      task.onError(() => {
        task.close({});
        closed();
      });
    } finally {
      if (gen === generation) connecting = false;
    }
  }
  async function resume() {
    if (!getToken()) return;
    active = true;
    if (!clockTimer)
      clockTimer = setInterval(() => {
        clock.value = Date.now();
      }, 1000);
    try {
      await refresh();
      await connect();
    } finally {
      schedule();
    }
  }
  function suspend() {
    active = false;
    generation++;
    connecting = false;
    clearInterval(heartbeat);
    clearInterval(clockTimer);
    clockTimer = undefined;
    clearTimeout(syncTimer);
    const old = socket;
    socket = null;
    old?.close({});
    connected.value = false;
  }
  function reset() {
    suspend();
    user.value = null;
    clubs.value = [];
    activity.value = null;
    enrollment.value = null;
    favorites.value = [];
    lastRefresh = 0;
    refreshTask = null;
    loading.value = false;
  }
  async function logout() {
    try {
      await request("/auth/logout", "POST");
    } finally {
      clearSession();
      reset();
      uni.reLaunch({ url: "/pages/v2/login" });
    }
  }
  async function login(username: string, password: string) {
    const data = await request<{ token: string; user: User }>(
      "/auth/login",
      "POST",
      { username, password },
    );
    setToken(data.token);
    user.value = data.user;
    await resume();
  }
  uni.$on("v2-session-clear", reset);
  return {
    user,
    clubs,
    activity,
    enrollment,
    favorites,
    loading,
    connected,
    isAdmin,
    now,
    canSelect,
    canCancel,
    activityLabel,
    refresh,
    resume,
    suspend,
    logout,
    login,
    applyQuotas,
  };
});
