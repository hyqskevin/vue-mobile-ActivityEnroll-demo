<template>
  <div>
    <Header :title="headerTitle">
      <el-button
        icon="el-icon-arrow-left"
        circle
        class="arrow"
        @click="backClick"
      />
    </Header>
    <div class="content">
      <activity-list :aid="activityAid" :data="activityData" :create="createTrigger" :update="updateTrigger"></activity-list>
    </div>
    <div @click="update">
      <big-btn v-prevent-re-click :title="btnTitle" :cname="'greenBtn'" />
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header'
import BigBtn from '../../components/BigBtn'
import ActivityList from './ActivityList'
import api from '@/plugins/api'

export default {
  name: 'Activity',
  components: {
    ActivityList,
    BigBtn,
    Header
  },
  methods: {
    // 获取活动表
    getActivity () {
      let aid = this.activityAid
      let uid = this.$store.state.currentUid
      let name = this.$store.state.currentUserName
      api._getActivity(aid, uid, name).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('活动信息表获取失败，请联系系统管理员！')
          setTimeout(() => {
            this.$router.go(-1)
          }, 2000)
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.activityData = res.applInfo[0]
        }
        console.log('activityData:', this.activityData)
      })
    },
    // 返回上级页面
    backClick () {
      this.$router.go(-1)
    },
    // 触发新增，更新
    update () {
      if (this.activityAid !== '') {
        this.updateTrigger = true
        setTimeout(() => {
          this.updateTrigger = false
        }, 1000)
      } else {
        this.createTrigger = true
        setTimeout(() => {
          this.createTrigger = false
        }, 1000)
      }
    }
  },
  data () {
    return {
      activityAid: '',
      headerTitle: '发起新的活动',
      btnTitle: '提交新的活动',
      createTrigger: false,
      updateTrigger: false,
      activityData: []
    }
  },
  activated () {
    this.activityAid = this.$route.query.aid
    if (this.activityAid !== '') {
      this.getActivity()
      this.headerTitle = '修改当前活动'
      this.btnTitle = '提交修改的活动'
    } else {
      this.headerTitle = '发起新的活动'
      this.btnTitle = '提交新的活动'
    }
    this.createTrigger = false
    this.updateTrigger = false
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/header.styl"
  @import "~@/styles/element.styl"
  .arrow
    left-arrow()
  .content
    content()
</style>
