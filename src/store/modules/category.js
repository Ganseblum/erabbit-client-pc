// 分类模块
import { findAllCategory } from '@/api/category'
import { topCategory } from '@/api/constants'

export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合
      // 提前加入分类，在没有数据或者加载的时候，不会出现空白
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, layload) {
      state.list = layload
    }
  },
  actions: {
    async getList ({ commit }) {
      const { result } = await findAllCategory()
      commit('setList', result)
    }
  }
}
