<template>
  <div>
    <Header :title="'活动信息'">
      <el-button
        icon="el-icon-arrow-left"
        circle
        class="arrow"
        @click="backClick"
      />
    </Header>
    <div class="content">
      <Shade :cname="'detail-shade'"></Shade>
      <Describe :data="describe"></Describe>
      <detail-list
        v-if="roleFlag && !myEntry"
        :aid="aid"
        :actFlag="actFlag"
        :entry="entryNum"
        :customer="cusNum"
        :data="detailData"
        :ageList ="ageList"
        @fresh="getSaleList"
        @delete="getSaleList">
      </detail-list>
      <sale-detail-list
        v-if="!roleFlag || myEntry"
        :aid="aid"
        :actFlag="actFlag"
        :data="customerData"
        :customer="cusNum"
        :maxNum = "maxNum"
        @fresh="getCustomerList"
        @delete="getCustomerList">
      </sale-detail-list>
    </div>
    <detail-footer
      v-if="roleFlag && (actFlag < 2)"
      :aid="aid"
      :list="detailFootList"
      :checkin="myEntry"
      :check-collect="collected"
      @checkout="checkEntry"
      @delete="confirm"
      @finish="confirmFinish">
    </detail-footer>
  </div>
</template>

<script>
import Header from '../../components/Header'
import DetailList from './DetailList'
import Shade from '../../components/Shade'
import Describe from './Describe'
import SaleDetailList from './SaleDetailList'
import DetailFooter from './DetailFooter'
import api from '@/plugins/api'
import getAge from '@/components/getAge'

export default {
  name: 'Detail',
  components: {
    DetailFooter,
    SaleDetailList,
    Describe,
    Shade,
    DetailList,
    Header
  },
  methods: {
    // 获取活动描述信息
    async getDescribe () {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      await api._getActivityDescribe(aid, uid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('活动信息获取失败，请联系系统管理员！')
          setTimeout(() => {
            this.$router.push('/404')
          }, 2000)
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          // 获取活动状态
          this.actFlag = res.applInfo[0].act_flag
          // 获取最大报名人数
          this.maxNum = Number(res.applInfo[0].max_num)
          // 获取全部描述
          this.describe = res.applInfo[0]
        }
        console.log('describe:', this.describe)
      })
    },
    // 获取报名的销售人员
    async getSaleList () {
      let role = this.$store.state.currentRole
      if (role > 0) {
        let aid = this.aid
        let uid = this.$store.state.currentUid
        await api._getSalerEntryList(aid, uid).then(res => {
          if (Number(res.resultCode) === 0) {
            this.detailData = []
          } else if (Number(res.resultCode) === -1) {
            this.$message.error('参数错误，请重试！')
          } else {
            this.entryNum = Number(res.act_chk_sum)
            this.updateNum = Number(res.act_up_sum)
            this.cusNum = Number(res.cus_sum)
            this.detailData = res.applInfo
            if (this.cusNum > 15) {
              getAge.countAgeList(aid, uid, this.detailData).then(res => {
                this.ageList = res
                console.log('ageList:', this.ageList)
              })
            }
          }
          console.log('salerList:', this.detailData)
        })
      }
    },
    // 获取报名的客户
    async getCustomerList () {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      let entId = this.$store.state.currentUserCode
      let cFlag = 1 // 销售人员查看完整信息
      await api._getCustomerEntryList(aid, uid, entId, cFlag).then(res => {
        if (Number(res.resultCode) === 0) {
          this.customerData = {}
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.customerData = res
        }
        console.log('customerList:', this.customerData)
      })
    },
    // 删除活动
    async deleteActivity () {
      console.log('actFlag:', this.actFlag)
      if (Number(this.actFlag) > 0) {
        this.$message.error('活动信息已汇总，无法删除！')
      } else {
        let uid = this.$store.state.currentUid
        let aid = this.aid
        await api._delActivity(uid, aid).then(res => {
          if (Number(res.resultCode) === 0) {
            this.$message.error('删除失败！')
          } else if (Number(res.resultCode) === -1) {
            this.$message.error('链接失败，请重试！')
          } else if (Number(res.resultCode) === 1) {
            this.$message.success('删除成功！')
            this.$router.push('/record')
          } else {
            this.$message.error('resultCode:' + res.resultCode)
          }
        })
      }
    },
    // 完成活动
    async finishActivity () {
      let uid = this.$store.state.currentUid
      let aid = this.aid
      let actFlag = 2
      await api._updFinish(uid, aid, actFlag).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('提交失败！')
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('链接失败，请重试！')
        } else if (Number(res.resultCode) === 1) {
          this.$message.success('成功结束活动！')
          this.$router.push({path: '/my_record'})
        } else {
          this.$message.error('resultCode:' + res.resultCode)
        }
      })
    },
    // 删除时触发提示
    confirm () {
      this.$alert('删除活动的同时将删除所有报名，确认删除？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteActivity()
      }).catch(() => {
        this.$message.info('取消删除。')
      })
    },
    // 提交完成时触发提示
    confirmFinish () {
      if (Number(this.actFlag) === 0) {
        this.$message.warning('未汇总信息，无法完成活动！')
      } else {
        this.$alert('提交完成活动的后所有信息都无法修改，确认提交？', '提交确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.finishActivity()
        }).catch(() => {
          this.$message.info('取消提交。')
        })
      }
    },
    // 返回上级页面
    backClick () {
      // this.$router.go(-1)
      // 根据页标志返回上级页面
      let column = this.$store.state.currentPageFlag
      if (Number(column) === 0) {
        this.$router.push({path: '/', query: {uid: this.$store.state.currentUid}})
      } else if (Number(column) === 1) {
        this.$router.push('/record')
      } else if (Number(column) === 2) {
        this.$router.push('/my_record')
      } else {
        this.$router.push({path: '/', query: {uid: this.$store.state.currentUid}})
      }
    },
    // 切换报名信息/我的报名
    checkEntry (flag) {
      this.myEntry = flag
    },
    // 切换填写汇总/修改汇总
    checkCollect () {
      if (Number(this.actFlag) > 0) {
        this.collected = true
      }
    }
  },
  data () {
    return {
      aid: 0,
      actFlag: 0,
      roleFlag: false,
      myEntry: false,
      collected: false,
      entryNum: 0,
      updateNum: 0,
      cusNum: 0,
      maxNum: 999,
      describe: {},
      detailData: [],
      customerData: [],
      ageList: [],
      detailFootList: [
        {icon: 'el-icon-document', name: '我的报名', switchName: '报名信息'},
        {icon: 'el-icon-edit', name: '填写汇总', switchName: '修改汇总', path: '/gather'},
        {icon: 'el-icon-folder-delete', name: '删除活动'},
        {icon: 'el-icon-finished', name: '完成活动'}
      ]
    }
  },
  mounted () {
    this.aid = this.$route.query.aid
    this.myEntry = false
    this.getDescribe().then(() => {
      this.roleFlag = (this.describe.act_creater === this.$store.state.currentUserName)
      if (this.roleFlag) {
        this.getSaleList()
        this.getCustomerList()
        this.checkCollect()
      } else {
        this.getCustomerList()
      }
    })
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
