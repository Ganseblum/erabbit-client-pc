import { createStore } from 'vuex'
import user from './modules/user.js'
import category from './modules/category.js'
import cart from './modules/cart.js'

// 创建持久化
import createPersistedstate from 'vuex-persistedstate'

// vue2创建仓库，new Vuex.Store({})
// vue3创建仓库，createStore({})

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  // 配置插件
  plugins: [
    // 默认存储在localstorage
    createPersistedstate({
      // 本地存储的名字
      key: 'erabbit-client-pc-store',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
