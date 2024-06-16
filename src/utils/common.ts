import Taro from '@tarojs/taro';
import { pick } from 'lodash-es';

import { setLocation } from '@/stores';

export function format(str: string, params: any) {
  for (const key in params) {
    str = str.replace(new RegExp('\\{' + key + '\\}', 'g'), params[key]);
  }

  return str;
}

export function getUserLocation() {
  Taro.getLocation({
    success: function (locationRes) {
      console.log('~~ locationRes', locationRes);
      const locationInfo = pick(locationRes, ['latitude', 'longitude']);
      setLocation(locationInfo);
    },
    fail: function (error) {
      console.log('~~ error', error);
    },
  });
}
