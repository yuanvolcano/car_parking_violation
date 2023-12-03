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
  font-size: 32px;

  .filterItem {
    margin-right: 30px;
    padding: 10px;
    color: #666;

    &.active {
      border-radius: 10px;
      background: rgba(216, 216, 216, 0.2);
      color: #d8d8d8;
    }
  }
}
</style>
