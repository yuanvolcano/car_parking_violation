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
}>();

const userInfo = computed(() => {
  return pick(props.item, ['headImgUrl', 'nickName', 'carInfo', 'driveYear']);
});

const $style = useCssModule();

const likeText = '真实';

const unlikeText = '虚假';

function handleClick(type: ELikeOp) {
  let op = ELikeOp.LIKE;
  if (type === ELikeOp.LIKE) {
    op = props.item.isLike ? ELikeOp.CANCEL_LIKE : ELikeOp.LIKE;
  } else {
    op = props.item.isUnlike ? ELikeOp.CANCEL_UNLIKE : ELikeOp.UNLIKE;
  }

  emits('click', { likeType: op, post: props.item });
}
</script>

<template>
  <view :class="$style.postItem">
    <UserInfo v-bind="userInfo" />
    <view :class="$style.content">{{ item.content }}</view>
    <view :class="$style.imgContainer">
      <img :class="$style.imgItem" v-for="imgItem in item.fileUrlList" :key="imgItem" :src="imgItem || avatarSrc" />
    </view>
    <view :class="$style.feedback">
      <view :class="$style.time">{{ item.createTime }} {{ item.location }}</view>
      <view :class="$style.likeOrUnlike">
        <view :class="$style.like" @click="handleClick(ELikeOp.UNLIKE)">
          <img :class="$style.opposeImg" :src="opposeUrl" />
          <view>{{ `${likeText} +${item.unLikeNum}` }}</view>
        </view>
        <view :class="$style.like" @click="handleClick(ELikeOp.LIKE)">
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
    height: 160rpx;

    .imgItem {
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
