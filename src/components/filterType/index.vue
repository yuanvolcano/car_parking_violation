<script setup lang="ts">
import { useCssModule } from 'vue';

import { ILabelValue } from '../../types/types';

defineOptions({
  name: 'filterType',
});

interface IProps {
  modelValue?: string | number;
}

defineProps<IProps>();

const emits = defineEmits<{
  'update:modelValue': [val: string | number];
}>();
const $style = useCssModule();

const list: ILabelValue[] = [
  {
    label: '距离优先',
    value: 1,
  },
  {
    label: '时间排序',
    value: 2,
  },
];

function clickHandle(item: ILabelValue) {
  emits('update:modelValue', item.value);
}
</script>

<template>
  <view :class="$style.filterTypeContainer">
    <view
      v-for="typeItem in list"
      :key="typeItem.value"
      :class="{ [$style.filterItem]: true, [$style.active]: modelValue === typeItem.value }"
      @click="clickHandle(typeItem)"
    >
      {{ typeItem.label }}
    </view>
  </view>
</template>

<style lang="scss" module>
.filterTypeContainer {
  display: flex;
  font-size: 32rpx;

  .filterItem {
    padding: 10rpx 15rpx;
    color: #666;

    &:first-child {
      margin-right: 20rpx;
    }

    &.active {
      border-radius: 10rpx;
      background: rgba(216, 216, 216, 0.2);
      color: #d8d8d8;
    }
  }
}
</style>
