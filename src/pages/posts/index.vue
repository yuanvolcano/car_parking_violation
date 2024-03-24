<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'Posts',
});

const text = '向大家分享违停的时间、地方，以及你的感受吧......';

const publish = '发表';

const uploadUrl = '/uploader';

const fileList = ref([
  'https://c-ssl.duitang.com/uploads/blog/202209/19/20220919181424_308ce.jpg',
  'https://c-ssl.duitang.com/uploads/blog/202209/19/20220919181424_3fa07.jpg',
]);

function handleSubmit() {}
</script>

<template>
  <view :class="$style.postsContainer">
    <view :class="$style.text">
      {{ text }}
    </view>

    <nut-uploader v-model:file-list="fileList" :url="uploadUrl" :maximum="9" :media-typ="['image']" multiple />

    <nut-button type="success" :disabled="!fileList.length" @click="handleSubmit">{{ publish }}</nut-button>
  </view>
</template>

<style lang="scss" module>
.postsContainer {
  width: 100%;
  height: 100%;
  padding: 0 20rpx;
  background-color: #e2e0e0;

  .text {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    font-size: 24rpx;
    color: #666;
  }

  .upload {
    width: 160rpx;
    height: 160rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d8d8d8;
    border-radius: 8rpx;
  }
}
</style>
