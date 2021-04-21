<template>
  <div class="search">
    <el-date-picker
      class="date-picker"
      size="mini"
      v-model="start"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      :editable="false"
      placeholder="开始日期">
    </el-date-picker>
    <span style="padding: 12px 0">至</span>
    <el-date-picker
      class="date-picker"
      size="mini"
      v-model="end"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      :editable="false"
      placeholder="结束日期">
    </el-date-picker>
    <el-button
      type="primary"
      icon="el-icon-search"
      size="mini"
      round
      class="search-button"
      @click="search"
    >搜索</el-button>
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
    search () {
      this.$emit('search', [this.start, this.end])
    }
  },
  data () {
    return {
      start: '',
      end: ''
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/search.styl"
  .search
    search()
</style>
