<template>
  <div>
    <Header :title="'管理系统主页'">
      <el-button
        icon="el-icon-s-home"
        circle
        class="home"
      />
      <el-button
        v-if="Number(roleCode) < 2"
        icon="el-icon-user-solid"
        circle
        class="person"
        @click="personalInfo"
      />
    </Header>
    <div class="content">
      <Shade></Shade>
      <Search @search="searchActInfo" :update="updateTrigger"></Search>
      <home-list @fresh="fresh" :sum="actSum" :data="homeData" :update="updateTrigger"></home-list>
    </div>
    <Footer v-if="Number(roleCode) > 0" :sum="actSum" :list="footList"></Footer>
    <sale-footer v-if="Number(roleCode) === 0" :sum="actSum" :list="footList" @sublist="chooseLine"></sale-footer>
  </div>
</template>

<script>
import Header from '../../components/Header'
import Search from './Search'
import HomeList from './HomeList'
import Shade from '../../components/Shade'
import Footer from './Footer'
import SaleFooter from './SaleFooter'
import api from '@/plugins/api.js'

export default {
  name: 'Home',
  components: {
    SaleFooter,
    Footer,
    Shade,
    HomeList,
    Header,
    Search
  },
  methods: {
    // 个人信息页面
    personalInfo () {
      this.$router.push('/user')
    },
    // 获取用户信息
    getUserInfo (uid) {
      api._getUserInfo(uid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('用户信息获取失败，请联系系统管理员！')
          setTimeout(() => {
            this.$router.push('/404')
          }, 2000)
        } else {
          let data = res.applInfo[0]
          this.userCode = data.user_code
          this.userName = data.user_name
          this.leaderCode = data.leader_code
          this.leaderName = data.act_creater
          this.branch = data.branch_name
          this.flag = data.user_flag
          this.roleCode = res.role
          // vuex缓存用户信息
          this.$store.commit('getUserInfo', {
            uid: this.uid,
            leaderCode: this.leaderCode,
            leaderName: this.leaderName,
            userCode: this.userCode,
            userName: this.userName,
            branch: this.branch,
            flag: this.flag,
            role: this.roleCode,
            record: 1
          })
        }
        // 底部菜单栏显式
        if (this.roleCode > 0) {
          this.footList = this.homeFootList
        } else {
          this.footList = this.homeSaleFootList
        }
        console.log('getUserInfo:', this.userCode, this.userName, this.leaderCode, this.leaderName, this.branch, this.flag, this.roleCode)
      }).catch(err => {
        this.message.info('用户信息接口失败:', err)
      })
    },
    // 刷新页面
    fresh () {
      this.getActInfo(this.uid)
    },
    // 获取当前参与正在进行的活动数量
    getActSum (uid) {
      api._getActSum(uid).then(res => {
        if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.actSum = Number(res.resultCode)
        }
        console.log('getActSum:', this.actSum)
      })
    },
    // 获取最近的活动
    getActInfo (uid) {
      let startTime = ''
      let endTime = ''
      let actLine = 0
      this.updateTrigger = true
      api._getActInfo(uid, startTime, endTime, actLine).then(res => {
        if (Number(res.resultCode) === 0) {
          this.homeData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.homeData = res.applInfo
        }
        this.updateTrigger = false
        console.log('getHomeData:', this.homeData)
      })
    },
    // 按生产线获取最近的活动
    chooseLine (num) {
      let startTime = ''
      let endTime = ''
      let actLine = num
      this.updateTrigger = true
      console.log('sublist num:', num)
      api._getActInfo(this.uid, startTime, endTime, actLine).then(res => {
        if (Number(res.resultCode) === 0) {
          this.homeData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.homeData = res.applInfo
        }
        this.updateTrigger = false
        console.log('getSelectedHomeData:', this.homeData)
      })
    },
    // 查询最近的活动
    searchActInfo (dateRange) {
      let startTime = (dateRange[0] === undefined || dateRange[0] === null) ? '' : dateRange[0]
      let endTime = (dateRange[1] === undefined || dateRange[0] === null) ? '' : dateRange[1]
      let actLine = 0
      this.updateTrigger = true
      console.log('dateRange:', startTime, endTime)
      api._getActInfo(this.uid, startTime, endTime, actLine).then(res => {
        if (Number(res.resultCode) === 0) {
          this.homeData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.homeData = res.applInfo
        }
        this.updateTrigger = false
        console.log('searchHomeData:', this.homeData)
      })
    }
  },
  data () {
    return {
      homeData: [],
      footList: [],
      homeFootList: [
        {icon: 'el-icon-folder-checked', name: '创建活动', path: '/activity', query: ''},
        {icon: 'el-icon-notebook-2', name: '历史', path: '/record'},
        {icon: 'el-icon-collection', name: '我参与的', path: '/my_record'},
        {icon: 'el-icon-pie-chart', name: '查看排名', path: '/rank'}
      ],
      homeSaleFootList: [
        {icon: 'el-icon-collection', name: '我参与的', path: '/my_record'},
        {icon: 'el-icon-notebook-2', name: '历史活动', path: '/record'},
        {icon: 'el-icon-pie-chart', name: '查看排名', path: '/rank'}
      ],
      uid: '',
      userCode: 0,
      userName: '',
      leaderCode: 0,
      leaderName: '',
      branch: '',
      flag: '',
      roleCode: 0,
      actSum: 0,
      updateTrigger: false
    }
  },
  mounted () {
    if (this.uid === '' || this.uid === undefined) {
      this.$router.push('/404')
    } else {
      this.getUserInfo(this.uid)
      this.getActInfo(this.uid)
      this.getActSum(this.uid)
    }
  },
  created () {
    // 初始化
    this.uid = this.$route.query.uid
    this.userCode = 0
    this.userName = ''
    this.leaderCode = 0
    this.leaderName = ''
    this.branch = ''
    this.flag = ''
    this.roleCode = 0
    this.homeData = []
    this.footList = []
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/header.styl"
  @import "~@/styles/element.styl"
  // header按钮
  .home
    home()
  .person
    person()
  .content
    content()
</style>
