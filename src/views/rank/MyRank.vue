<template>
  <div class="my-rank">
    <div class="item">
      <div class="item__title">
        <span>{{ '我的团队' }}</span>
        <span>{{ data[0].rank }}</span>
      </div>
      <div class="item__info">
        <span>团队名称：{{ data[0].groupName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyRank',
  props: {
    data: {
      type: Array,
      default: () => [
        {
          groupName: 'xxx团队',
          rank: '60',
          premium: 'xxxx'
        }
      ]
    }
  },
  data () {
    return {
      activeName: '',
      summary: ''
    }
  }
}
</script>

<style lang="stylus">
@import "~@/styles/element.styl"
.my-rank
  position: absolute
  left: 4px
  right: 4px
  bottom: 6px
  border-radius 8px
  background-color: #FFF
  padding 0 8px
  .item
    display: flex
    flex-direction: row
    white-space: nowrap
    .item__title
      display: flex
      flex-direction: column
      white-space: nowrap
      align-items: center
      margin 20px 0
      font-size 18px
      color $fontColor
    .item__info
      display: flex
      flex-direction: column
      text-overflow: ellipsis
      white-space: nowrap
      align-items: left
      margin 12px
      padding 8px 0
      line-height: 24px
      color: $fontColor
      font-size: 14px
      font-weight: 500
      outline: 0
    .item__button
      margin 32px 8px 32px auto
      padding 4px 8px
      font-size 14px
      height 24px
</style>
