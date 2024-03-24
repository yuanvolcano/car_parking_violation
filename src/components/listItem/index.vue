<script setup lang="ts">
import { RectRight } from '@nutui/icons-vue-taro';
import { computed } from 'vue';

interface IProps {
  prop: string;
  label: string;
  value: string;
}

const props = defineProps<IProps>();

const emits = defineEmits<{
  click: [val: { type: string }];
}>();

const realValue = computed(() => {
  return props.value || '去填写';
});

function handleClick() {
  emits('click', { type: props.prop });
}
</script>

<template>
  <view :class="$style.listItemContainer" @click="handleClick">
    <view :class="$style.listItemMain">
      <view :class="$style.label">{{ label }}</view>
      <text :class="$style.valueText">{{ realValue }}</text>
      <RectRight size="24rpx" />
    </view>
  </view>
</template>

<style lang="scss" module>
.listItemContainer {
  height: 72rpx;
  padding: 0 20rpx;
  color: #666;
  font-size: 24rpx;

  .listItemMain {
    height: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #d8d8d8;

    .label {
      flex: 1 1;
    }

    .valueText {
      margin-right: 20rpx;
    }
  }

  // &:last-child {
  //   border-bottom: none;
  // }
}
</style>
