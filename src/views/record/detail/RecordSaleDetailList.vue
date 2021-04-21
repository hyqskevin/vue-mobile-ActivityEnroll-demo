<template>
  <div class="sale-detail-list">
    <Scroll
      @pullDownFresh="fresh"
      v-loading="loading"
    >
      <!-- 内容列表 -->
      <article class="sale-detail-list__head">{{ '我的报名信息' }}</article>
      <article v-if="Object.keys(data).length === 0 && (actFlag === 0)" class="no-list">{{ '您还未参与此活动，请返回首页报名。' }}</article>
      <article v-if="Object.keys(data).length === 0 && (actFlag > 0)" class="no-list">{{ '项目已汇总，您未参与此活动。' }}</article>
      <div v-if="Object.keys(data).length !== 0" class="sale-detail-list__entry">
        <article>团队长：{{ data.act_creater }}</article>
        <article>活动开始日期：{{ setDate(data.cus_start_time) + ' ' + data.ent_time }}</article>
<!--        <article>{{ '活动时间段：' + detailData.timeRange }}</article>-->
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
          <article>{{ '客户姓名：' + item.cus_name }}</article>
          <article>{{ '联系方式: ' + item.cus_tel }}</article>
          <article>{{ '年龄: ' + item.cus_age }}</article>
        </div>
        <div class="separate" />
      </li>
<!--      <div v-if="length !== 0 && (actFlag < 2)" class="sale-detail-button-group">-->
<!--        <el-button type="primary" class="button" @click="handleClick(1)">{{ '修改报名信息' }}</el-button>-->
<!--        <el-button type="danger" class="button" @click="checkStatus">{{ '删除报名' }}</el-button>-->
<!--      </div>-->
<!--      <div v-if="length === 0 && (actFlag < 1)" class="sale-detail-button">-->
<!--        <el-button type="primary" class="big-button" @click="handleClick(0)">{{ '新增报名' }}</el-button>-->
<!--      </div>-->
      <div style="height: 20px"/>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '@/components/Scroll'
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
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 获取对象length，作为页面显示标识
    // getLength () {
    //   this.length = Object.keys(this.data).length
    // },
    // 下拉刷新
    fresh () {
      this.loading = true
      this.$emit('fresh')
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    // 日期转换
    setDate (date) {
      if (date) {
        return date.split(' ')[0]
      } else return '未设置'
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
