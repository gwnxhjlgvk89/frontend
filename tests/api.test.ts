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
afterEach(() => vi.unstubAllGlobals());
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
