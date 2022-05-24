// 获取品牌分类

import request from '@/utils/request.js'

export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}

// 获取轮播图
export const findBanner = () => {
  return request('/home/banner', 'get')
}

// 获取新鲜好物
export const findNew = () => {
  return request('home/new', 'get')
}

// 获取人气推荐
export const findHot = () => {
  return request('home/hot', 'get')
}

// 获取商品推荐
export const findGoods = () => {
  return request('home/goods', 'get')
}

// 获取最新专题
export const findSpecial = () => {
  return request('home/special', 'get')
}
