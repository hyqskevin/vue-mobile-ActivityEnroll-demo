<template>
  <div :class="[button, cname]">
    <div>{{ title }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BigBtn',
  props: {
    cname: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'title'
    }
  },
  data () {
    return {
      button: 'button'
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/button.styl"
  .blueBtn
    bigBtn($btnColor: $btnBlue)
  .greenBtn
    bigBtn($btnColor: $btnGreen)
</style>
