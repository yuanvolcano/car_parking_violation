<script setup lang="ts">
import { reactive, ref, useCssModule, computed, onBeforeMount } from 'vue';

import FilterType from '@/components/filterType/index.vue';
import PersonInfo from '@/components/personInfo/index.vue';
import PostItem from '@/components/postItem/index.vue';
import { IPostItem } from '@/types/types';

defineOptions({
  name: 'Main',
});

const $style = useCssModule();

const personInfo = reactive({
  headImgUrl: '',
  nickName: '张三',
  carInfo: '五菱宏光',
  driveYear: 3,
});

const uploadInfo = reactive({
  text: '去上传',
  sum: '累计上传违停次数共{count}条',
});

const uploadCount = ref<string>('6');

const uploadSumText = computed(() => {
  const countValue = uploadCount.value;
  return uploadInfo.sum.replace(/\{.+\}/, countValue);
});

const filterType = ref(1);

const list = ref<IPostItem[]>([]);

function getList() {
  const mockList = [
    {
      id: '12', // 文章ID
      userId: '1', // 文章作者ID
      nickName: '昵称',
      headImgUrl: '头像路径',
      userLocation: '用户位置',
      carInfo: '车辆信息',
      driveYear: 1, // 驾龄
      location: '广州', // 文章发表位置
      content: '文章内容',
      createTime: 'yyyy-MM-dd',
      fileUrlList: ['', ''],
      likeNum: 100, // 点赞数量
      unLikeNum: 1, // 踩数量
    },
    {
      id: '11', // 文章ID
      userId: '2', // 文章作者ID
      nickName: '昵称',
      headImgUrl: '头像路径',
      userLocation: '用户位置',
      carInfo: '车辆信息',
      driveYear: 2, // 驾龄
      location: '佛山', // 文章发表位置
      content: '文章内容',
      createTime: 'yyyy-MM-dd',
      fileUrlList: ['', ''],
      likeNum: 100, // 点赞数量
      unLikeNum: 0, // 踩数量
    },
  ];

  list.value = mockList;
}

function handleScroll() {}

onBeforeMount(() => {
  getList();
});
</script>

<template>
  <view :class="$style.index">
    <!-- 入口 -->
    <view :class="$style.baseInfo">
      <PersonInfo v-bind="personInfo" :class="$style.infoContainer" />
      <view :class="$style.uploadEntry">
        <view :class="$style.upload">
          <view :class="$style.uploadText">{{ uploadInfo.text }}</view>
          <Add />
        </view>
        <view :class="$style.uploadSum">{{ uploadSumText }}</view>
      </view>
    </view>
    <!-- 过滤条件 -->
    <FilterType v-model="filterType" :class="$style.filterType" />
    <!-- 列表 -->
    <nut-list :class="$style.postList" :list-data="list" @scroll-bottom="handleScroll">
      <template v-slot="{ item }">
        <PostItem :class="$style.postItem" v-bind="item" />
      </template>
    </nut-list>
  </view>
</template>

<style lang="scss" module>
.index {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;

  .baseInfo {
    display: flex;

    .infoContainer {
      background: rgba(216, 216, 216, 0.2);
    }

    .uploadEntry {
      padding: 10px;
      flex: 1 1;
      text-align: left;
      background: rgba(216, 216, 216, 0.2);
      border-radius: 10px;

      .upload {
        display: flex;
        align-items: center;

        .uploadText {
          font-size: 40px;
          line-height: 1.5;
          margin-right: 20px;
          font-weight: 600;
          color: rgba(125, 125, 125, 1);
        }
      }
      .uploadSum {
        font-size: 20px;
        line-height: 1.5;
      }
    }
  }

  .filterType {
    margin-top: 20px;
  }

  .postList {
    flex: 1 1;

    .postItem {
      margin-bottom: 20px;
      border-radius: 10px;

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
</style>
