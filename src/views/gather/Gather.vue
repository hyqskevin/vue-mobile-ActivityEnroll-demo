<template>
  <div>
    <Header :title="'汇总信息'">
      <el-button
        icon="el-icon-arrow-left"
        circle
        class="arrow"
        @click="backClick"
      />
    </Header>
    <div class="content">
      <gather-list :aid="gatherAid" :data="gatherData" :update="updateTrigger"></gather-list>
    </div>
    <div @click="update">
      <big-btn v-prevent-re-click :title="'提交汇总信息'" :cname="'greenBtn'" />
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header'
import BigBtn from '../../components/BigBtn'
import GatherList from './GatherList'
import api from '@/plugins/api'
export default {
  name: 'Gather',
  components: {
    GatherList,
    BigBtn,
    Header
  },
  methods: {
    // 获取汇总表
    async getCollect () {
      let aid = this.gatherAid
      let uid = this.$store.state.currentUid
      await api._getCollect(aid, uid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.gatherData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.gatherData = res.applInfo[0]
        }
        console.log('getGatherList', this.gatherData)
      })
    },
    // 返回上级页面
    backClick () {
      this.$router.push({path: '/detail', query: {aid: this.gatherAid}})
    },
    // 触发新增，更新
    update () {
      this.updateTrigger = true
      setTimeout(() => {
        this.updateTrigger = false
      }, 1000)
    }
  },
  data () {
    return {
      gatherAid: 0,
      updateTrigger: false,
      gatherData: []
    }
  },
  activated () {
    this.gatherAid = this.$route.query.aid
    this.getCollect()
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
