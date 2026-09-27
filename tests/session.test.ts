import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
const mock = vi.hoisted(() => ({
  token: "account-a",
  request: vi.fn(),
  events: new Map<string, Function>(),
  opened: undefined as Function | undefined,
}));
vi.mock("../src/v2/api", () => ({
  getToken: () => mock.token,
  request: mock.request,
  WS: "ws://test/ws",
  setToken: (v: string) => {
    mock.token = v;
  },
  clearSession: () => {
    mock.token = "";
    mock.events.get("v2-session-clear")?.();
  },
}));
import { useSession } from "../src/v2/session";
const bootstrap = (version = 2) => ({
  user: { id: 1, name: "Synthetic", role: "student" },
  activity: { version: 1, configured_state: "draft" },
  enrollment: null,
  favorites: [],
  clubs: [{ id: 1, name: "Club", allowed_majors: [] }],
  quotas: [{ club_id: 1, remaining: 10, version }],
  server_time: new Date().toISOString(),
});
let socket: any;
beforeEach(() => {
  setActivePinia(createPinia());
  vi.useFakeTimers();
  mock.token = "account-a";
  mock.request.mockReset();
  mock.events.clear();
  socket = {
    onOpen: vi.fn((fn) => {
      mock.opened = fn;
      Promise.resolve().then(() => fn());
    }),
    onMessage: vi.fn((fn) => {
      Promise.resolve().then(() =>
        fn({ data: JSON.stringify({ event: "resync" }) }),
      );
    }),
    onClose: vi.fn(),
    onError: vi.fn(),
    close: vi.fn(),
    send: vi.fn(),
  };
  vi.stubGlobal("uni", {
    $on: (name: string, fn: Function) => mock.events.set(name, fn),
    connectSocket: vi.fn(() => socket),
    reLaunch: vi.fn(),
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("session and real-time correctness", () => {
  it("does not repopulate an account after session invalidation", async () => {
    let resolve!: Function;
    mock.request.mockReturnValue(new Promise((r) => (resolve = r)));
    const s = useSession();
    const pending = s.refresh(true);
    mock.token = "";
    mock.events.get("v2-session-clear")?.();
    resolve(bootstrap());
    await pending;
    expect(s.user).toBeNull();
    expect(s.clubs).toEqual([]);
  });
  it("ignores a delayed snapshot after a newer quota event", async () => {
    mock.request.mockResolvedValue(bootstrap());
    const s = useSession();
    await s.refresh(true);
    s.applyQuotas([{ club_id: 1, remaining: 7, version: 5 }]);
    mock.request.mockResolvedValue(bootstrap(3));
    await s.refresh(true);
    expect(s.clubs[0].remaining).toBe(7);
    expect(s.clubs[0].version).toBe(5);
    s.applyQuotas([{ club_id: 1, remaining: 9, version: 4 }]);
    expect(s.clubs[0].remaining).toBe(7);
  });
  it("deduplicates concurrent page resumes and clears every timer when hidden", async () => {
    mock.request.mockImplementation((path: string) =>
      Promise.resolve(
        path === "/bootstrap" ? bootstrap() : { ticket: "synthetic-ticket" },
      ),
    );
    const s = useSession();
    await Promise.all([s.resume(), s.resume()]);
    expect(uni.connectSocket).toHaveBeenCalledTimes(1);
    expect(
      mock.request.mock.calls.filter((x) => x[0] === "/bootstrap"),
    ).toHaveLength(1);
    mock.opened?.();
    expect(vi.getTimerCount()).toBe(3);
    s.suspend();
    expect(vi.getTimerCount()).toBe(0);
    expect(socket.close).toHaveBeenCalledTimes(1);
  });
});

it("accepts compact quota deltas and ignores older versions", async () => {
  mock.request.mockImplementation((path: string) =>
    Promise.resolve(
      path === "/bootstrap" ? bootstrap() : { ticket: "synthetic-ticket" },
    ),
  );
  const s = useSession();
  await s.resume();
  const message = socket.onMessage.mock.calls[0][0];
  message({
    data: JSON.stringify({
      event: "quota_delta",
      rows: [
        [1, 8, 6],
        [2, 9, 6],
      ],
    }),
  });
  expect(s.clubs[0].remaining).toBe(8);
  expect(s.clubs[0].version).toBe(6);
  message({
    data: JSON.stringify({
      event: "quota_delta",
      rows: [
        [1, 9, 5],
        [1, "invalid", 7],
      ],
    }),
  });
  expect(s.clubs[0].remaining).toBe(8);
  s.suspend();
});

it("reuses fresh page data and refreshes only enrollment on a personal event", async () => {
  mock.request.mockImplementation((path: string) =>
    Promise.resolve(
      path === "/bootstrap"
        ? bootstrap()
        : path === "/enrollment"
          ? { club_id: 1 }
          : { ticket: "synthetic-ticket" },
    ),
  );
  const s = useSession();
  await s.resume();
  await vi.advanceTimersByTimeAsync(2000);
  await s.resume();
  expect(
    mock.request.mock.calls.filter((x) => x[0] === "/bootstrap"),
  ).toHaveLength(1);
  socket.onMessage.mock.calls[0][0]({
    data: JSON.stringify({ event: "enrollment" }),
  });
  await Promise.resolve();
  expect(mock.request).toHaveBeenCalledWith("/enrollment");
  expect(s.enrollment?.club_id).toBe(1);
  expect(
    mock.request.mock.calls.filter((x) => x[0] === "/bootstrap"),
  ).toHaveLength(1);
  s.suspend();
});

it("does not apply an enrollment response after switching accounts", async () => {
  const s = useSession();
  let resolve!: Function;
  mock.request.mockReturnValue(new Promise((r) => (resolve = r)));
  const pending = s.refreshEnrollment();
  mock.token = "account-b";
  resolve({ club_id: 1 });
  await pending;
  expect(s.enrollment).toBeNull();
});

it("falls back to HTTP when the socket handshake is delayed", async () => {
  socket.onOpen.mockImplementation((fn) => {
    mock.opened = fn;
  });
  socket.onMessage.mockImplementation(() => {});
  mock.request.mockImplementation((path: string) =>
    Promise.resolve(
      path === "/bootstrap" ? bootstrap() : { ticket: "synthetic-ticket" },
    ),
  );
  const s = useSession();
  const resume = s.resume();
  await vi.advanceTimersByTimeAsync(1500);
  await resume;
  expect(s.user?.id).toBe(1);
  expect(s.connected).toBe(false);
  expect(
    mock.request.mock.calls.filter((x) => x[0] === "/bootstrap"),
  ).toHaveLength(1);
  s.suspend();
  expect(vi.getTimerCount()).toBe(0);
});

it("cancels pending connection waits on hide without starting a new HTTP request", async () => {
  socket.onOpen.mockImplementation(() => {});
  socket.onMessage.mockImplementation(() => {});
  mock.request.mockResolvedValue({ ticket: "synthetic-ticket" });
  const s = useSession();
  const resume = s.resume();
  await Promise.resolve();
  await Promise.resolve();
  s.suspend();
  await resume;
  expect(
    mock.request.mock.calls.filter((x) => x[0] === "/bootstrap"),
  ).toHaveLength(0);
  expect(vi.getTimerCount()).toBe(0);
});
