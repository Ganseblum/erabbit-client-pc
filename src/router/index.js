import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index.vue')
const SubCategory = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index.vue')

const Login = () => import('@/views/login/index.vue')

const Cart = () => import('@/views/cart/index.vue')

const PayCheckOut = () => import('@/views/member/pay/checkout.vue')

const PayIndex = () => import('@/views/member/pay/index')
const PayResult = () => import('@/views/member/pay/result.vue')

const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order')
const MemberDetail = () => import('@/views/member/order/detail')

// 路由规则
const routes = [
  // 一级布局容器
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: PayCheckOut },
      { path: '/member/pay', component: PayIndex },
      { path: '/pay/callback', component: PayResult },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome },
          {
            path: '/member/order',
            // 创建一个RouterView容器形成嵌套关系
            component: { render: () => h(<RouterView />) },
            children: [
              { path: '', component: MemberOrder },
              { path: 'detail/:id', component: MemberDetail }
            ]
          }
        ]
      }
    ]
  },
  { path: '/login', component: Login }
]

// vue2创建路由实例，new VueRouter({})
// vue3创建路由实例，createRouter({})
const router = createRouter({
  // 使用hash的路由模式
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})
// 导航前置守卫
router.beforeEach((to, from, next) => {
  const { token } = store.state.user.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})

export default router
