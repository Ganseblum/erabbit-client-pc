<template>
  <div class="">
    <!-- 顶部通栏 -->
    <app-nav-bar></app-nav-bar>

    <!-- 头部组件 -->
    <app-header></app-header>

    <!-- 吸顶头部 -->
    <app-header-sticky></app-header-sticky>

    <!-- 内容容器，二级组件 -->
    <div class="main">
      <router-view></router-view>
    </div>

    <!-- 底部组件 -->
    <app-footer></app-footer>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import AppNavBar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
export default {
  name: 'LayOut',

  components: {
    AppNavBar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },

  setup() {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>
<style scoped lang="less">
.main {
  min-height: 600px;
}
</style>
