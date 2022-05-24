<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <GoodsSku @change="changSku" v-if="goods" :skuId="skuId" :goods="goods" />
      <XtxButton
        v-if="goods"
        type="primary"
        size="mini"
        style="margin-left: 60px"
        @click="submit"
        >确认</XtxButton
      >
    </div>
  </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import { onClickOutside } from '@vueuse/core'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
import { getSpecsAndSkus } from '@/api/cart.js'

export default {
  name: 'CartSku',
  components: {
    GoodsSku
  },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const visible = ref(false)
    const target = ref(null)
    const loading = ref(false)
    const goods = ref(null)

    // 打开
    const open = () => {
      visible.value = true
      loading.value = true
      // 拿数据
      getSpecsAndSkus(props.skuId).then((data) => {
        goods.value = data.result
        loading.value = false
      })
    }

    // 关闭
    const close = () => {
      visible.value = false
      goods.value = null
    }

    // 点击切换状态
    const toggle = () => {
      visible.value ? close() : open()
    }

    // 点击外部关闭
    onClickOutside(target, () => {
      close()
    })

    // 点击提交
    const submit = () => {
      if (
        currSku.value &&
        currSku.value.skuId &&
        currSku.value.skuId !== props.skuId
      ) {
        emit('change', currSku.value)
        close()
      }
    }

    // 改变sku
    const currSku = ref(null)
    const changSku = (sku) => {
      currSku.value = sku
    }

    return { open, close, toggle, visible, target, goods, submit, changSku }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
