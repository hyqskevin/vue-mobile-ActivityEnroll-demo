<template>
  <div>
    <Header :title="'活动历史信息'">
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
        v-if="roleFlag"
        :aid="aid"
        :entry="entryNum"
        :customer="cusNum"
        :ageList ="ageList"
        :data="detailData"
        :collect="collectData"
        @fresh="getSaleList">
      </detail-list>
      <sale-detail-list
        v-if="!roleFlag"
        :aid="aid"
        :actFlag="actFlag"
        :data="customerData"
        @fresh="getCustomerList">
      </sale-detail-list>
      <el-dialog v-loading="loading" :visible.sync="visible" :modal="false">
        <img width="100%" :src="imageUrl" alt="">
      </el-dialog>
      <div v-if="Number(actFlag) > 1" @click="checkPhoto">
        <big-btn v-prevent-re-click :title="'查看照片'" :cname="'greenBtn'" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import DetailList from './RecordDetailList'
import SaleDetailList from './RecordSaleDetailList'
import Shade from '@/components/Shade'
import Describe from './RecordDescribe'
import BigBtn from '@/components/BigBtn'
import api from '@/plugins/api'
import getAge from '@/components/getAge'

export default {
  name: 'RecordDetail',
  components: {
    Describe,
    Shade,
    DetailList,
    Header,
    SaleDetailList,
    BigBtn
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
    // 获取汇总信息
    getCollect () {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      api._getCollect(aid, uid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.collectData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.collectData = res.applInfo[0]
        }
        console.log('getGatherList', this.collectData)
      })
    },
    // 查看照片
    checkPhoto () {
      if (this.fileList.length === 0) {
        this.$message.warning('活动未上传照片。')
      } else {
        this.visible = true
        this.loading = true
        this.imageUrl = this.fileList[0].url
        // console.log('imageUrl', this.imageUrl)
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    },
    // 获取照片
    getPhoto () {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      api._getImage(uid, aid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.fileList = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.fileList.push({name: this.aid + '.jpg', url: res.act_img})
        }
      })
      console.log('fileList:', this.fileList)
    },
    // 返回上级页面
    backClick () {
      this.$router.push('/record')
    }
  },
  data () {
    return {
      aid: 0,
      roleFlag: false,
      visible: false,
      imageUrl: '',
      loading: false,
      actFlag: 0,
      entryNum: 0,
      updateNum: 0,
      cusNum: 0,
      describe: {},
      detailData: [],
      customerData: [],
      collectData: [],
      fileList: [],
      ageList: []
    }
  },
  mounted () {
    this.aid = this.$route.query.aid
    this.getDescribe().then(() => {
      this.roleFlag = ((this.describe.act_creater === this.$store.state.currentUserName) || Number(this.$store.state.currentRole) > 1)
      console.log('roleFlag:', this.roleFlag)
      if (this.roleFlag) {
        this.getSaleList()
        this.getCollect()
      } else {
        this.getCustomerList()
      }
    })
    this.getPhoto()
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
