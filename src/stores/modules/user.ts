import Taro from '@tarojs/taro';
import { defineStore } from 'pinia';

import { store } from '@/stores';
import { IBaseInfo, ILocation } from '@/types/types';

const TOKEN = 'token';

export const useUserStore = defineStore({
  id: 'user',
  state: (): {
    location: ILocation | null;
    user: IBaseInfo | null;
    token: string;
  } => {
    return {
      user: null,
      location: null,
      token: '',
    };
  },
  getters: {
    getToken() {
      return this.token;
    },
    getLocation() {
      return this.location;
    },
    getUser(): IBaseInfo {
      return (this.user || {}) as IBaseInfo;
    },
    getAvatarUrl() {
      return this.getUser?.headImgUrl || '';
    },
  },
  actions: {
    setToken(token: string) {
      Taro.setStorageSync(TOKEN, token);
      this.token = token;
    },
    removeToken() {
      Taro.removeStorageSync(TOKEN);
      this.token = '';
    },
    setLocation(location) {
      this.location = location;
    },
    setUser(userInfo: IBaseInfo | null) {
      this.user = userInfo;
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}
