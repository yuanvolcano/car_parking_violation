import Taro from '@tarojs/taro';
import { reactive } from 'vue';

import { IBaseInfo, ILocation } from '@/types/types';

export const state = reactive<{
  location: ILocation | null;
  user: IBaseInfo | null;
}>({
  user: null,
  location: null,
});

export function setToken(token: string) {
  Taro.setStorageSync('token', token);
}

export function getToken() {
  return Taro.getStorageSync('token');
}

export function setLocation(location) {
  state.location = location;
}

export function getLocation() {
  return state.location;
}

export function setUser(userInfo: IBaseInfo) {
  state.user = userInfo;
}

export function getUser(): IBaseInfo {
  return (state.user || {}) as IBaseInfo;
}

export function getAvatarUrl() {
  return getUser()?.headImgUrl || '';
}
