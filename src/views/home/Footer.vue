<template>
  <div class="footer" v-if="list.length">
    <div class="footer-list">
      <router-link :to="{path: list[0].path, query: {aid: list[0].query}}">
        <el-icon :class="[list[0].icon, 'footer-icon']"></el-icon>
      </router-link>
      <span class="footer-name">{{ list[0].name }}</span>
    </div>
    <div class="footer-list">
      <router-link :to="{ path: list[1].path }">
        <el-icon :class="[list[1].icon, 'footer-icon']"></el-icon>
      </router-link>
      <span class="footer-name">{{ list[1].name }}</span>
    </div>
    <div class="footer-list">
      <router-link :to="{ path: list[2].path }">
        <el-icon :class="[list[2].icon, 'footer-icon']"></el-icon>
        <el-badge v-if="sum > 0" :value="sum" class="footer-item"></el-badge>
      </router-link>
      <span class="footer-name">{{ list[2].name }}</span>
    </div>
    <div class="footer-list">
      <router-link :to="{ path: list[3].path }">
        <el-icon :class="[list[3].icon, 'footer-icon']"></el-icon>
      </router-link>
      <span class="footer-name">{{ list[3].name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    sum: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/footer.styl"
  .footer
    footer()
</style>
