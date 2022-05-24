<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{ active }">
      <span class="placeholder" v-if="fullLocation">{{ fullLocation }}</span>
      <span class="placeholder" v-else>{{ placeholder }}</span>
      <span class="value"></span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="show" ref="target">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          v-for="item in currList"
          :key="item.code"
          @click="change(item)"
          >{{ item.name }}</span
        >
      </template>
    </div>
  </div>
</template>
<script>
import { ref, reactive } from '@vue/reactivity'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
import { computed } from '@vue/runtime-core'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },

  setup(props, { emit }) {
    const show = ref(false)
    const loading = ref(false)

    // 所有城市的信息
    const cityData = ref([])
    // 打开
    const open = () => {
      loading.value = true
      show.value = true
      getCityData().then((data) => {
        cityData.value = data
        loading.value = false
      })
    }
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })

    // 点击选中城市
    const change = (item) => {
      // 省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }

      // 地区
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName} `
        close()
        emit('change', changeResult)
      }
    }

    // 被选中的城市信息
    const currList = computed(() => {
      // 省份
      let currList = cityData.value

      // 城市
      if (changeResult.provinceCode) {
        currList = currList.find(
          (p) => p.code === changeResult.provinceCode
        ).areaList
      }

      // 地区
      if (changeResult.cityCode) {
        currList = currList.find(
          (c) => c.code === changeResult.cityCode
        ).areaList
      }

      return currList
    })

    // 关闭
    const close = () => {
      show.value = false
    }

    const toggleDialog = () => {
      show.value ? close() : open()
    }

    // 实现点击组件外部元素进行关闭
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })

    return {
      show,
      toggleDialog,
      target,
      loading,
      currList,
      cityData,
      change,
      changeResult
    }
  }
}

// 获取城市全部数据
const getCityData = () => {
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url =
        'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(({ data }) => {
        window.cityData = data
        resolve(window.cityData)
      })
    }
  })
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
