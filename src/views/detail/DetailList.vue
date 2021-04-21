<template>
  <div class="detail-list">
    <Scroll
      @pullDownFresh="pullDownFresh"
      v-loading="loading"
    >
      <!-- 内容列表 -->
      <article class="detail-list__head">{{ '名单' }}</article>
      <article v-if="data.length === 0" class="no-list">{{ '无报名信息。' }}</article>
      <article v-if="data.length !== 0" class="detail-list__summary">{{ '已报名'+ entry +'人，已参与'+ customer +'人' }}</article>
<!--      <article v-if="data.length !== 0" class="detail-list__summary">{{ '已报名'+ entry +'人' }}</article>-->
      <div v-if="data.length !== 0" class="detail-separate"/>
      <li
        v-if="data.length !== 0"
        v-for="(item,index) in data"
        :key="index"
        class="detail-list__info"
      >
        <el-popover
          placement="bottom"
          width="300"
          trigger="click">
          <el-table :data="secretData" max-height="250">
            <el-table-column width="60" property="cus_name" label="姓名"></el-table-column>
            <el-table-column width="60" property="cus_age" label="年龄"></el-table-column>
            <el-table-column width="140" property="cus_tel" label="联系方式"></el-table-column>
          </el-table>
        </el-popover>
        <el-button v-if="Number(actFlag) === 0" icon="el-icon-delete" @click.prevent="deleteConfirm(item.ent_id)" class="delete-customer-list"></el-button>
        <div class="detail-separate" />
      </li>
      <div style="height: 20px"/>
      <Chart v-if="customer > 15" :data="ageList"></Chart>
      <div style="height: 60px"/>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '@/components/Scroll'
import api from '@/plugins/api'
import Chart from '@/components/Chart'
import _switch from '../../components/statusSwitch'
export default {
  name: 'DetailList',
  components: {
    Scroll,
    Chart
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
    entry: {
      type: Number,
      default: 0
    },
    customer: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    },
    ageList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 管理人员移除未参与的人员信息
    removeSaler (entId) {
      // 删除报名
      let aid = this.aid
      let uid = this.$store.state.currentUid
      api._delEntry(uid, aid, entId).then(res => {
        if (Number(res.resultCode) === 0) {
          this.$message.error('删除失败！')
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('链接失败，请重试！')
        } else if (Number(res.resultCode) === 1) {
          this.$message.success('删除成功！')
          this.$emit('delete')
          this.pullDownFresh()
        } else {
          this.$message.error('resultCode:' + res.resultCode)
        }
      })
    },
    // 日期转换
    setDate (date) {
      // if (date) {
      //   return date.split(' ')[0]
      // } else return '未设置'
      _switch._setDate(date)
    },
    // 下拉刷新
    pullDownFresh () {
      this.loading = true
      this.$emit('fresh')
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    // 删除报名前确认
    deleteConfirm (entId) {
      this.$alert('正在删除未参与活动的人员，确认删除？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeSaler(entId)
      }).catch(() => {
        this.$message.info('取消删除。')
      })
    }
  },
  data () {
    return {
      loading: false,
      showIcon: false,
      toTop: false,
      secretData: []
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
  .detail-list
    list($top: 100px)
  .no-list
    no-list()
  .detail-separate
    separate()
  .detail-list__head
    head()
  .detail-list__summary
    summary()
  .detail-list__info
    detail-list-info()
  .delete-customer-list
    float: right
    position: absolute
    right: 6px
    margin-top: -100px !important
    border-radius: 50% !important
    padding: 20px !important
    font-size: 14px !important
    border: 0 !important
</style>
