<template>
  <div class="member-order-page">
    <XtxTabs v-model="activeName" @tab-click="changeItem">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </XtxTabsPanel>
    </XtxTabs>
  </div>
  <div class="order-list">
    <div v-if="loading" class="loading"></div>
    <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
    <OrderItem
      @on-cancel="handlerCancelOrder(item)"
      @on-delete="handlerDeleteOrder"
      @on-receive="handlerReceiveOrder(item)"
      @on-logistics="handlerlogisticsOrder"
      v-for="item in orderList"
      :key="item.id"
      :order="item"
    />
  </div>
  <XtxPagination
    v-if="total > requestParams.pageSize"
    @current-change="requestParams.page = $event"
    :total="total"
    :page-size="requestParams.pageSize"
    :current-page="requestParams.page"
  />
  <OrderCancel ref="orderCancelCom" />

  <OrderLogistics ref="logistics" />
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { delteOrder, findOrderList, recevieOrder } from '@/api/order'
import OrderItem from './components/order-item.vue'
import OrderCancel from './components/order-cancel.vue'
import Message from '@/components/library/Message.js'
import confirm from '@/components/library/confirm.js'
import OrderLogistics from './components/order-logistics.vue'

export default {
  name: 'MemberOrderPage',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup() {
    const activeName = ref('all')
    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 订单列表
    const orderList = ref([])
    // 查询订单
    const loading = ref(false)

    const total = ref(0)
    // watch(
    //   requestParams,
    //   () => {
    //     loading.value = true
    //     findOrderList(requestParams).then((data) => {
    //       orderList.value = data.result.items
    //       total.value = data.result.counts
    //       loading.value = false
    //     })
    //   },
    //   { immediate: true }
    // )

    const findOrderListFn = () => {
      loading.value = true
      findOrderList(requestParams).then((data) => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    // 筛选条件变化重新加载
    watch(
      requestParams,
      () => {
        findOrderListFn()
      },
      { immediate: true }
    )

    // 改变内容
    const changeItem = (tab) => {
      requestParams.page = 1
      requestParams.orderState = tab.index
    }

    // 删除订单

    const handlerDeleteOrder = (order) => {
      confirm({ text: '确认删除吗' })
        .then(() => {
          delteOrder([order]).then(() => {
            Message({ text: '删除成功', type: 'success' })
          })
          findOrderListFn()
        })
        .catch((e) => {})
    }

    return {
      activeName,
      orderList,
      total,
      loading,
      requestParams,
      orderStatus,
      changeItem,
      ...cancelOrder(),
      handlerDeleteOrder,
      ...receiveOrder(),
      ...logisticsOrderFn()
    }
  }
}

// 取消订单逻辑
const cancelOrder = () => {
  const orderCancelCom = ref(null)

  const handlerCancelOrder = (item) => {
    orderCancelCom.value.open(item)
  }

  return { handlerCancelOrder, orderCancelCom }
}

// 确认收获
const receiveOrder = () => {
  // item 就是你要确认收货的订单
  const handlerReceiveOrder = (item) => {
    confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
      recevieOrder(item.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        // 确认收货后状态变成 待评价
        item.orderState = 4
      })
    })
  }

  return { handlerReceiveOrder }
}

// 查看物流
const logisticsOrderFn = () => {
  const logistics = ref(null)
  const handlerlogisticsOrder = (item) => {
    // logisticsOrder(item.id).then(() => {})
    logistics.value.open(item)
  }
  return { handlerlogisticsOrder, logistics }
}
</script>
<style scoped lang="less">
.order-list {
  background: #fff;
  padding: 20px;
}
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
