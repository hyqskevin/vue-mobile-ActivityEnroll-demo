<template>
  <div class="describe">
    <div class="describe-info">
      <article class="list-title" @click="showDetail">{{ data.act_name }}</article>
      <article class="list-creator">{{ '发起者: ' + data.act_creater }}</article>
      <article class="list-state">- {{ statusSwitch(data.act_flag) }} -</article>
      <article class="list-date">{{ setDate(data.act_start_time) + ' 至 ' +setDate(data.act_end_time) + ' ' + data.ent_time }}</article>
      <article class="list-describe" @click="showDetail">{{'活动描述: ' + data.act_dtl }}</article>
      <article
        class="change-info"
        v-if="data.act_creater === $store.state.currentUserName"
        @click="handleClick(data.aid)">{{ '修改活动' }}
      </article>
    </div>
  </div>
</template>

<script>
import _switch from '../../components/statusSwitch'
export default {
  name: 'Describe',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 活动状态转换
    statusSwitch (flag) {
      return _switch._statusSwitch(flag)
    },
    // 日期转换
    setDate (date) {
      return _switch._setDate(date)
    },
    showDetail () {
      this.$notify.info({
        title: this.data.act_name,
        message: this.data.act_dtl,
        position: 'top-right',
        duration: 10000
      })
    },
    // 跳转到活动表
    handleClick (aid) {
      if (this.data.act_flag > 0) {
        this.$message.error('活动信息已汇总，无法再次修改活动内容！')
      } else {
        this.$router.push({ path: '/activity', query: { aid: aid } })
      }
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/describe.styl"
  .describe
    describe()
</style>
