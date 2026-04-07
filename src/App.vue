<script>
export default {
  onLaunch: function () {
    wx.loadFontFace({
      family: "Inter",
      global: true,
      source:
        "https://cdn.jsdelivr.net/npm/inter-ui@4.1.1/web/Inter-Bold.woff2",
      success: () => console.log("字体加载成功"),
    });
    wx.loadFontFace({
      family: "Source Han Sans CN",
      global: true,
      source:
        "https://cdn.jsdelivr.net/npm/source-han-sans-cn@1.0.0/SourceHanSansCN-Medium.otf",
      success: () => console.log("字体加载成功"),
    });
    // 全局启用分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    // uni.clearStorageSync();
    console.log("App Hide");
  },
  onUnload: function () {
    uni.$off("themeChange");
  },
};
</script>
<style>
page {
  font-family: "Inter", "Source Han Sans CN", sans-serif;
}
</style>
