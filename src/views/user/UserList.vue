<template>
  <div class="user-list">
    <el-row style="margin-top: 8px">
      <el-col :span="4">
        <el-icon :class="['el-icon-user-solid', 'icon-user']"></el-icon>
      </el-col>
      <el-col :span="20">
        <article class="user-name">用户名：{{ data.user_name }}</article>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4">
        <el-icon :class="['el-icon-s-platform', 'icon-platform']"></el-icon>
      </el-col>
      <el-col :span="20">
        <article class="user-branch">团队：{{ data.branch + ' ' + data.act_creater + '团队' }}</article>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4">
        <el-icon :class="['el-icon-s-order', 'icon-order']"></el-icon>
      </el-col>
      <el-col :span="20">
        <article class="user-activity-sum">累计参加活动：{{ data.act_sum }}</article>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>-->
      <el-col :span="4">-->
        <el-icon :class="['el-icon-star-on', 'icon-star']"></el-icon>
      </el-col>
      <el-col :span="20">
        <article class="user-support">点赞数：{{ data.like_sum }}</article>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '@/plugins/api'
export default {
  name: 'UserList',
  methods: {
    getPersonalInfo () {
      let uid = this.$store.state.currentUid
      api._getPersonalInfo(uid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('活动信息表获取失败，请联系系统管理员！')
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.cus_sum = res.single_cus_sum
          this.data = res.applInfo[0]
        }
        console.log('personalData:', this.data)
      })
    }
  },
  data () {
    return {
      cus_sum: '',
      data: []
    }
  },
  mounted () {
    this.getPersonalInfo()
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/element.styl"
  .user-list
    height 96%
    background $bgColor
    padding 8px 12px
    margin 8px
    border-radius 4px
    z-index 1
    .icon-user
      float left
      margin-top 4px
      margin-left 4px
      font-size 24px
      color $blue
    .icon-platform
      float left
      margin-top 4px
      margin-left 4px
      font-size 24px
      color $green
    .icon-order
      float left
      margin-top 4px
      margin-left 4px
      font-size 24px
      color $green
    .icon-custom
      float left
      margin-top 4px
      margin-left 4px
      font-size 24px
      color $red
    .icon-star
      float left
      margin-top 4px
      margin-left 4px
      font-size 24px
      color $red
    .user-name
      margin-top 8px
      margin-right 8px
      float right
      font-size 16px
    .user-branch
      margin-right 8px
      float right
      font-size 16px
    .user-activity-sum
      margin-right 8px
      float right
      font-size 16px
    .user-customer-sum
      margin-right 8px
      float right
      font-size 16px
    .user-support
      margin-right 8px
      float right
      font-size 16px
</style>
