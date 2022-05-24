<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 组件xtx-steps.vue-->
    <DetailSteps :order="order" />
    <!-- 物流栏 -->
    <Suspense v-if="[3, 4, 5].includes(order.orderState)">
      <!-- 组件加载完毕 -->
      <template #default>
        <DetailLogistics :order="order" />
      </template>
      <!-- 组件加载中显示 -->
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <DetailInfo :order="order" />
  </div>
</template>
<script>
import { findOrder } from '@/api/order.js'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action'
import DetailSteps from './components/detail.step.vue'
import DetailInfo from './components/detail-info.vue'
import { ref } from 'vue'
import DetailLogistics from './components/detail-logistics.vue'

export default {
  name: 'OrderDetailPage',
  components: { DetailAction, DetailSteps, DetailLogistics, DetailInfo },
  setup() {
    const route = useRoute()
    const active = ref(1)
    const order = ref([])
    findOrder(route.params.id).then((data) => {
      order.value = data.result
      active.value = data.result.orderState
    })

    return { order, active }
  }
}
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
}
</style>
