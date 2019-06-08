<template>
  <div id="linear" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
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
      linearChart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }
    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions(linechar) {
      // this.linearChart = echarts.init(document.getElementById('linear'))
      this.chart.setOption({
        title: {
          text: linechar ? linechar.title : 'loading'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: linechar ? linechar.team : ['汽机', '锅炉', '电气', '化工']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: linechar ? linechar.xAxis : ['0', '0', '0', '0', '0', '0', '0']
        },
        yAxis: {
          type: 'value',
          axisLabel: { formatter: '{value} (min)' }
        },
        series: linechar ? linechar.series : [
          {
            name: 'title',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0]
          }
          // {
          //   name: '锅炉',
          //   type: 'line',
          //   data: [0, 0, 0, 0, 0, 0, 0]
          // },
          // {
          //   name: '电气',
          //   type: 'line',
          //   data: [0, 0, 0, 0, 0, 0, 0]
          // },
          // {
          //   name: '化工',
          //   type: 'line',
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
