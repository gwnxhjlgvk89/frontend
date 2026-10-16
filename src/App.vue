<script setup lang="ts">
import { onShow, onHide, onLaunch, onPageNotFound } from "@dcloudio/uni-app";
import { useSession } from "./v2/session";
import { getToken } from "./v2/api";
onLaunch(() => {
  uni.removeStorageSync("password");
  uni.removeStorageSync("profile");
  uni.removeStorageSync("token");
  const manager = uni.getUpdateManager();
  manager.onUpdateReady(() =>
    uni.showModal({
      title: "新版本已准备好",
      content: "更新后使用最新报名功能。",
      showCancel: false,
      success: () => manager.applyUpdate(),
    }),
  );
});
onShow(() => {
  if (getToken())
    useSession()
      .resume()
      .catch(() => {});
});
onHide(() => useSession().suspend());
// Old links (official-account menu, articles, shared cards) still point at v1
// paths such as pages/login/login; send them to the entry page instead of a blank one.
onPageNotFound(() => uni.reLaunch({ url: "/pages/v2/login" }));
</script>
<style lang="scss">
@import "./v2/theme.scss";
</style>
