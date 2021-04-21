<template>
  <div class="record-list">
    <Scroll
      @pullDownFresh="pullDownFresh"
      @scroll="scroll"
      v-loading="loading"
      :to-top="toTop"
    >
      <!-- 内容列表 -->
      <article v-if="data.length === 0" class="no-list">{{ '暂无历史活动记录。' }}</article>
      <li v-if="data !== []"
        v-for="(item,index) in data"
        :key="index"
        class="record-list-info"
      >
        <div
          @click="handleClick(item.aid)"
        >
          <span class="list-state">- {{ setStatusFlag(item.act_flag) }} -</span>
          <article class="list-title">{{ item.act_name }}</article>
          <article class="list-creator">{{ '发起者: ' + item.branch + ' ' + item.act_creater }}</article>
          <article class="list-number">已报名{{ item.act_chk_sum }}位人员</article>
          <article class="list-date">{{ setDate(item.act_start_time) + ' 至 ' +setDate(item.act_end_time) + ' ' + item.ent_time}}</article>
        </div>
        <div class="separate" />
      </li>
      <div style="height: 60px"/>
    </Scroll>
    <el-button v-show="showIcon" icon="el-icon-caret-top" circle class="show-icon" @click="scrollUp"/>
  </div>
</template>

<script>
import Scroll from '@/components/Scroll'
import _switch from '../../components/statusSwitch'
export default {
  name: 'RecordList',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 上拉到-500时显示返回顶部按钮
    scroll (pos) {
      this.showIcon = (pos.y < -500)
      // console.log(pos)
    },
    // 点击图标回到顶部
    scrollUp () {
      this.toTop = true
      setTimeout(() => {
        this.toTop = false
      }, 20)
    },
    // 下拉刷新
    pullDownFresh () {
      this.$emit('fresh')
    },
    // 跳转到详情
    handleClick (aid) {
      this.$router.push({path: '/history_detail', query: { aid: aid }})
      this.$store.commit('pageReturnFlag', {column: 1})
    },
    // 活动状态转换
    setStatusFlag (flag) {
      // if (flag) {
      //   switch (flag) {
      //     case '0': return '进行中'
      //     case '1': return '已汇总'
      //     case '2': return '已完成'
      //     case '4': return '已取消'
      //     default: return '- undefined -'
      //   }
      // } else return '未设置'
      return _switch._statusSwitch(flag)
    },
    // 截止日期转换
    setDate (date) {
      // if (date) {
      //   return date.split(' ')[0]
      // } else return '未设置'
      return _switch._setDate(date)
    }
  },
  data () {
    return {
      loading: false,
      showIcon: false,
      toTop: false
    }
  },
  activated () {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 2000)
  },
  watch: {
    // 监听组件刷新
    update (newVal, oldVal) {
      // 每次下拉和查询时组件执行刷新
      if (newVal) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/content-list/list.styl"
  .record-list
    list($top: 60px)
  .no-list
    no-list()
  .separate
    separate()
  .record-list-info
    list-info()
  .show-icon
    show-icon()
  .el-popover
    min-width: 50px
    left: 620px
</style>
