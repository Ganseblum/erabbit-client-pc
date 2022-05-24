// hooks 封装逻辑，提供响应式数据。
// 提供复用逻辑的函数（钩子）
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
// 数据懒加载函数
export const useLazyData = (apiFn) => {
  // 需要
  // 1. 被观察的对象
  // 2. 不同的API函数
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        // 调用API获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    {
      threshold: 0
    }
  )
  // 返回--->数据（dom,后台数据）
  return { target, result }
}

// const {stop} = useIntersectionObserver(target, fn, options)
// 1、参数一target表示被监听的DOM元素
// 2、参数二是回调函数，用于通知监听的动作（回调函数的第一个形参isIntersecting表示被监听的元素已经进入了可视区）
// 3、表示配置选项
// stop 是停止观察是否进入或移出可视区域的行为
// const { stop } = useIntersectionObserver(
// target 是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
//   target,
// isIntersecting 是否进入可视区域，true是进入 false是移出
// observerElement 被观察的dom
//   ([{ isIntersecting }], observerElement) => {
// 在此处可根据isIntersecting来判断，然后做业务
//   },
// )

/**
 * 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
