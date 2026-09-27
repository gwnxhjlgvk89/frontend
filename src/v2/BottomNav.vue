<template>
  <view class="bottom nav"
    ><view
      :class="['nav-item', active === 'home' && 'active']"
      @tap="go('home')"
      >发现社团</view
    ><view
      :class="['nav-item', active === 'profile' && 'active']"
      @tap="go('profile')"
      >我的报名</view
    ></view
  >
</template>
<script setup lang="ts">
defineProps<{ active: string }>();
function go(page: string) {
  uni.redirectTo({ url: `/pages/v2/${page}` });
}
</script>
