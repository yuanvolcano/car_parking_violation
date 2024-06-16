<script setup lang="ts">
import { Heart1, HeartFill } from '@nutui/icons-vue-taro';
import { pick } from 'lodash-es';
import { computed, useCssModule } from 'vue';

import opposeUrl from '@/assets/oppose.svg';
import avatarSrc from '@/assets/qiubilong.jpeg';
import UserInfo from '@/components/userInfo/index.vue';
import { ELikeOp, IPostItem } from '@/types/types';

defineOptions({
  name: 'PostItem',
});

const props = defineProps<{
  item: IPostItem;
}>();

const emits = defineEmits<{
  click: [val: { likeType: ELikeOp; post: IPostItem }];
  'preview-image': [val: { index: number; list: string[] }];
}>();

const userInfo = computed(() => {
  return pick(props.item, ['headImgUrl', 'nickName', 'carInfo', 'driveYear']);
});

const $style = useCssModule();

const likeText = '真实';

const unlikeText = '虚假';

function handleLikeClick(type: ELikeOp) {
  let op = ELikeOp.LIKE;
  if (type === ELikeOp.LIKE) {
    op = props.item.isLike ? ELikeOp.CANCEL_LIKE : ELikeOp.LIKE;
  } else {
    op = props.item.isUnlike ? ELikeOp.CANCEL_UNLIKE : ELikeOp.UNLIKE;
  }

  emits('click', { likeType: op, post: props.item });
}

// 图片预览
function handleImgClick(index: number) {
  emits('preview-image', { index, list: props.item.fileUrlList });
}
</script>

<template>
  <view :class="$style.postItem">
    <UserInfo v-bind="userInfo" />
    <view :class="$style.content">{{ item.content }}</view>
    <view :class="$style.imgContainer">
      <img
        :class="$style.imgItem"
        v-for="(imgItem, index) in item.fileUrlList"
        :key="imgItem"
        :src="imgItem || avatarSrc"
        @click="handleImgClick(index)"
      />
      <!-- <view :class="$style.imgWrapper">
      </view> -->
    </view>
    <view :class="$style.feedback">
      <view :class="$style.time">{{ item.createTime }} {{ item.location }}</view>
      <view :class="$style.likeOrUnlike">
        <view :class="$style.like" @click="handleLikeClick(ELikeOp.UNLIKE)">
          <img :class="$style.opposeImg" :src="opposeUrl" />
          <view>{{ `${likeText} +${item.unLikeNum}` }}</view>
        </view>
        <view :class="$style.like" @click="handleLikeClick(ELikeOp.LIKE)">
          <HeartFill v-if="item.isLike" />
          <Heart1 v-else />
          <view>{{ `${unlikeText} +${item.likeNum}` }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" module>
.postItem {
  .content {
    margin: 16rpx 0rpx;
    font-size: 24rpx;
    text-align: left;
  }

  .imgContainer {
    display: flex;
    flex-wrap: nowrap;
    height: 160rpx;
    overflow-x: auto;

    .imgItem {
      flex: 0 0 160rpx;
      height: 160rpx;
      width: 160rpx;
      margin-right: 10rpx;
      object-fit: fill;
      border-radius: 8rpx;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .feedback {
    margin-top: 10rpx;
    font-size: 24rpx;
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

        &:first-child {
          margin-right: 20rpx;
        }

        .opposeImg {
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
  }
}
</style>
