<template>
  <div id="bargraph" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/lib/chart/bar')
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      bargraphChart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        // console.log(val)
        this.setOptions(val)
      }
    }
  },
  mounted() {
    // console.log(this.chartData)
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // this.bargraphChart.setOption(val)
    setOptions(barchar) {
      // console.log(barchar)
      // this.bargraphChart = echarts.init(document.getElementById('bargraph'))
      this.chart.configParameters = {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        distance: {
          min: 0,
          max: 100
        }
      }
      this.chart.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
      this.chart.setOption({
        color: ['#003366', '#006699', '#4cabce', '#e5323e'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: barchar ? barchar.team : ['加载中', '乙值', '丙值', '丁值']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          top: 'center',
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        title: {
          text: barchar ? barchar.title : 'loading'
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: barchar ? barchar.xAxis : ['0', '0', '0', '0', '0', '0', '0'],
            axisLabel: {
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: { formatter: '{value} (min)' }
          }
        ],
        series: barchar ? barchar.series : [
          {
            name: '加载中',
            type: 'bar',
            data: [0, 0, 0, 0, 0, 0, 0]
          }
          // {
          //   name: '乙值',
          //   type: 'bar',
          //   data: [0, 0, 0, 0, 0, 0, 0]
          // },
          // {
          //   name: '丙值',
          //   type: 'bar',
          //   data: [0, 0, 0, 0, 0, 0, 0]
          // },
          // {
          //   name: '丁值',
          //   type: 'bar',
          //   data: [0, 0, 0, 0, 0, 0, 0]
          // }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      // console.log(this.chartData)
      this.setOptions()
    }
  }
}
</script>
