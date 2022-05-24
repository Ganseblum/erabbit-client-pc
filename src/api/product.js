import request from '@/utils/request.js'

// 获取商品详情
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const findRelGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热榜商品
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findHotGoods = ({ id, type, limit = 3 }) => {
  return request('/goods/hot', 'get', { id, type, limit })
}

// 获取商品的评价信息
export const findCommentInfo = (id) => {
  // return request(`/goods/${id}/evaluate/page`, 'get')
  // 使用mook数据，axios不会拼接http和https开头的地址
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')

  // https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate
}

// 获取评价列表
export const findCommentList = (id, param) => {
  // return request(`/goods/${id}/evaluate`, 'get')
  // 使用mook数据，axios不会拼接http和https开头的地址
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', param)

  // https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate
}
