<template>
  <div :class="[header, cname]">
    <div>{{ title }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: 'title'
    },
    cname: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      header: 'header'
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/header.styl"
  .header
    header()
</style>
