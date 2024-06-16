import { createApp } from 'vue';

import './app.scss';
import { setupStore } from './stores';
import { init } from './utils/common';

const app = createApp({
  onShow() {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

setupStore(app);

init();

export default app;
