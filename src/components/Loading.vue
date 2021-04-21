<template>
  <div>
    <Header :title="'保费生产线管理系统'">
      <el-button
        icon="el-icon-s-home"
        circle
        class="home"
      />
    </Header>
    <div class="content">
      Loading
    </div>
  </div>
</template>

<script>
import Header from './Header'
export default {
  name: 'Loading',
  components: {
    Header
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/header.styl"
  @import "~@/styles/element.styl"
  // header按钮
  .home
    home()
  .content
    content()
</style>
