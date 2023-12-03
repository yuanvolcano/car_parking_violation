<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import avatarSrc from '@/assets/qiubilong.jpeg';
import { format } from '@/utils/common.ts';

defineOptions({
  name: 'PersonInfo',
});

interface IProps {
  headImgUrl: string;
  nickName: string;
  carInfo: string;
  driveYear: number;
}

const props = defineProps<IProps>();

const $style = useCssModule();

const mockCarText = '{carInfo} 驾龄{driveYear}年';

const realCarInfo = computed(() => {
  return format(mockCarText, { carInfo: props.carInfo, driveYear: props.driveYear });
});

const url = computed(() => {
  return props.headImgUrl || avatarSrc;
});
</script>

<template>
  <view :class="$style.infoContainer">
    <nut-avatar :class="$style.avator" size="normal">
      <img :src="url" alt="" />
    </nut-avatar>
    <view :class="$style.personInfo">
      <view :class="$style.name">{{ nickName }}</view>
      <view :class="$style.carInfo">{{ realCarInfo }}</view>
    </view>
  </view>
</template>

<style lang="scss" module>
.infoContainer {
  display: flex;
  flex: 1 1;
  margin-right: 20px;
  align-items: center;
  padding: 10px;
  border-radius: 10px;

  .avator {
  }

  .personInfo {
    margin-left: 20px;
    text-align: left;

    .name {
      font-size: 40px;
      line-height: 1.5;
      font-weight: 600;
      color: rgba(125, 125, 125, 1);
    }
    .carInfo {
      font-size: 20px;
      line-height: 1.5;
    }
  }
}
</style>
