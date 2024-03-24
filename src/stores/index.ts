import { reactive } from 'vue';

import { IBaseInfo } from '@/types/types';

// export const state: { user: IBaseInfo | null } = {
//   user: {
//     // headImgUrl: 'https://c-ssl.duitang.com/uploads/blog/202209/19/20220919181424_308ce.jpg',
//     headImgUrl: '',
//     nickName: '秋名山车神',
//     carInfo: '五菱宾果，车辆信息',
//     driveYear: 1, // 驾龄
//     location: '常停地址',
//   },
// };

export const state = reactive({
  user: {
    // headImgUrl: 'https://c-ssl.duitang.com/uploads/blog/202209/19/20220919181424_308ce.jpg',
    headImgUrl: '',
    nickName: '秋名山车神',
    carInfo: '五菱宾果，车辆信息',
    driveYear: 1, // 驾龄
    location: '常停地址',
  },
  location: null,
});

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
