<script setup lang="ts">
import Taro from '@tarojs/taro';
import { watch } from 'vue';

import { useUserStoreHook } from '@/stores/modules/user';

defineOptions({
  name: 'empty',
});

const userStore = useUserStoreHook();

console.log('~~ userStore', userStore);

watch(
  () => userStore.getToken,
  newVal => {
    console.log('~~ _newValue', newVal);
    if (newVal) {
      Taro.navigateTo({
        url: '/pages/home/index',
      });
    }
  },
  {
    immediate: true,
    flush: 'post',
  },
);
</script>

<template>
  <view />
</template>

<style lang="scss" scoped></style>
