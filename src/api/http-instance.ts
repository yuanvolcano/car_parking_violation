import Taro from '@tarojs/taro';

import { getToken } from '@/stores';

export function httpPromise<T>(url: string, data, method: 'GET' | 'POST' = 'GET'): Promise<T> {
  const header = { token: getToken() };
  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      data,
      header,
      method,
      success(response) {
        resolve(response.data);
      },
      fail(...args) {
        reject(args);
      },
    });
  });
}
