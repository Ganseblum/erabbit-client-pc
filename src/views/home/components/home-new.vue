<template>
  <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
    <template v-slot:right><XtxMore /></template>
    <div style="position: relative; height: 406px" ref="target">
      <ul v-if="goods.length" class="goods-list">
        <li v-for="item in goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="" />
            <p class="name">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
      <HomeSkeleton bg="#f0f9f4" v-else />
    </div>
  </HomePanel>
</template>

<script>
import { findNew } from '@/api/home.js'
import HomePanel from './home-panel'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks/index'

export default {
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup() {
    // const goods = ref([])

    // findNew().then((data) => {
    //   goods.value = data.result
    // })
    const { target, result } = useLazyData(findNew)

    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 15px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
