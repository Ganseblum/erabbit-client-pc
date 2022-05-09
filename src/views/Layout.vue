<template>
  <div class="">
    <!-- 顶部通栏 -->
    <nav>顶部通栏</nav>
    <!-- 头部组件 -->
    <header>头部组件</header>
    <!-- 内容容器，二级组件 -->
    <div class=".main">
      <router-view></router-view>
    </div>
    <!-- 底部组件 -->
    <footer>底部组件</footer>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  name: 'Layout',
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
}
</script>
<style scoped lang="less"></style>
