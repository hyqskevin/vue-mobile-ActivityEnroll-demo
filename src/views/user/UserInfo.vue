<template>
  <div>
    <Header :title="'用户信息'">
      <el-button
        icon="el-icon-arrow-left"
        circle
        class="arrow"
        @click="backClick"
      />
    </Header>
    <div class="content">
      <user-list></user-list>
    </div>
  </div>
</template>

<script>
import UserList from './UserList'
import Header from '../../components/Header'
export default {
  name: 'UserInfo',
  components: {
    Header,
    UserList
  },
  methods: {
    // 返回上级页面
    backClick () {
      this.$router.go(-1)
      // this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/header.styl"
  @import "~@/styles/element.styl"
  // header按钮
  .arrow
    left-arrow()
  .content
    content()
</style>
