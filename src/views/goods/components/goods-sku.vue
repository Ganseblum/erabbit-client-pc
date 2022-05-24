<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd v-for="val in item.values" :key="val.id">
        <img
          v-if="val.picture"
          :src="val.picture"
          :title="val.name"
          :class="{ selected: val.selected }"
          @click="changSelect(item.values, val)"
        />
        <span
          v-else
          :class="{ selected: val.selected, disabled: val.disabled }"
          @click="changSelect(item.values, val)"
          >{{ val.name }}</span
        >
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Array,
      default: () => []
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // 组件初始化的时候更新选中状态
    updateDisabledStatus(props.goods.specs, pathMap)

    // 获取选中的商品规格
    initSelectedStatus(props.goods, props.skuId)

    const changSelect = (item, val) => {
      // 如果是禁用状态不做操作
      if (val.disabled) return false

      // 选中和取消选中
      if (val.selected) {
        val.selected = false
      } else {
        // 清除所有的选择项
        item.forEach((val) => {
          val.selected = false
        })
        // 在单独选择
        val.selected = true
      }
      // 获取选中的属性
      const SelectedArr = getSelectedArr(props.goods.specs).filter((val) => val)
      if (SelectedArr.length === props.goods.specs.length) {
        // 从字典中找到属性对应的id,对象的值
        const skuid = pathMap[SelectedArr.join(spliter)]
        // 从sku中找对对应的数据
        const sku = props.goods.skus.find((item) => item.id === skuid[0])
        // 向父亲传递
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 拼接名称
          specsText: sku.specs
            .reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '')
            .trim()
        })
      } else {
        emit('change', {})
      }
      // 点击更新的时候禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
    }

    return { changSelect }
  }
}
const spliter = '★'
// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach((sku) => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory) {
      // 2. 得到sku属性值数组
      const specs = sku.specs.map((spec) => spec.valueName)
      // 3. 通过算法，得到sku属性值数组的子集
      const powerSet = getPowerSet(specs)
      // 4. 设置给路径字典对象
      powerSet.forEach((set) => {
        const key = set.join(spliter)
        if (pathMap[key]) {
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          // 没有key设置一个数组
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 得到当前选中规格集合
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach((spec) => {
    // 被选中项
    const selectedVal = spec.values.find((val) => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((spec, i) => {
    const selectedArr = getSelectedArr(specs)
    spec.values.forEach((val) => {
      // 已经选中的按钮不用判断
      if (val.name === selectedArr[i]) return false
      // 未选中的替换对应的值
      selectedArr[i] = val.name
      // 过滤无效值得到key
      // v有值的时候拼接
      const key = selectedArr.filter((v) => v).join(spliter)
      // 设置禁用状态
      // 检查sku中有没有对应的值
      val.disabled = !pathMap[key]
    })
  })
}

// 获取选中商品的规格
// 初始化选中状态
const initSelectedStatus = (goods, skuId) => {
  const sku = goods.skus.find((sku) => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((spec, i) => {
      const value = sku.specs[i].valueName
      spec.values.forEach((val) => {
        if (val.name === value) {
          val.selected = true
        }
      })
    })
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
