import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')

// 路由规则
const routes = [
  // 一级布局容器
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/', component: Home
      }
    ]
  }
]

// vue2创建路由实例，new VueRouter({})
// vue3创建路由实例，createRouter({})
const router = createRouter({
  // 使用hash的路由模式
  history: createWebHashHistory(),
  routes
})

export default router
