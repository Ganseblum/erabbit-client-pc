<template>
  <div class="goods-tabs" v-if="goods">
    <nav>
      <a
        :class="{ active: activeName === 'detial' }"
        href="javascript:;"
        @click="changTab('detial')"
        >商品详情</a
      >
      <a
        :class="{ active: activeName === 'comment' }"
        href="javascript:;"
        @click="changTab('comment')"
        >商品评价<span>{{ goods.commentCount }}</span></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <!-- 这个位置显示对应的组件 GoodsDetail 或者 GoodsComment -->
    <!-- <component :is="GoodsComment"></component> -->
    <component :is="showComponent"></component>

    <!-- <template v-if="activeName === 'comment'">
      <GoodsComment></GoodsComment>
    </template>

    <template v-if="activeName === 'detial'">
      <GoodsDetail></GoodsDetail>
    </template> -->
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import GoodsComment from './goods.comment.vue'
import GoodsDetail from './goods.detial.vue'
export default {
  name: 'GoodsTabs',
  props: {
    goods: {
      type: Number,
      default: 0
    }
  },

  components: {
    GoodsComment,
    GoodsDetail
  },
  setup() {
    const activeName = ref('detial')
    const showComponent = ref('GoodsDetail')
    const changTab = (val) => {
      activeName.value = val
      if (activeName.value === 'detial') {
        showComponent.value = GoodsDetail
      }
      if (activeName.value === 'comment') {
        showComponent.value = GoodsComment
      }
    }
    return { activeName, changTab, showComponent }
  }
}
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: '';
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
