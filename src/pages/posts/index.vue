<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed, ref } from 'vue';

import { apiArticleSave, FILE_UPLOAD } from '@/api';
import { useUserStoreHook } from '@/stores/modules/user';

defineOptions({
  name: 'Posts',
});

const userStore = useUserStoreHook();

const placeholder = '向大家分享违停的时间、地方，以及你的感受吧......';

const postContent = ref('');

const publish = '发表';

const uploadRef = ref(null);

const fileList = ref<string[]>([]);

const disabledSubmitBtn = computed(() => {
  return !fileList.value?.length || !postContent.value.length;
});

function beforeUpload(taroUploadFile, options) {
  taroUploadFile({
    url: FILE_UPLOAD,
    header: {
      token: userStore.getToken,
    },
    filePath: options.taroFilePath,
    fileType: options.fileType,
    formData: options.formData,
    name: options.name,
    success(response: { errMsg; statusCode; data }) {
      if (options.xhrState == response.statusCode) {
        options.onSuccess?.(response, options);
        console.log('~~ ', response);
        const data = JSON.parse(response.data) || { data: '' };
        fileList.value.push(data.data);
      } else {
        options.onFailure?.(response, options);
      }
    },
    fail(e) {
      options.onFailure?.(e, options);
    },
  });
}

async function handleSubmit() {
  const params = {
    title: '',
    content: postContent.value,
    location: userStore.getUser.location,
    latitude: userStore.getLocation?.latitude || 0,
    longitude: userStore.getLocation?.longitude || 0,
    fileUrlList: fileList.value,
  };
  await apiArticleSave(params);
  Taro.navigateBack();
}
</script>

<template>
  <view :class="$style.postsContainer">
    <nut-textarea
      v-model="postContent"
      limit-show
      :class="$style.content"
      :placeholder="placeholder"
      :rows="2"
      :autofocus="true"
      :max-length="100"
    />

    <nut-uploader
      ref="uploadRef"
      multiple
      name="uploadFile"
      :class="$style.uploadList"
      :maximum="9"
      :media-typ="['image']"
      :before-xhr-upload="beforeUpload"
    />

    <view :class="$style.submitBtn">
      <nut-button type="success" :disabled="disabledSubmitBtn" @click="handleSubmit">
        {{ publish }}
      </nut-button>
    </view>
  </view>
</template>

<style lang="scss" module>
.postsContainer {
  height: 100%;
  padding: 0 20rpx;
  background-color: #e2e0e0;
  overflow: auto;

  .uploadList {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    background: #d8d8d8;
    border-radius: 8rpx;
  }

  .submitBtn {
    margin-top: 20rpx;
  }
}
</style>
