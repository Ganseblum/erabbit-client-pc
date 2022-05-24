<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <a href="javascript:;"
              ><i class="iconfont icon-user"></i>
              {{
                $store.state.user.profile.account
                  ? $store.state.user.profile.account
                  : '周杰伦'
              }}</a
            >
          </li>
          <li><a href="javascript:;" @click="logOut">退出登录</a></li>
        </template>

        <template v-else>
          <li><router-link to="/login">请先登录</router-link></li>

          <li><a href="javascript:;">免费注册</a></li>
        </template>

        <li>
          <RouterLink to="/member">会员中心</RouterLink>
        </li>
        <li>
          <RouterLink to="/member/order">我的订单</RouterLink>
        </li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'AppTopnav',
  setup() {
    const store = useStore()

    const profile = computed(() => {
      return store.state.user.profile
    })

    const router = useRouter()
    const logOut = () => {
      // 清除token
      store.commit('user/setUser', {})
      store.commit('cart/setCartList', [])
      // 跳转到首页
      router.push('/')
    }

    return { profile, logOut }
  }
}
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
