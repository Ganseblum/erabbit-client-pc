<template>
  <div class="detail-action">
    <div class="state" v-if="order.orderState">
      <span class="iconfont icon-order-unpay"></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn" v-if="order.orderState">
      <XtxButton
        v-if="[1, 6].includes(order.orderState)"
        type="primary"
        size="small"
        >取消订单</XtxButton
      >

      <XtxButton
        v-if="[1].includes(order.orderState)"
        type="primary"
        size="small"
        >立即付款</XtxButton
      >

      <XtxButton
        v-if="[2, 3, 4, 5].includes(order.orderState)"
        type="primary"
        size="small"
        >再次购买</XtxButton
      >
      <XtxButton
        v-if="[4, 5].includes(order.orderState)"
        type="plain"
        size="small"
        >评价商品</XtxButton
      >
      <XtxButton
        v-if="[4, 5].includes(order.orderState)"
        type="gray"
        size="small"
        >申请售后</XtxButton
      >
    </div>
  </div>
</template>
<script>
import { orderStatus } from '@/api/constants'
export default {
  name: 'OrderDetailAction',
  props: {
    order: {
      type: String,
      default: () => {}
    }
  },
  setup() {
    return { orderStatus }
  }
}
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
