import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { request, setToken, ApiError } from "../src/v2/api";
let token = "first";
let sent: any;
beforeEach(() => {
  token = "first";
  vi.stubGlobal("uni", {
    getStorageSync: () => token,
    setStorageSync: (_k: string, v: string) => (token = v),
    removeStorageSync: vi.fn(),
    $emit: vi.fn(),
    reLaunch: vi.fn(),
    request: vi.fn((options) => (sent = options)),
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("a late 401 from the previous account cannot log out a new account", async () => {
  const result = request("/bootstrap");
  setToken("second");
  sent.success({
    statusCode: 401,
    data: { error: { code: "SESSION_EXPIRED", message: "expired" } },
  });
  await expect(result).rejects.toBeInstanceOf(ApiError);
  expect(uni.removeStorageSync).not.toHaveBeenCalled();
  expect(uni.reLaunch).not.toHaveBeenCalled();
});

it("coalesces homepage callers through one jittered network retry", async () => {
  vi.useFakeTimers();
  const first = request("/bootstrap");
  const second = request("/bootstrap");
  expect(first).toBe(second);
  sent.fail();
  await vi.advanceTimersByTimeAsync(499);
  expect(uni.request).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(501);
  expect(uni.request).toHaveBeenCalledTimes(2);
  sent.success({ statusCode: 200, data: { data: { clubs: [] } } });
  await expect(first).resolves.toEqual({ clubs: [] });
  await expect(second).resolves.toEqual({ clubs: [] });
});

it("stops after one retry and preserves the session for manual recovery", async () => {
  vi.useFakeTimers();
  const result = request("/bootstrap");
  const rejected = expect(result).rejects.toMatchObject({
    code: "NETWORK_ERROR",
  });
  sent.fail();
  await vi.advanceTimersByTimeAsync(1000);
  sent.fail();
  await rejected;
  await vi.advanceTimersByTimeAsync(2000);
  expect(uni.request).toHaveBeenCalledTimes(2);
  expect(uni.removeStorageSync).not.toHaveBeenCalled();
});

it("cancels a pending read retry after switching accounts", async () => {
  vi.useFakeTimers();
  const result = request("/bootstrap");
  const rejected = expect(result).rejects.toBeInstanceOf(ApiError);
  sent.fail();
  await vi.advanceTimersByTimeAsync(100);
  setToken("second");
  await vi.advanceTimersByTimeAsync(1000);
  await rejected;
  expect(uni.request).toHaveBeenCalledTimes(1);
});

it.each(["/auth/login", "/enrollment"])(
  "never automatically replays %s",
  async (path) => {
    vi.useFakeTimers();
    const result = request(path, "POST", {});
    const rejected = expect(result).rejects.toBeInstanceOf(ApiError);
    sent.fail();
    await rejected;
    await vi.advanceTimersByTimeAsync(2000);
    expect(uni.request).toHaveBeenCalledTimes(1);
  },
);

it("does not retry HTTP failures", async () => {
  vi.useFakeTimers();
  const result = request("/bootstrap");
  sent.success({ statusCode: 503, data: { error: { code: "UNAVAILABLE" } } });
  await expect(result).rejects.toMatchObject({ status: 503 });
  await vi.advanceTimersByTimeAsync(2000);
  expect(uni.request).toHaveBeenCalledTimes(1);
});

it("carries the server's opening countdown on NOT_OPEN", async () => {
  const result = request("/enrollment", "POST", { club_id: 1 });
  sent.success({
    statusCode: 409,
    data: {
      error: { code: "NOT_OPEN", message: "报名还没开始", retry_after_ms: 180 },
    },
  });
  await expect(result).rejects.toMatchObject({
    code: "NOT_OPEN",
    retryAfterMs: 180,
  });
  expect(uni.request).toHaveBeenCalledTimes(1);
});
