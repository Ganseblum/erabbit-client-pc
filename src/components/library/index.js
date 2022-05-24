// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx.more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx.bread-item.vue'

// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
// console.dir(importFn.keys()) 文件名称数组

import defaultImg from '@/assets/images/200.png'

// 自定义指令
import Message from './Message'
import Confirm from './confirm.js'

const importFn = require.context('./', false, /\.vue$/)

// vue3
// 全局实例方法app.config.globalProperties
// 全局组件app.component
// 全局指令app.directive

export default {

  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // 使用的时候组件名字,注册组件的名字，
    // 骨架
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // 轮播图
    // app.component(XtxCarousel.name, XtxCarousel)
    // 更多
    // app.component(XtxMore.name, XtxMore)
    // 面包屑
    // app.component(XtxBread.name, XtxBread)
    // 面包屑的选项
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 图片懒加载

    // 导入library文件夹下的所有组件
    // 批量导入需要使用一个函数 require.context(dir,deep,matching)
    // 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配

    // 批量注册全局组件

    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })

    // 定义指令
    defineDirective(app)

    // 如果你想挂载全局的属性，能够通过组件实例调用的属性   this.$message
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}
// 指令
const defineDirective = (app) => {
  // 图片懒加载指令
  app.directive('lazy', {
    mounted (el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      observer.observe(el)
    }
  })
}
