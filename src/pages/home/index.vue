<script setup lang="ts">
import { IconFont } from '@nutui/icons-vue-taro';
import Taro, { useDidShow } from '@tarojs/taro';
import { reactive, ref, useCssModule, computed } from 'vue';

import { apiArticleList, apiGetUploadNum, apiLikeOperate } from '@/api';
import addIconSvg from '@/assets/add.svg';
import FilterType from '@/components/filterType/index.vue';
import PostItem from '@/components/postItem/index.vue';
import UserInfo from '@/components/userInfo/index.vue';
import { useUserStoreHook } from '@/stores/modules/user';
import { ELikeOp, ILocation, IPostItem } from '@/types/types';
import { getUserLocation } from '@/utils/common';
import { throttle } from '@/utils/throttle';

defineOptions({
  name: 'Home',
});

const $style = useCssModule();

const userStore = useUserStoreHook();

const userInfo = computed(() => {
  return userStore.getUser;
});

const uploadInfo = reactive({
  text: '去上传',
  sum: '累计上传违停次数共{count}条',
});

const query = ref('');

const queryVisible = ref(false);

const uploadCount = ref<number>(0);

const uploadSumText = computed(() => {
  const countValue = uploadCount.value;
  return uploadInfo.sum.replace(/\{.+\}/, String(countValue));
});

const filterType = ref(1);

const list = ref<IPostItem[]>([]);

const lastMaxId = ref(Number.MAX_SAFE_INTEGER);

const maxId = ref(Number.MAX_SAFE_INTEGER);

const imagePreviewVisible = ref(false);

const previewList = ref<{ src: string }[]>([]);

const previewIndex = ref(0);

const locationState = computed<ILocation>(() => {
  return userStore.getLocation;
});

async function getList() {
  if (!userStore.getToken) {
    return;
  }
  // 等待拉取用户
  if (!locationState.value) {
    await getUserLocation();
  }

  const params = {
    keyword: query.value,
    orderBy: filterType.value, // 1-时间，2-距离
    longitude: locationState.value?.longitude || 0,
    latitude: locationState.value?.latitude || 0,
    nextStartId: maxId.value, // 下次查询的起始文章ID
  };

  const res = await apiArticleList(params);

  lastMaxId.value = maxId.value;

  list.value = list.value.concat(res?.articleList || []);
  maxId.value = res?.maxId || 0;
}

const handleScroll = throttle(() => {
  if (lastMaxId.value === maxId.value) {
    getList();
  }
}, 200);

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

function resetList() {
  list.value = [];
}

function handleSearchIconClick() {
  queryVisible.value = true;
}

async function handleQueryConfirm() {
  queryVisible.value = false;
  resetList();
  await handleSearch();
}

async function handleSearch() {
  maxId.value = Number.MAX_SAFE_INTEGER;
  await getList();
  query.value = '';
}

function handleFilterTypeUpdate() {
  maxId.value = Number.MAX_SAFE_INTEGER;
  resetList();
  getList();
}

function hidePreview() {
  imagePreviewVisible.value = false;
}

async function handleLikeOp(val: { likeType: ELikeOp; post: IPostItem }) {
  const { post, likeType } = val;
  const params = {
    likeType,
    articleCode: val.post.articleCode,
  };

  const res = await apiLikeOperate(params);

  // 更新数据有两种方式： 1. 掉接口数据列表；2. 直接手动更新；这里先用第二种
  if (!post.isLike && !post.isUnlike) {
    // 空白
    if (likeType === ELikeOp.LIKE) {
      post.likeNum = res.likeNum;
      post.isLike = true;
    } else {
      post.unLikeNum = res.unLikeNum;
      post.isUnlike = true;
    }
  } else if (post.isLike) {
    post.likeNum = res.likeNum;
    post.isLike = false;
    if (likeType === ELikeOp.UNLIKE) {
      post.unLikeNum = res.unLikeNum;
      post.isUnlike = true;
    }
  } else if (post.isUnlike) {
    post.unLikeNum = res.unLikeNum;
    post.isUnlike = false;
    if (likeType !== ELikeOp.LIKE) {
      post.likeNum = res.likeNum;
      post.isLike = true;
    }
  }
}

function handleOpenPreview(params: { index: number; list: string[] }) {
  previewList.value = params.list?.map(src => ({ src }));
  imagePreviewVisible.value = true;
  previewIndex.value = params.index;
}

async function fetchUploadNum() {
  const res = await apiGetUploadNum();
  uploadCount.value = res.uploadNum;
}

useDidShow(() => {
  maxId.value = Number.MAX_SAFE_INTEGER;
  fetchUploadNum();
  getList();
});
</script>

<template>
  <view v-if="list.length || uploadCount" :class="$style.index">
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
    <view :class="$style.search">
      <FilterType v-model="filterType" :class="$style.filterType" @update:modelValue="handleFilterTypeUpdate" />
      <IconFont name="search" :class="$style.searchIcon" @click="handleSearchIconClick" />
      <!-- <nut-searchbar v-model="query" @search="handleSearch" /> -->
    </view>
    <!-- 列表 -->
    <nut-list :class="$style.postList" :list-data="list" @scroll-bottom="handleScroll">
      <template v-slot="{ item }">
        <PostItem :class="$style.postItem" :item="item" @click="handleLikeOp" @preview-image="handleOpenPreview" />
      </template>
    </nut-list>
  </view>

  <view v-else :class="$style.empty">
    <view :class="$style.tips">社区运营不宜，</view>
    <view :class="$style.tips">需上传一条违停记录后才能进入哦~</view>
    <nut-button :class="$style.goUpload" @click="handleNavigatePosts">去上传</nut-button>
  </view>

  <nut-action-sheet v-model:visible="queryVisible" title="搜索">
    <nut-form :class="$style.form">
      <nut-searchbar v-model="query" @search="handleSearch" />
      <nut-button type="info" block :disabled="!query" @click="handleQueryConfirm">保存</nut-button>
    </nut-form>
  </nut-action-sheet>

  <!-- 图片预览 -->
  <nut-image-preview :show="imagePreviewVisible" :images="previewList" :init-no="previewIndex" @close="hidePreview" />
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

  .search {
    margin-top: 20rpx;
    display: flex;
    align-items: center;

    .filterType {
      flex: 1;
    }

    .searchIcon {
      margin-right: 20rpx;
    }
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
