<template>
  <div :class="[shade, cname]">
  </div>
</template>

<script>
export default {
  name: 'Shade',
  props: {
    cname: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      shade: 'home-shade'
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/shade.styl"
  // 主页遮罩
  .home-shade
    shade()
  // 详情页遮罩
  .detail-shade
    shade($height: 136px)
  .record-shade
    shade($height: 105px)
</style>
