<template>
  <div :class="cname">
    <swiper
      ref="mySwiper"
      :options="swiperOptions"
      class="swiper"
    >
      <swiper-slide
        v-for="list in lists"
        :key="list.name"
      >
        <!-- vue 动态组件-->
        <component :is="list.component" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  name: 'Slider',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    cname: {
      type: String,
      default: ''
    },
    swiperOptions: {
      type: Object,
      default () {
        return {
          autoplay: false,
          loop: false,
          notNextTick: false,
          touchAngle: 6
        }
      }
    },
    lists: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    // 每次调用swiper实例时转为调用名字为swiper的方法，写起来方便
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    changeSlide (name) {
      this.swiper.slideTo(name, 500)
    },
    changeNav () {
      this.swiper.on('slideChangeStart', () => {
        const index = this.swiper.activeIndex
        this.$emit('changeNav', index)
      })
    }
  },
  mounted () {
    // 保证在DOM渲染完毕后初始化changeNav事件监听
    setTimeout(() => {
      this.changeNav()
    }, 20)
  },
  deactivated () {
    // 退出后返回第一页
    this.changeSlide(0)
  }
}
</script>

<style lang="stylus">
  .swiper
    // position relative
    touch-action none
</style>
