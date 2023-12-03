<script setup lang="ts">
import { Addfollow } from '@nutui/icons-vue-taro';
import { pick } from 'lodash-unified';
import { computed, useCssModule } from 'vue';

import avatarSrc from '@/assets/qiubilong.jpeg';
import PersonInfo from '@/components/personInfo/index.vue';
import { IPostItem } from 'src/types/types';

defineOptions({
  name: 'PostItem',
});

const props = defineProps<IPostItem>();

const personInfo = computed(() => {
  return pick(props, ['headImgUrl', 'nickName', 'carInfo', 'driveYear']);
});

const $style = useCssModule();

const likeText = '真实';

const unlikeText = '虚假';
</script>

<template>
  <view :class="$style.postItem">
    <PersonInfo v-bind="personInfo" />
    <view :class="$style.content">{{ content }}</view>
    <view :class="$style.imgContainer">
      <img :class="$style.imgItem" v-for="imgItem in fileUrlList" :key="imgItem" :src="imgItem || avatarSrc" />
    </view>
    <view :class="$style.feedback">
      <view :class="$style.time">{{ createTime }} {{ location }}</view>
      <view :class="$style.likeOrUnlike">
        <view :class="$style.like">
          <Addfollow />
          <view>{{ `${unlikeText} +${likeNum}` }}</view>
        </view>
        <view :class="$style.like">
          <Addfollow />
          <view>{{ `${likeText} +${unLikeNum}` }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" module>
.postItem {
  .content {
    text-align: left;
    margin-top: 20px;
  }
  .imgContainer {
    display: flex;
    height: 160px;

    .imgItem {
      height: 160px;
      width: 160px;
      margin-right: 10px;
      object-fit: fill;

      &:last-child {
        margin-right: 0;
      }
    }
  }
  .feedback {
    margin-top: 20px;
    font-size: 20px;
    line-height: 1.5;
    display: flex;
    align-items: center;
    text-align: left;

    .time {
      flex: 1 1;
    }
    .likeOrUnlike {
      display: flex;

      .like {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
