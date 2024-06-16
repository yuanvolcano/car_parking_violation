<script setup lang="ts">
import { pick, cloneDeep } from 'lodash-es';
import { computed, ref, toValue } from 'vue';

import { apiUserUpdate } from '@/api';
import ListItem from '@/components/listItem/index.vue';
import { useUserStoreHook } from '@/stores/modules/user';

const userStore = useUserStoreHook();

const userInfo = computed(() => {
  return userStore.getUser;
});

const avatarUrl = computed(() => {
  return userStore.getAvatarUrl;
});

const formData = computed(() => {
  return pick(userInfo.value, ['carInfo', 'driveYear', 'location']);
});

const editFormData = ref(formData.value);

const listConfig = {
  carInfo: '爱车',
  driveYear: '驾龄',
  location: '常停地点',
};

const visible = ref(false);

const curProp = ref('');

const editingTitle = computed(() => {
  return `修改${listConfig[curProp.value]}`;
});

function handleClickItem(value: { type: string }) {
  visible.value = true;
  curProp.value = value.type;
  editFormData.value = cloneDeep(toValue(formData));
}

async function handleSave() {
  if (!editFormData.value[curProp.value]) {
    return;
  }

  await apiUserUpdate(editFormData.value);

  let tempState = userStore.getUser;
  tempState = Object.assign(cloneDeep(toValue(tempState)), editFormData.value);
  userStore.setUser(tempState);
}
</script>

<template>
  <view :class="$style.user">
    <view :class="$style.avatarContainer">
      <nut-avatar shape="round" :class="$style.avatar">
        <img :src="avatarUrl" />
      </nut-avatar>
    </view>

    <view>
      <ListItem
        v-for="item in Object.keys(listConfig)"
        :key="item"
        :prop="item"
        :label="listConfig[item]"
        :value="formData[item]"
        @click="handleClickItem"
      />
    </view>

    <nut-action-sheet v-model:visible="visible" :title="editingTitle">
      <nut-form :class="$style.form">
        <nut-form-item :label="listConfig[curProp]">
          <nut-input v-model="editFormData[curProp]" placeholder="请输入" type="text" />
        </nut-form-item>
        <!-- <nut-button type="info" block @click="handleSave">保存</nut-button> -->
        <nut-button type="info" block :disabled="!editFormData[curProp]" @click="handleSave">保存</nut-button>
      </nut-form>
    </nut-action-sheet>
  </view>
</template>

<style lang="scss" module>
.user {
  .avatarContainer {
    display: flex;
    justify-content: center;
    margin: 40rpx 0 80rpx;

    .avatar {
      width: 160rpx;
      height: 160rpx;
    }
  }
  .form {
    display: block;
    padding: 0 20rpx;
  }
}
</style>
