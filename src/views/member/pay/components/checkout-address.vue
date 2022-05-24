<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{ showAddress.contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}
        </li>
        <li>
          <span>收货地址：</span
          >{{
            showAddress.fullLocation.replace(/ /g, '') + showAddress.address
          }}
        </li>
      </ul>
      <a v-if="showAddress" href="javascript:;" @click="openAddressEdit({})"
        >添加地址</a
      >
      <a v-if="showAddress" href="javascript:;" @click="changAddress"
        >切换地址</a
      >
      <a
        v-if="showAddress"
        href="javascript:;"
        @click="openAddressEdit(showAddress)"
        >修改地址</a
      >
    </div>
    <XtxDialog v-model:visible="visible" :title="'确认切换地址？'">
      <!-- 默认插槽 -->
      <div
        class="text item"
        v-for="item in list"
        :key="item.id"
        @click="selectedFn(item)"
        :class="{ active: item.id === selsectedId }"
      >
        <ul>
          <li>
            <span>收<i />货<i />人：</span>{{ item.receiver }}
          </li>
          <li>
            <span>联系方式：</span
            >{{ item.contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}
          </li>
          <li><span>收货地址：</span>{{ item.fullLocation }}</li>
        </ul>
      </div>
      <!-- 具名插槽 -->
      <template v-slot:footer>
        <XtxButton
          type="gray"
          style="margin-right: 20px"
          @click="visible = false"
          >取消</XtxButton
        >
        <XtxButton type="primary" @click="submitAddress">确认</XtxButton>
      </template>
    </XtxDialog>
  </div>

  <AddressEdit
    v-model:Editvisible="Editvisible"
    ref="addressEdit"
    @on-success="successHandler"
  ></AddressEdit>
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  name: 'CheckoutAddress',
  components: {
    AddressEdit
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    // 显示的地址
    const showAddress = ref(null)
    if (props.list.length) {
      const defaultAddress = props.list.find((item) => item.isDefault === 1)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }

    // 显示对话框
    const visible = ref(false)
    const changAddress = () => {
      visible.value = true
    }

    // 默认选中。默认地址
    const selsectedId = ref(props.list[0].id)

    // 选中地址
    const selectedFn = (item) => {
      selsectedId.value = item.id
    }

    // 提交选中的地址
    const submitAddress = () => {
      const selectedAdd = props.list.find(
        (item) => item.id === selsectedId.value
      )
      showAddress.value = selectedAdd
      emit('changeAddress', selectedAdd.id)
      visible.value = false
    }

    // 成功
    const successHandler = (formData) => {
      const editAddress = props.list.find((item) => item.id === formData.id)
      if (editAddress) {
        // 修改
        for (const key in editAddress) {
          editAddress[key] = formData[key]
        }
      } else {
        // 添加
        const json = JSON.stringify(formData) // 需要克隆下，不然使用的是对象的引用
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(json))
      }
    }

    // 添加收货地址组件
    const addressEdit = ref(null)
    const openAddressEdit = (showAddress) => {
      addressEdit.value.open(showAddress)
    }

    return {
      showAddress,
      changAddress,
      visible,
      selectedFn,
      selsectedId,
      submitAddress,
      addressEdit,
      openAddressEdit,
      successHandler
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
