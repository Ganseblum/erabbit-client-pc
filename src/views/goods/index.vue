<template>
  <div class="xtx-goods-page">
    <div class="container" v-if="goods">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[0].id}`">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"></GoodsImage>
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodName :goods="goods"></GoodName>
          <!-- 规格组件 -->
          <GoodsSku :goods="goods" skuId="300242099" @change="changeSku" />

          <!-- 控制组件 -->
          <XtxNumbox v-model="num" :max="goods.inventory"></XtxNumbox>
          <XtxButton type="primary" style="margin-top: 20px" @click="insertCart"
            >加入购物车</XtxButton
          >
        </div>
      </div>

      <!-- 商品推荐 -->
      <GoodsRelevant :goodId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <GoodsTabs :goods="goods"></GoodsTabs>
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn></GoodsWarn>
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1" />
          <GoodsHot :goodsId="goods.id" :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import { nextTick, ref, watch, provide } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods.sales.vue'
import GoodName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods.hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import Message from '@/components/library/Message.js'
import { useStore } from 'vuex'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsSku,
    GoodsTabs,
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodName,
    GoodsHot,
    GoodsWarn
  },
  setup() {
    const goods = useGoods()

    // sku改变时候触发
    const changeSku = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
        currSku.value = sku
      } else {
        currSku.value = null
      }
    }

    provide('goods', goods)

    const num = ref(1)
    const store = useStore()

    // 选中商品的属性
    const currSku = ref(null)
    // 加入购物车所需要的属性

    // 加入购物车
    const insertCart = () => {
      if (currSku.value) {
        const { mainPictures, id, name, price } = goods.value
        const { inventory: stock, specsText: attrsText, skuId } = currSku.value
        // 规格选择完毕
        store.dispatch('cart/insertCart', {
          skuId,
          name,
          attrsText,
          stock,
          id,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        })
        Message({ type: 'success', text: '添加购物车成功' })
      } else {
        Message({ type: 'error', text: '请选择商品规格' })
      }
    }

    return { store, goods, changeSku, num, insertCart }
  }
}
// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(
    () => route.params.id,
    (newVal) => {
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods(route.params.id).then((data) => {
          // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
          goods.value = null
          nextTick(() => {
            goods.value = data.result
          })
        })
      }
    },
    { immediate: true }
  )
  return goods
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
