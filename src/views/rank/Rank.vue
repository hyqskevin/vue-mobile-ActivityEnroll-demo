<template>
  <div>
    <Header :title="'排名信息'">
      <el-button
        icon="el-icon-arrow-left"
        circle
        class="arrow"
        @click="backClick"
      />
    </Header>
    <div class="content">
      <rank-list :data="rankData" @update="getWeekRank"></rank-list>
<!--      <my-rank></my-rank>-->
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import MyRank from './MyRank'
import api from '@/plugins/api'
export default {
  name: 'Rank',
  components: {
    MyRank,
    Header
  },
  data () {
    return {
      rankData: []
    }
  },
  methods: {
    // 获取周排名信息
    getWeekRank () {
      let uid = this.$store.state.currentUid
      api._getWeekRank(uid).then(res => {
        if (Number(res.resultCode) === 0) {
          this.rankData = []
        } else if (Number(res.resultCode) === -1) {
          this.$message.error('参数错误，请重试！')
        } else {
          let data = res.applInfo
          for (let i in data) {
            if ((Number(data[i].pre_prem_num) !== 0) || (Number(data[i].pre_prem_sum) !== 0)) {
              this.rankData.push(data[i])
            }
          }
        }
        console.log('getWeekRank:', this.rankData)
      })
    },
    // 返回上级页面
    backClick () {
      this.$router.push({path: '/', query: {uid: this.$store.state.currentUid}})
    }
  },
  mounted () {
    this.getWeekRank()
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/header.styl"
  @import "~@/styles/element.styl"
  // header按钮
  .arrow
    left-arrow()
  .content
    content()
</style>
