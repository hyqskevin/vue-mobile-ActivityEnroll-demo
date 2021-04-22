<template>
  <div>
    <Header :title="'填写报名信息'">
      <el-button
        icon="el-icon-arrow-left"
        circle
        class="arrow"
        @click="backClick"
      />
    </Header>
    <div class="content">
      <entry-list
        :aid="entryAid"
        :start="startDate"
        :end="endDate"
        :date-range="dateRange"
        :time-range="timeRange"
        :location="location"
        :update="updateFlag"
        :data="entryData"></entry-list>
    </div>
<!--    <big-btn :title="'保存报名'" :cname="'entryBlueBtn'"/>-->
<!--    <big-btn :title="'提交报名'" :cname="'entryGreenBtn'"/>-->
  </div>
</template>

<script>
import Header from '../../components/Header'
import BigBtn from '../../components/BigBtn'
import EntryList from './EntryList'
import api from '@/plugins/api'
export default {
  name: 'Entry',
  components: {
    Header,
    BigBtn,
    EntryList
  },
  methods: {
    // 获取活动描述信息
    getDescribe () {
      let aid = this.entryAid
      let uid = this.$store.state.currentUid
      api._getActivityDescribe(aid, uid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('活动信息获取失败，请联系系统管理员！')
          this.backClick()
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          let data = res.applInfo[0]
          this.startDate = data.act_start_time
          this.endDate = data.act_end_time
          this.dateRange.push(this.startDate, this.endDate)
          this.timeRange = data.ent_time
          this.location = data.act_place
        }
        console.log('describe:', res.applInfo[0])
      })
    },
    // 获取报名表和用户信息表
    getEntry () {
      let aid = this.entryAid
      let uid = this.$store.state.currentUid
      let entId = this.$store.state.currentUserCode
      let cFlag = 1 // 查看完整信息
      api._getCustomerEntryList(aid, uid, entId, cFlag).then(res => {
        if (Number(res.resultCode) === 0) {
          this.entryData = {}
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.entryData = res
        }
        console.log('getEntryList', this.entryData)
      })
    },
    // 返回上级页面
    backClick () {
      this.$router.go(-1)
    }
  },
  data () {
    return {
      entryAid: 0,
      updateFlag: 0,
      startDate: '',
      endDate: '',
      timeRange: '',
      dateRange: [],
      location: '',
      entryData: [],
      customerData: []
    }
  },
  mounted () {
    this.entryAid = this.$route.query.aid
    this.updateFlag = this.$route.query.update
    this.getEntry()
    this.getDescribe()
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
