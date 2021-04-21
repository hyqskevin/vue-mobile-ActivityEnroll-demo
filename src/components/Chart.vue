<template>
  <div :class="className" id="myChart" :style="{marginLeft: '0',height: '320px', width: '100%'}"></div>
</template>

<script>
// import echarts from 'echarts'
export default {
  name: 'Chart',
  props: {
    className: '',
    data: {
      type: Array,
      default: () => [
        {value: 0, name: '<30'},
        {value: 0, name: '30-40'},
        {value: 12, name: '40-50'},
        {value: 10, name: '50-60'},
        {value: 4, name: '>60'}
      ]
    }
  },
  methods: {
    initChart () {
      // 基于准备好的dom，初始化echarts实例
      let echarts = require('echarts')
      require('echarts/lib/chart/pie')
      require('echarts/lib/component/title')
      require('echarts/lib/component/tooltip')
      require('echarts/lib/component/legend')
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '客户年龄分布',
          left: 'center'
        },
        tooltip: {
          formatter: '{a} <br/>{b} : {c}人'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          // orient: 'vertical',
          data: ['<30', '30-40', '40-50', '50-60', '>60']
        },
        // xAxis: {},
        // yAxis: {},
        series: [
          {
            name: '报名人数',
            type: 'pie',
            left: 0,
            radius: [20, 80],
            startAngle: 0,
            center: ['50%', '50%'],
            roseType: 'area',
            data: this.data
          }
        ]
      })
    }
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal) {
        this.initChart()
      }
    }
  }
}
</script>
