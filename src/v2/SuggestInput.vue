<template>
  <view class="suggest">
    <view :class="['input-box', { focus: focused }]"
      ><input
        :value="modelValue"
        :placeholder="placeholder"
        placeholder-class="placeholder"
        maxlength="64"
        @input="input"
        @focus="focus"
        @blur="blur"
    /></view>
    <view v-if="focused && matches.length" class="list">
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
let timer: ReturnType<typeof setTimeout> | undefined;
const matches = computed(() => matchOptions(props.options, props.modelValue));
function input(e: any) {
  emit("update:modelValue", e.detail.value);
}
function focus() {
  clearTimeout(timer);
  focused.value = true;
}
function blur() {
  // The input blurs before a tap on a suggestion lands; keep the list briefly.
  timer = setTimeout(() => (focused.value = false), 200);
}
function pick(name: string) {
  clearTimeout(timer);
  emit("update:modelValue", name);
  focused.value = false;
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
