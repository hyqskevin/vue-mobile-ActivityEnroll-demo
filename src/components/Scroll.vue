<template>
  <div
    ref="wrapper"
    class="wrapper"
  >
    <ul class="scroll-content">
      <!-- 刷新提示信息 -->
      <div class="top-tip">
        <el-icon class="el-icon-loading"></el-icon>
        <span class="refresh-hook">{{ pullDownMsg }}</span>
      </div>
      <!-- 内容列表 -->
      <slot />
      <!-- 底部提示信息 -->
      <div class="bottom-tip">
        <span class="loading-hook">{{ pullUpMsg }}</span>
      </div>
    </ul>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'Scroll',
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    // 点击列表是否派发click事件
    click: {
      type: Boolean,
      default: true
    },
    // 是否开启横向滚动
    scrollX: {
      type: Boolean,
      default: false
    },
    // 是否监听滚动事件
    listenScroll: {
      type: Boolean,
      default: true
    },
    // 是否派发顶部下拉的事件，用于下拉刷新
    pullDown: {
      type: Boolean,
      default: false
    },
    pullDownRefresh: {
      type: Boolean,
      default: true
    },
    // 是否派发列表滚动开始的事件
    beforeScroll: {
      type: Boolean,
      default: false
    },
    // 当数据更新后，刷新scroll的延时。
    refreshDelay: {
      type: Number,
      default: 20
    },
    // 返回顶部事件
    toTop: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        pullDownRefresh: this.pullDownRefresh
      })
      // 是否派发滚动事件（下拉刷新提示，上拉显示返回顶部按钮）
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          // 下拉到一定地方刷新
          if (pos.y > 80) {
            // console.log('执行下拉刷新提示')
            this.pullDownMsg = '释放后进行刷新'
          }
          this.$emit('scroll', pos)
        })
      }
      this.scroll.on('pullingDown', () => {
        // console.log('执行下拉刷新操作')
        setTimeout(() => {
          this.$emit('pullDownFresh')
        }, 20)
        this.scroll.finishPullDown()
        this.scroll.refresh()
        setTimeout(() => {
          this.pullDownMsg = '-下拉刷新-'
        }, 200)
      })
    },
    // disable () {
    //   // 代理better-scroll的disable方法
    //   this.scroll && this.scroll.disable()
    // },
    // enable () {
    //   // 代理better-scroll的enable方法
    //   this.scroll && this.scroll.enable()
    // },
    refresh () {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    }
    // scrollToElement () {
    //   // 代理better-scroll的scrollToElement方法
    //   this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    // }
  },
  data () {
    return {
      pullDownMsg: '-下拉刷新-',
      pullUpMsg: '-到底了-'
    }
  },
  mounted () {
    // 保证在DOM渲染完毕后初始化better-scroll
    this.$nextTick(() => {
      this._initScroll()
    }, 200)
  },
  watch: {
    // 回到开头
    toTop () {
      // console.log(this.toTop)
      if (this.toTop) {
        setTimeout(() => {
          this.scrollTo(0, 0, 1000)
        }, 20)
      }
    },
    // 延时之后调用refresh方法重新计算，保证滚动效果正常
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/styles/scroll.styl"
</style>
