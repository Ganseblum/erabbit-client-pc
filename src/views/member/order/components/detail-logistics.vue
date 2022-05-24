<template>
  <div class="detail-logistics" v-if="logistics">
    <p>
      <span>{{ logistics[0].time }}</span>
      <span>{{ logistics[0].text }}</span>
    </p>
    <a href="javascript:;" @click="lookOrderLogistics">查看物流</a>

    <OrderLogistics ref="orderLogistics" />
  </div>
</template>
<script>
import { logisticsOrder } from '@/api/order.js'
import OrderLogistics from './order-logistics.vue'
import { ref } from 'vue/'
export default {
  name: 'DetailLogistics',
  components: {
    OrderLogistics
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },

  async setup(props) {
    // const getLogistics = () => {
    //   logisticsOrder(props.order.id).then((data) => {
    //     logistics.value = data.result
    //   })
    // }
    const data = await logisticsOrder(props.order.id)
    const logistics = ref(data.result.list)

    const orderLogistics = ref(null)

    const lookOrderLogistics = () => {
      orderLogistics.value.open(props.order)
    }
    return { logistics, orderLogistics, lookOrderLogistics }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
