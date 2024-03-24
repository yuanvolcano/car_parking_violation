import Taro from '@tarojs/taro';
import { createApp } from 'vue';

import './app.scss';
import { LOGIN_URL } from './api';
import { setUser } from './stores';
import { getUserLocation } from './utils/common';

const App = createApp({
  onShow(_options) {
    // 是否注册
    Taro.checkSession({
      success: function () {
        Taro.getUserInfo({
          success: function (res) {
            console.log('~~ res', res);
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
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        Taro.login({
          success: function (loginRes) {
            if (loginRes.code) {
              //发起网络请求
              Taro.request({
                url: LOGIN_URL,
                data: {
                  code: loginRes.code,
                },
                success: function (successTip) {
                  console.log('~~', successTip);
                },
                fail: function (err) {
                  console.log('~~ ', err);
                },
              });
            } else {
              console.log('登录失败！' + loginRes.errMsg);
            }
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
