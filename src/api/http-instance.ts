import Taro from '@tarojs/taro';

import { useUserStoreHook } from '@/stores/modules/user';
import { ECode } from '@/types/types';
import { loginFunc } from '@/utils/common';

export function httpPromise<T>(url: string, data, method: 'GET' | 'POST' = 'GET'): Promise<T> {
  const userStore = useUserStoreHook();
  const header = { token: userStore.getToken };

  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      data,
      header,
      method,
      success(response) {
        const res = response.data;
        const { code } = res;
        if (code === 0) {
          resolve(response.data.data);
          return;
        } else if (code === ECode.TOKEN_OUT) {
          // token 过期需要重新登录
          loginFunc();
        }
      },
      fail(...args) {
        reject(args);
      },
    });
  });
}
