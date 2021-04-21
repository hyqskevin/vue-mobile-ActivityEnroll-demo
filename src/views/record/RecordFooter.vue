<template>
  <div class="record-footer" v-if="list.length">
    <div class="footer-list" :key="index" v-for="(item, index) in list" @click="handleClick(index)">
      <el-icon :class="[item.icon, num===index ? 'footer-icon-chosen' : 'footer-icon']"></el-icon>
      <span :class="[num===index ? 'footer-name-chosen' : 'footer-name']">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecordFooter',
  props: {
    num: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClick (index) {
      this.num = index
      this.$emit('change', index)
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/footer.styl"
  .record-footer
    footer()
</style>
