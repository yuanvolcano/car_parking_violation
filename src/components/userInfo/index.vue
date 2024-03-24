<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import avatarSrc from '@/assets/qiubilong.jpeg';
import { format } from '@/utils/common';

defineOptions({
  name: 'UserInfo',
});

interface IProps {
  headImgUrl: string;
  nickName: string;
  carInfo: string;
  driveYear: number;
}

const props = defineProps<IProps>();

const emits = defineEmits<{
  click: [event: Event];
}>();

const $style = useCssModule();

const mockCarText = '{carInfo} 驾龄{driveYear}年';

const realCarInfo = computed(() => {
  return format(mockCarText, { carInfo: props.carInfo, driveYear: props.driveYear });
});

const url = computed(() => {
  return props.headImgUrl || avatarSrc;
});

function handleClick(event: Event) {
  emits('click', event);
}
</script>

<template>
  <view :class="$style.infoContainer" @click="handleClick">
    <nut-avatar shape="round" size="normal" :class="$style.avatar">
      <img :src="url" alt="" />
    </nut-avatar>
    <view :class="$style.userInfo">
      <view :class="$style.name">{{ nickName }}</view>
      <view :class="$style.carInfo">{{ realCarInfo }}</view>
    </view>
  </view>
</template>

<style lang="scss" module>
.infoContainer {
  display: flex;
  flex: 1 1;
  align-items: center;
  padding: 20rpx;
  border-radius: 20rpx;

  .avatar {
    width: 64rpx;
    height: 64rpx;
  }

  .userInfo {
    margin-left: 20rpx;
    text-align: left;

    .name {
      font-size: 40rpx;
      line-height: 1.5;
      font-weight: 600;
      color: rgba(125, 125, 125, 1);
    }

    .carInfo {
      font-size: 24rpx;
      line-height: 1.5;
    }
  }
}
</style>
