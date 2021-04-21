<template>
  <div class="detail-list">
    <Scroll
      @pullDownFresh="fresh"
      v-loading="loading"
    >
      <!-- 内容列表 -->
      <article class="detail-list__head">{{ '名单' }}</article>
      <article v-if="data.length === 0" class="no-list">{{ '无报名信息。' }}</article>
      <article v-if="data.length !== 0" class="detail-list__summary">{{ '已报名'+ entry +'人，已参与'+ customer +'位客户' }}</article>
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
import Chart from '@/components/Chart'
import api from '@/plugins/api'
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
    },
    collect: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 管理人员查看客户加密信息
    getCustomer (entId) {
      let aid = this.aid
      let uid = this.$store.state.currentUid
      let cFlag = 0 // 管理人员查看加密信息
      api._getCustomerEntryList(aid, uid, entId, cFlag).then(res => {
        if (Number(res.resultCode) === 0) {
          this.secretData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          this.secretData = res.applInfo
        }
        console.log('customerSecretList:', this.secretData)
      })
    },
    // 下拉刷新
    fresh () {
      this.loading = true
      this.$emit('fresh')
      setTimeout(() => {
        this.loading = false
      }, 2000)
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
</style>
