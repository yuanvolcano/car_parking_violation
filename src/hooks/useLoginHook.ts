import Taro from '@tarojs/taro';
import { onMounted } from 'vue';

import { useUserStoreHook } from '@/stores/modules/user';

function getCurrentPageUrlWithArgs() {
  //获取带参链接
  const pages = Taro.getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  const options = currentPage.options;
  let urlWithArgs = `/${url}?`;
  for (const key in options) {
    const value = options[key];
    urlWithArgs += `${key}=${value}&`;
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
  return urlWithArgs;
}

export default function useLoginHook() {
  onMounted(() => {
    const userStore = useUserStoreHook();
    const url = getCurrentPageUrlWithArgs(); //当前带参数的路径
    if (!userStore.getToken) {
      Taro.redirectTo({ url: `/pages/empty/index?backUrl=${encodeURIComponent(url)}` });
    }
  });
}
