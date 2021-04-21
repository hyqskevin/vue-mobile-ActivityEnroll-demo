<template>
  <div class="sale-detail-list">
    <Scroll
      @pullDownFresh="pullDownFresh"
      v-loading="loading"
    >
      <!-- 内容列表 -->
      <article class="sale-detail-list__head">{{ '我的报名信息' }}</article>
      <article v-if="Object.keys(data).length === 0 && (actFlag > 0)" class="no-list">{{ '项目已汇总，您未参与此活动。' }}</article>
      <div v-if="Object.keys(data).length !== 0" class="sale-detail-list__entry">
        <article>活动开始日期：{{ setDate(data.cus_start_time) + ' ' + data.ent_time }}</article>
        <article>{{ '活动时间段：' + detailData.timeRange }}</article>
        <article>举办地点：{{ data.act_place }}</article>
        <article>提交时间：{{ data.cus_update_time }}</article>
      </div>
      <div v-if="Object.keys(data).length !== 0" class="separate" />
      <li
        v-if="Object.keys(data).length !== 0"
        v-for="(item,index) in data.applInfo"
        :key="index"
        class="sale-detail-list__info">
        <div>
          <article>{{ '用户姓名：' + item.cus_name }}</article>
          <article>{{ '联系方式: ' + item.cus_tel }}</article>
          <article>{{ '年龄: ' + item.cus_age }}</article>
        </div>
        <div class="separate" />
      </li>
      <div style="height: 20px"/>
      <div v-if="Object.keys(data).length !== 0 && (actFlag < 2)" class="sale-detail-button-group">
        <el-button type="primary" class="button" @click="handleClick(1)">{{ '修改报名信息' }}</el-button>
        <el-button type="danger" class="button" @click="checkStatus">{{ '删除报名' }}</el-button>
      </div>
      <div v-if="Object.keys(data).length === 0 && (actFlag < 1)" class="sale-detail-button">
        <el-button type="primary" class="big-button" @click="handleClick(0)">{{ '新增报名' }}</el-button>
      </div>
      <div style="height: 20px"/>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '@/components/Scroll'
import api from '@/plugins/api'
import _switch from '../../components/statusSwitch'
export default {
  name: 'DetailInfo',
  components: {
    Scroll
  },
  props: {
    aid: {
      type: Number,
      default: 0
    },
    actFlag: {
      type: Number,
      default: 0
    },
    customer: {
      type: Number,
      default: 0
    },
    maxNum: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 下拉刷新
    pullDownFresh () {
      this.loading = true
      this.$emit('fresh')
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    // 日期转换
    setDate (date) {
      // if (date) {
      //   return date.split(' ')[0]
      // } else return '未设置'
      _switch._setDate(date)
    },
    // 删除报名
    deleteEntry () {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      let entId = this.$store.state.currentUserCode
      api._delEntry(uid, aid, entId).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('删除失败！')
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('链接失败，请重试！')
        } else if (Number(res.resultCode) === 1) {
          this.$message.success('删除成功！')
          this.$emit('delete')
          setTimeout(() => {
            this.pullDownFresh()
            this.length = Object.keys(this.data).length
          }, 1000)
        } else {
          this.$message.error('resultCode:' + res.resultCode)
        }
      })
    },
    // 汇总前删除时触发提示
    confirmDuringActiviry () {
      this.$alert('确定删除报名和客户信息？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteEntry()
      }).catch(() => {
        this.$message.info('取消删除。')
      })
    },
    // 汇总后删除时触发提示
    confirmAfterCollection () {
      this.$alert('活动信息已汇总，删除前请联系活动发起人！', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteEntry()
      }).catch(() => {
        this.$message.info('取消删除。')
      })
    },
    // 删除时判断活动状态
    checkStatus () {
      if (Number(this.actFlag) === 1) {
        this.confirmAfterCollection()
        this.pullDownFresh()
      } else {
        this.confirmDuringActiviry()
        this.pullDownFresh()
      }
    },
    // 跳转
    handleClick (update) {
      if (this.customer > this.maxNum) {
        this.$message.warning('已达到最大报名用户数量，无法继续报名。')
      } else {
        this.$router.push({path: '/entry', query: {aid: this.aid, update: update}})
      }
    }
  },
  data () {
    return {
      loading: false,
      showIcon: false,
      toTop: false,
      btnTitle: '新增报名',
      length: 0,
      creator: '',
      date: '',
      location: '',
      updateTime: '',
      customerInfo: []
    }
  },
  mounted () {
    // 每次激活页面获取数据时加载
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 2000)
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/content-list/list.styl"
  .no-list
    no-list()
  .sale-detail-list
    list($top: 100px)
  .sale-detail-list__head
    head()
  .sale-detail-list__entry
    entry()
  .sale-detail-list__info
    detail-list-info()
  .sale-detail-button
    big-button()
  .sale-detail-button-group
    button-group()
  .separate
    separate()
  .el-message-box
    width 90% !important
</style>
