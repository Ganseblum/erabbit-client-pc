<template>
  <XtxDialog title="添加收货地址" v-model:visible="dialogVisible">
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              class="input"
              v-model="formData.receiver"
              placeholder="请输入收货人"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              class="input"
              v-model="formData.contact"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              placeholder="选择收件地址"
              :fullLocation="formData.fullLocation"
              @change="changAddress"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              class="input"
              v-model="formData.address"
              placeholder="请输入详细地址"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              class="input"
              v-model="formData.postalCode"
              placeholder="请输入邮政编码"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              class="input"
              v-model="formData.addressTags"
              placeholder="请输入地址标签，逗号分隔"
            />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right: 20px" @click="close"
        >取消</XtxButton
      >
      <XtxButton type="primary" @click="submitFn">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { reactive, ref } from 'vue'
import { addAddress, editAddress } from '@/api/order.js'
import Message from '@/components/library/Message'
export default {
  name: 'AddressEdit',

  setup(props, { emit }) {
    const dialogVisible = ref(false)
    // 打开函数
    const open = (form) => {
      dialogVisible.value = true
      if (form.id) {
        for (const key in formData) {
          formData[key] = form[key]
        }
      } else {
        // 先清空数据 - 添加
        for (const key in formData) {
          if (key !== 'isDefault') {
            formData[key] = ''
          }
        }
      }
    }
    const close = () => {
      dialogVisible.value = false
    }

    // 表单数据
    const formData = reactive({
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 0,
      fullLocation: '',
      id: ''
    })
    // 地区修改
    const changAddress = (data) => {
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }

    // 提交操作
    const submitFn = () => {
      if (formData.id) {
        editAddress(formData).then(
          (data) => {
            // 添加成功
            Message({ text: '修改收货地址成功', type: 'success' })
            dialogVisible.value = false
            emit('on-success', formData)
          },
          () => {
            Message({ text: '修改收货地址失败', type: 'error' })
          }
        )
      } else {
        addAddress(formData).then(
          (data) => {
            // 添加成功
            Message({ text: '添加收货地址成功', type: 'success' })
            formData.id = data.result.id
            dialogVisible.value = false
            emit('on-success', formData)
          },
          () => {
            Message({ text: '添加收货地址失败', type: 'error' })
          }
        )
      }
    }

    // 修改地址
    const defaultAdd = ref(null)

    return {
      dialogVisible,
      open,
      formData,
      close,
      changAddress,
      submitFn,
      defaultAdd
    }
  }
}
</script>
<style scoped lang="less">
.address-edit {
  .xtx-dialog {
    :deep(.wrapper) {
      width: 780px;
      .body {
        font-size: 14px;
      }
    }
  }
  .xtx-form {
    padding: 0;
    input {
      outline: none;
      &::placeholder {
        color: #ccc;
      }
    }
  }
  .xtx-city {
    width: 320px;
    :deep(.select) {
      height: 50px;
      line-height: 48px;
      display: flex;
      padding: 0 10px;
      justify-content: space-between;
      .placeholder {
        color: #ccc;
      }
      i {
        color: #ccc;
        font-size: 18px;
      }
      .value {
        font-size: 14px;
      }
    }
    :deep(.option) {
      top: 49px;
    }
  }
}
</style>
