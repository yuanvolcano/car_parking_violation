<script setup lang="ts">
import Taro from '@tarojs/taro';
import { reactive, ref, useCssModule, computed, onBeforeMount } from 'vue';

import { ARTICLE_LIST, LIKE_OPERATOR } from '@/api';
import addIconSvg from '@/assets/add.svg';
import FilterType from '@/components/filterType/index.vue';
import PostItem from '@/components/postItem/index.vue';
import UserInfo from '@/components/userInfo/index.vue';
import { ELikeOp, IPostItem } from '@/types/types';

import { getLocation, getUser } from '../../stores';

defineOptions({
  name: 'Home',
});

const $style = useCssModule();

const userInfo = computed(() => {
  console.log('~~ userInfo', userInfo);
  return getUser();
});

const uploadInfo = reactive({
  text: '去上传',
  sum: '累计上传违停次数共{count}条',
});

const query = ref('');

const uploadCount = ref<string>('6');

const uploadSumText = computed(() => {
  const countValue = uploadCount.value;
  return uploadInfo.sum.replace(/\{.+\}/, countValue);
});

const filterType = ref(1);

const list = ref<IPostItem[]>([]);

const locationState = computed<Taro.getLocation.SuccessCallbackResult>(() => {
  return getLocation() || {};
});

async function getList() {
  const params = {
    keyword: query.value,
    orderBy: filterType.value, // 1-时间，2-距离
    longitude: locationState.value.longitude || 0,
    latitude: locationState.value.latitude || 0,
    nextStartId: 9999999999, // 下次查询的起始文章ID
  };

  const res = await Taro.request({
    url: ARTICLE_LIST,
    data: params,
  });

  list.value = res.data;
}

function handleScroll() {}

function handleNavigatePosts() {
  Taro.navigateTo({
    url: '/pages/posts/index',
  });
}

function handleClick() {
  Taro.navigateTo({
    url: '/pages/user/index',
  });
}

async function handleLikeOp(val: { likeType: ELikeOp; post: IPostItem }) {
  const { post, likeType } = val;
  const params = {
    likeType,
    articleCode: val.post.articleCode,
  };

  await Taro.request({
    url: LIKE_OPERATOR,
    data: params,
  });

  // 更新数据有两种方式： 1. 掉接口数据列表；2. 直接手动更新；这里先用第二种
  if (!post.isLike && !post.isUnlike) {
    // 空白
    if (likeType === ELikeOp.LIKE) {
      post.likeNum += 1;
      post.isLike = true;
    } else {
      post.unLikeNum += 1;
      post.isUnlike = true;
    }
  } else if (post.isLike) {
    post.likeNum -= 1;
    post.isLike = false;
    if (likeType === ELikeOp.UNLIKE) {
      post.unLikeNum += 1;
      post.isUnlike = true;
    }
  } else if (post.isUnlike) {
    post.unLikeNum -= 1;
    post.isUnlike = false;
    if (likeType !== ELikeOp.LIKE) {
      post.likeNum += 1;
      post.isLike = true;
    }
  }
}

onBeforeMount(() => {
  getList();
});
</script>

<template>
  <view v-if="list.length" :class="$style.index">
    <!-- 入口 -->
    <view :class="$style.baseInfo">
      <UserInfo v-bind="userInfo" :class="$style.infoContainer" @click="handleClick" />
      <view :class="$style.uploadEntry" @click="handleNavigatePosts">
        <view :class="$style.upload">
          <view :class="$style.uploadText">{{ uploadInfo.text }}</view>
          <img :class="$style.addSvg" :src="addIconSvg" />
        </view>
        <view :class="$style.uploadSum">{{ uploadSumText }}</view>
      </view>
    </view>
    <!-- 过滤条件 -->
    <FilterType v-model="filterType" :class="$style.filterType" />
    <!-- 列表 -->
    <nut-list :class="$style.postList" :list-data="list" @scroll-bottom="handleScroll">
      <template v-slot="{ item }">
        <PostItem :class="$style.postItem" :item="item" @click="handleLikeOp" />
      </template>
    </nut-list>
  </view>

  <view v-else :class="$style.empty">
    <view :class="$style.tips">社区运营不宜，</view>
    <view :class="$style.tips">需上传一条违停记录后才能进入哦~</view>
    <nut-button :class="$style.goUpload" @click="handleNavigatePosts">去上传</nut-button>
  </view>
</template>

<style lang="scss" module>
.index {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20rpx;

  .baseInfo {
    display: flex;
    justify-content: space-around;

    .infoContainer {
      background: rgba(216, 216, 216, 0.2);
      margin-right: 20rpx;
    }

    .uploadEntry {
      flex: 1 1;
      padding: 20rpx;
      background: rgba(216, 216, 216, 0.2);
      text-align: left;
      border-radius: 10rpx;

      .upload {
        display: flex;
        align-items: center;

        .uploadText {
          font-size: 40rpx;
          line-height: 1.5;
          margin-right: 20rpx;
          font-weight: 600;
          color: rgba(125, 125, 125, 1);
        }

        .addSvg {
          width: 40rpx;
          height: 40rpx;
          font-size: 40rpx;
        }
      }
      .uploadSum {
        font-size: 24rpx;
        line-height: 1.5;
      }
    }
  }

  .filterType {
    margin-top: 20rpx;
  }

  .postList {
    flex: 1 1;

    .postItem {
      margin-bottom: 20rpx;
      border-radius: 10rpx;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .nutListItem {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 150px;
    margin-bottom: 10px;
    background-color: #f4a8b6;
    border-radius: 10px;
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  padding: 0 2px;
  font-size: 32rpx;
  color: #666;

  .tips {
    text-align: center;
  }

  .goUpload {
    margin-top: 40rpx;
  }
}
</style>
