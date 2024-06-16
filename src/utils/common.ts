import Taro from '@tarojs/taro';
import { pick } from 'lodash-es';

import { apiLogin } from '@/api';
import { useUserStoreHook } from '@/stores/modules/user';

let userStore: ReturnType<typeof useUserStoreHook>;

export function format(str: string, params: any) {
  for (const key in params) {
    str = str.replace(new RegExp('\\{' + key + '\\}', 'g'), params[key]);
  }

  return str;
}

export function init() {
  userStore = useUserStoreHook();
  // 获取位置信息
  Taro.getSetting({
    success: res => {
      console.log('~~ Taro.getSetting success');
      if (!res.authSetting['scope.userLocation']) {
        Taro.authorize({
          scope: 'scope.userLocation',
          success: () => {
            console.log('~~ Taro.authorize success');
            getUserLocation();
          },
          fail: () => {
            // 用户拒绝授权
            abortAuthorization();
          },
        });
      } else {
        getUserLocation();
      }
    },
  });
}

export function getUserLocation() {
  return new Promise(resolve => {
    Taro.getLocation({
      success: function (locationRes) {
        console.log('~~ Taro.getLocation success');
        const locationInfo = pick(locationRes, ['latitude', 'longitude']);
        userStore.setLocation(locationInfo);
        // 如果没有 token，需要重新登录
        !userStore.getToken && loginMain();
        resolve(locationInfo);
      },
      fail: () => {
        console.log('~~ Taro.getLocation fail');
      },
    });
  });
}

export function abortAuthorization() {
  Taro.showModal({
    title: '温馨提示',
    content: '需要获取您的位置信息，请允许',
    success: tip => {
      if (tip.confirm) {
        getUserLocation();
      } else {
        // 二次确认也不授权，直接退出小程序
        Taro.exitMiniProgram();
      }
    },
  });
}

export function loginMain() {
  // 是否注册
  Taro.checkSession({
    success: function () {
      console.log('~~ Taro.checkSession success');
      // 无 token
      if (userStore.getToken) {
        getUserInfo();
      } else {
        loginFunc();
      }
    },
    fail: function () {
      console.log('~~ Taro.checkSession fail');
      loginFunc();
    },
  });
}

export function getUserInfo() {
  Taro.getUserInfo({
    success: function (res) {
      const { userInfo } = res;
      const { country = '', province = '', city = '' } = userInfo;
      const params = {
        headImgUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        carInfo: '',
        driveYear: 0,
        location: `${country}${province}${city}`,
      };

      userStore.setUser(params);
    },
  });
}

export function loginFunc() {
  // 先移除 token，再重新登录
  userStore.setUser(null);
  userStore.removeToken();
  Taro.login({
    success: async function (loginRes) {
      console.log('~~ Taro.login success', loginRes);
      if (loginRes.code) {
        //发起网络请求
        const params = {
          code: loginRes.code,
        };
        const token = await apiLogin(params);
        console.log('~~ apiLogin', token);
        userStore.setToken(token);
        getUserInfo();
      } else {
        console.log('登录失败！' + loginRes.errMsg);
      }
    },
  });
}
