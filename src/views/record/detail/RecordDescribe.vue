<template>
  <div class="describe">
    <div class="describe-info">
      <article class="list-title" @click="showDetail">{{ data.act_name }}</article>
      <article class="list-creator">{{ '发起者: ' + data.act_creater }}</article>
      <article class="list-state">- {{ setStatusFlag(data.act_flag) }} -</article>
      <article class="list-date">{{ '截止日期：' + setDate(data.act_end_time) }}</article>
      <article class="list-describe" @click="showDetail">{{'活动描述: ' + data.act_dtl }}</article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Describe',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 展示详情
    showDetail () {
      this.$notify.info({
        title: this.data.act_name,
        message: this.data.act_dtl,
        position: 'top-right',
        duration: 0
      })
    },
    // 活动状态转换
    setStatusFlag (flag) {
      if (flag) {
        switch (flag) {
          case '0': return '进行中'
          case '1': return '已汇总'
          case '2': return '已完成'
          case '4': return '已取消'
          default: return '- undefined -'
        }
      } else return '未设置'
    },
    // 日期转换
    setDate (date) {
      if (date) {
        return date.split(' ')[0]
      } else return '未设置'
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/describe.styl"
  .describe
    describe()
</style>
