export default defineAppConfig({
  pages: ['pages/empty/index', 'pages/home/index', 'pages/posts/index', 'pages/user/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: 'requiredComponents',
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
  },
  requiredPrivateInfos: ['getLocation'],
});
