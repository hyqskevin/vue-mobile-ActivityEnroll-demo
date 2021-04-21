<template>
  <div class="home-list">
    <Scroll
      @scroll="scroll"
      @pullDownFresh="pullDownFresh"
      :to-top="toTop"
      v-loading="loading"
    >
      <!-- 内容列表 -->
      <article class="recent">{{ '可参与的活动:' }}</article>
      <div class="separate"/>
      <article v-if="data.length === 0" class="no-list">{{ '最近没有能参加的活动。' }}</article>
      <li v-if="data !== []"
        v-for="(item,index) in data"
        :key="index"
        class="home-list-info"
      >
        <div @click="handleClick(item.aid)">
          <span class="list-state">- {{ statusSwitch(item.act_flag) }} -</span>
          <article class="list-title">{{ item.act_name }}</article>
          <article class="list-creator" v-if="Number(item.act_role) === 3">{{ '发起者: ' + item.branch + ' ' + item.act_creater }}</article>
          <article class="list-creator" v-if="(Number(item.act_role) === 2) && (item.branch !== '宇洋')">{{ '发起者: ' + item.branch + '支公司 ' + item.act_creater }}</article>
          <article class="list-creator" v-if="(Number(item.act_role) === 2) && (item.branch === '宇洋')">{{ '发起者: ' + item.branch + '独立营业区 ' + item.act_creater }}</article>
          <article class="list-creator" v-if="Number(item.act_role) === 1">{{ '发起者: ' + item.branch + '作战单元 ' + item.act_creater + '团队' }}</article>
          <article class="list-number">已报名{{ item.act_chk_sum }}位销售人员</article>
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
  name: 'HomeList',
  components: {
    Scroll
  },
  props: {
    sum: {
      type: Number,
      default: 0
    },
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
    // 上拉到-200时显示返回顶部按钮
    scroll (pos) {
      this.showIcon = (pos.y < -200)
      // console.log(pos)
    },
    // 点击图标回到顶部
    scrollUp () {
      this.toTop = true
      setTimeout(() => {
        this.toTop = false
      }, 200)
    },
    // 下拉刷新
    pullDownFresh () {
      this.$emit('fresh')
    },
    // 活动状态转换
    statusSwitch (flag) {
      return _switch._statusSwitch(flag)
    },
    setDate (date) {
      return _switch._setDate(date)
    },
    // setStatusFlag (flag) {
    //   if (flag) {
    //     switch (flag) {
    //       case '0': return '进行中'
    //       case '1': return '已汇总'
    //       case '2': return '已完成'
    //       case '4': return '已取消'
    //       default: return '- undefined -'
    //     }
    //   } else return '未设置'
    // },
    // 截止日期转换
    // setDate (date) {
    //   if (date) {
    //     return date.split(' ')[0]
    //   } else return '未设置'
    // },
    // 显示已参与活动提示信息
    notify (role) {
      if (this.sum > 0 && role < 2) {
        this.$notify({
          message: '您已参与' + this.sum + '个活动，请在"我的活动"中查看。',
          type: 'info',
          position: 'bottom-right',
          offset: 60,
          duration: 5000
        })
      }
    },
    // 跳转详情链接
    handleClick (aid) {
      this.$router.push({path: '/detail', query: {aid: aid}})
      this.$store.commit('pageReturnFlag', {column: 0})
    }
  },
  data () {
    return {
      loading: false,
      showIcon: false,
      toTop: false
    }
  },
  watch: {
    // 监听组件刷新
    sum (newVal, oldVal) {
      if (newVal) {
        let role = Number(this.$store.state.currentRole)
        this.notify(role)
      }
    },
    update (newVal, oldVal) {
      // 每次下拉和查询时组件执行刷新
      if (newVal) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 2000)
      }
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/content-list/list.styl"
  .home-list
    list()
  .recent
    recent()
  .no-list
    no-list()
  .home-list-info
    list-info()
  .separate
    separate()
  .show-icon
    show-icon()
</style>
