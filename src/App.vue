<script setup lang="ts">
import { onShow, onHide, onLaunch } from "@dcloudio/uni-app";
import { useSession } from "./v2/session";
import { getToken } from "./v2/api";
onLaunch(() => {
  uni.removeStorageSync("password");
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
</script>
<style lang="scss">
@import "./v2/theme.scss";
</style>
