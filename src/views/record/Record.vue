<template>
  <div>
    <Header :title="'历史活动记录'">
      <el-button
        icon="el-icon-arrow-left"
        circle
        class="arrow"
        @click="backClick"
      />
    </Header>
    <div class="content">
      <record-search @search="searchActHisInfo" :update="updateTrigger"></record-search>
      <Shade :cname="'record-shade'"></Shade>
      <record-list @fresh="getActHisInfo" :data="recordData" :update="updateTrigger"></record-list>
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header'
import RecordSearch from './RecordSearch'
import RecordList from './RecordList'
import Shade from '../../components/Shade'
import RecordFooter from './RecordFooter'
import api from '@/plugins/api'
export default {
  name: 'Record',
  components: {
    Header,
    RecordSearch,
    RecordList,
    Shade,
    RecordFooter
  },
  methods: {
    // 返回上级页面
    backClick () {
      this.$router.push({path: '/', query: { uid: this.$store.state.currentUid }})
    },
    // 获取历史活动
    getActHisInfo () {
      let branch = (Number(this.role) < 3) ? this.$store.state.currentBranch : ''
      let uid = this.$store.state.currentUid
      let cFlag = 0
      let startTime = ''
      let endTime = ''
      let role = this.$store.state.currentRole
      this.updateTrigger = true
      api._getActHis(uid, cFlag, branch, startTime, endTime, role).then(res => {
        if (Number(res.resultCode) === 0) {
          this.recordData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.recordData = res.applInfo
        }
        this.updateTrigger = false
        console.log('getRecordData:', this.recordData)
      })
    },
    // 查询历史活动
    searchActHisInfo (dateBranchRange) {
      let uid = this.$store.state.currentUid
      let cFlag = 0
      let startTime = (dateBranchRange[0] === undefined || dateBranchRange[0] === null) ? '' : dateBranchRange[0]
      let endTime = (dateBranchRange[1] === undefined || dateBranchRange[1] === null) ? '' : dateBranchRange[1]
      let branch = (dateBranchRange[2] === undefined || dateBranchRange[2] === null) ? '' : dateBranchRange[2]
      let role = this.$store.state.currentRole
      this.updateTrigger = true
      console.log('searchHisInfo:', cFlag, startTime, endTime, branch, role)
      api._getActHis(uid, cFlag, branch, startTime, endTime, role).then(res => {
        if (Number(res.resultCode) === 0) {
          this.recordData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.recordData = res.applInfo
        }
        this.updateTrigger = false
        console.log('searchRecordData:', this.recordData)
      })
    }
  },
  data () {
    return {
      role: '',
      recordData: [],
      // recordFootList: [
      //   {icon: 'el-icon-notebook-2', name: '历史活动查询'},
      //   {icon: 'el-icon-collection', name: '我参与的活动'}
      // ],
      updateTrigger: false
    }
  },
  mounted () {
    this.role = this.$store.state.currentRole
    this.getActHisInfo()
    // if (Number(this.role) < 3) {
    //   let branch = this.$store.state.currentBranch
    //   this.getActHisInfo(branch)
    // } else {
    //   let branch = ''
    //   this.getActHisInfo(branch)
    // }
  }
}
</script>
<style lang="stylus">
  @import "~@/styles/header.styl"
  @import "~@/styles/element.styl"
  // header按钮
  .home
    home()
  .arrow
    left-arrow()
  .content
    content()
</style>
