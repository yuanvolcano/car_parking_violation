import Taro from '@tarojs/taro';
import { createApp } from 'vue';

import './app.scss';
import { apiLogin } from './api';
import { getToken, setToken, setUser } from './stores';
import { getUserLocation } from './utils/common';

const App = createApp({
  onShow(_options) {
    const token = getToken();
    if (!token) {
      Taro.login({
        success: async function (loginRes) {
          if (loginRes.code) {
            //发起网络请求
            const params = {
              code: loginRes.code,
            };
            const successTip = await apiLogin(params);
            setToken(successTip.data);
          } else {
            console.log('登录失败！' + loginRes.errMsg);
          }
        },
      });
    }

    // 是否注册
    Taro.checkSession({
      success: function () {
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

            setUser(params);
          },
        });
      },
    });

    // 获取位置信息
    Taro.getSetting({
      success: function (res) {
        console.log('~~ getSetting', res);
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({
            scope: 'scope.userLocation',
            success: function () {
              // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
              getUserLocation();
            },
          });
        } else {
          getUserLocation();
        }
      },
    });
  },
});

export default App;
