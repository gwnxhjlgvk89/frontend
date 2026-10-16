<template>
  <view class="suggest">
    <view :class="['input-box', { focus: focused }]"
      ><input
        :value="modelValue"
        :placeholder="placeholder"
        placeholder-class="placeholder"
        maxlength="64"
        @input="input"
        @focus="focused = true"
        @blur="focused = false"
    /></view>
    <!-- Not tied to focus: on phones the keyboard covers the list, and closing the
         keyboard blurs the input, so the list must stay until a value is picked. -->
    <view v-if="matches.length" class="list">
      <view
        v-for="o in matches"
        :key="o.name"
        class="item row between"
        hover-class="pressed"
        @tap="pick(o.name)"
        ><text class="grow ellipsis">{{ o.name }}</text
        ><text class="caption num">{{ o.count }} 人</text></view
      >
    </view>
  </view>
</template>
<script setup lang="ts">
// Suggests existing majors/classes while typing, so a typo is less likely to
// become a value that no club restriction or filter will ever match.
import { computed, ref } from "vue";
import { matchOptions } from "./format";
import type { LabelOption } from "./types";
const props = defineProps<{
    modelValue: string;
    options: LabelOption[];
    placeholder?: string;
  }>(),
  emit = defineEmits(["update:modelValue"]);
const focused = ref(false);
const matches = computed(() => matchOptions(props.options, props.modelValue));
function input(e: any) {
  emit("update:modelValue", e.detail.value);
}
// Picking fills an exact existing value, which empties the suggestions.
function pick(name: string) {
  emit("update:modelValue", name);
}
</script>
<style scoped>
.list {
  margin-top: 8rpx;
  border-radius: 16rpx;
  background: var(--c-surface);
  border: 1rpx solid var(--c-line);
  overflow: hidden;
}
.item {
  gap: 16rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: var(--c-ink);
}
.item + .item {
  border-top: 1rpx solid var(--c-line);
}
</style>
