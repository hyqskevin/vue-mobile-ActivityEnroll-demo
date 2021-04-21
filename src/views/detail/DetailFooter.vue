<template>
  <div class="detail-footer" v-if="list.length">
    <div class="footer-list" @click="handleClick">
      <el-icon :class="[list[0].icon, 'footer-icon']"></el-icon>
      <span class="footer-name" v-if="!checkin">{{ list[0].name }}</span>
      <span class="footer-name" v-if="checkin">{{ list[0].switchName }}</span>
    </div>
    <div class="footer-list">
      <router-link :to="{path: list[1].path, query: {aid: this.aid}}">
        <el-icon :class="[list[1].icon, 'footer-icon']"></el-icon>
      </router-link>
      <span class="footer-name" v-if="!checkCollect">{{ list[1].name }}</span>
      <span class="footer-name" v-if="checkCollect">{{ list[1].switchName }}</span>
    </div>
    <div class="footer-list" @click="handleDelete">
      <el-icon :class="[list[2].icon, 'footer-icon']"></el-icon>
      <span class="footer-name">{{ list[2].name }}</span>
    </div>
    <div class="footer-list" @click="handleFinish">
      <el-icon :class="[list[3].icon, 'footer-icon']"></el-icon>
      <span class="footer-name">{{ list[3].name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailFooter',
  props: {
    aid: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    },
    checkin: {
      type: Boolean,
      default: false
    },
    checkCollect: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 向父组件传值，改变查看列表组件标志位
    handleClick () {
      this.$emit('checkout', !this.checkin)
    },
    // 向父组件传值，触发删除
    handleDelete () {
      this.$emit('delete')
    },
    // 触发报名
    handleFinish () {
      this.$emit('finish')
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/footer.styl"
  .detail-footer
    footer()
</style>
