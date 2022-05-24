import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入自己的UI库
import UI from '@/components/library/index'

// 重置样式库
import 'normalize.css'
// 自己项目的重置样式
import '@/assets/styles/common.less'

import '@/mock'

createApp(App).use(store).use(router).use(UI).mount('#app')
