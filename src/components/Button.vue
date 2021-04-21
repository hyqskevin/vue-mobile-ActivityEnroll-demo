<template>
  <div :class="[btn, cname]">
    <div>{{ title }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Button',
  props: {
    cname: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      btn: 'btn'
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/button.styl"
  .btn
    btn()
</style>
