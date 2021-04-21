<template>
  <div class="record-search">
    <div class="record-search-date">
      <el-date-picker
        class="date-picker"
        size="mini"
        v-model="start"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :editable="false"
        placeholder="开始日期">
      </el-date-picker>
      <span style="margin: 0 4px; padding: 12px 0">至</span>
      <el-date-picker
        class="date-picker"
        size="mini"
        v-model="end"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :editable="false"
        placeholder="结束日期">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchList',
  props: {
    update: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 传递搜索参数
    recordSearch () {
      this.$emit('search', [this.start, this.end, this.value])
    }
  },
  data () {
    return {
      start: '',
      end: '',
      value: '',
      chooseList: []
    }
  },
  activated () {
    this.chooseBranchList()
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/search.styl"
    .record-search
      record-search()
</style>
